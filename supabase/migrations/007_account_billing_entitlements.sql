-- Production account, billing, points and entitlement foundations.
-- Apply after 006_ad_token_nonces.sql.

alter table public.points_balances
  add constraint points_balances_non_negative check (balance >= 0);
alter table public.points_transactions
  add column if not exists idempotency_key text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;
create unique index if not exists points_tx_idempotency_idx
  on public.points_transactions (idempotency_key) where idempotency_key is not null;

alter table public.products
  add constraint products_positive_price check (price_points > 0);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  email text not null unique,
  display_name text,
  primary_goal text,
  marketing_opt_in boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  provider text not null check (provider in ('paystack','stripe','paypal','nowpayments','points')),
  provider_reference text,
  product_key text not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null,
  status text not null default 'pending' check (status in ('pending','processing','paid','failed','cancelled','refunded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.payment_orders enable row level security;
create unique index if not exists payment_orders_provider_ref_idx
  on public.payment_orders(provider, provider_reference) where provider_reference is not null;
create index if not exists payment_orders_email_idx on public.payment_orders(email, created_at desc);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'processing' check (status in ('processing','processed','failed','ignored')),
  payload jsonb not null,
  error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique(provider, provider_event_id)
);
alter table public.webhook_events enable row level security;

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete restrict,
  email text not null,
  entitlement_key text not null,
  source text not null check (source in ('points','paystack','stripe','paypal','nowpayments','admin')),
  source_reference text not null,
  status text not null default 'active' check (status in ('active','revoked','expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source, source_reference, entitlement_key)
);
alter table public.entitlements enable row level security;
create index if not exists entitlements_email_key_idx on public.entitlements(email, entitlement_key, ends_at);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  email text not null,
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','completed','cancelled')),
  admin_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.account_deletion_requests enable row level security;
create unique index if not exists one_pending_deletion_per_user
  on public.account_deletion_requests(user_id) where status = 'pending';

-- Atomic ledger mutation. A duplicate idempotency key returns the current balance.
create or replace function public.mutate_points(
  p_email text,
  p_delta integer,
  p_reason text,
  p_idempotency_key text default null,
  p_metadata jsonb default '{}'::jsonb
) returns integer
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(p_email)); v_balance integer;
begin
  if p_delta = 0 then raise exception 'Point amount cannot be zero'; end if;
  if p_idempotency_key is not null and exists(
    select 1 from points_transactions where idempotency_key = p_idempotency_key
  ) then
    select balance into v_balance from points_balances where email = v_email;
    return coalesce(v_balance, 0);
  end if;

  insert into points_balances(email, balance) values(v_email, 0)
    on conflict(email) do nothing;
  select balance into v_balance from points_balances where email = v_email for update;
  if v_balance + p_delta < 0 then raise exception 'Not enough points' using errcode = 'P0001'; end if;

  insert into points_transactions(email, delta, reason, idempotency_key, metadata)
    values(v_email, p_delta, p_reason, p_idempotency_key, coalesce(p_metadata, '{}'::jsonb));
  update points_balances set balance = balance + p_delta, updated_at = now()
    where email = v_email returning balance into v_balance;
  return v_balance;
end $$;

-- Atomic purchase: ownership and points deduction commit together.
create or replace function public.purchase_product_with_points(
  p_email text, p_product_slug text, p_idempotency_key text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_email text := lower(trim(p_email)); v_product products%rowtype; v_balance integer; v_purchase purchases%rowtype;
begin
  select * into v_product from products where slug = p_product_slug and active = true for update;
  if not found then raise exception 'Product not found'; end if;
  if exists(select 1 from purchases where email=v_email and product_id=v_product.id) then raise exception 'You already own this'; end if;
  v_balance := mutate_points(v_email, -v_product.price_points, 'purchase:' || v_product.slug, p_idempotency_key,
    jsonb_build_object('product_id', v_product.id, 'product_slug', v_product.slug));
  insert into purchases(email, product_id, price_paid_points) values(v_email, v_product.id, v_product.price_points)
    returning * into v_purchase;
  return jsonb_build_object('balance', v_balance, 'purchase_id', v_purchase.id, 'product_id', v_product.id,
    'product_name', v_product.name, 'product_type', v_product.type);
end $$;

-- Atomic timed Premium pass redemption.
create or replace function public.redeem_premium_month(
  p_email text, p_user_id uuid, p_cost integer, p_idempotency_key text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_balance integer; v_end timestamptz; v_ref text := p_idempotency_key;
begin
  v_balance := mutate_points(p_email, -p_cost, 'redeem:all-tools-premium-month', p_idempotency_key,
    jsonb_build_object('entitlement_key','premium-all-tools'));
  select greatest(now(), coalesce(max(ends_at), now())) + interval '30 days' into v_end
    from entitlements where email=lower(trim(p_email)) and entitlement_key='premium-all-tools' and status='active';
  insert into entitlements(user_id,email,entitlement_key,source,source_reference,ends_at)
    values(p_user_id,lower(trim(p_email)),'premium-all-tools','points',v_ref,v_end)
    on conflict(source,source_reference,entitlement_key) do nothing;
  return jsonb_build_object('balance',v_balance,'ends_at',v_end);
end $$;

insert into public.products(slug,name,description,type,price_points,unlock_key,category,active)
values
 ('business-plan-unlock','Business Plan Generator','Create and export premium business plans without a subscription.','unlock',700,'business-plan-generator','Business planning',true),
 ('all-tools-premium-month','All-tools Premium — 30 days','Unlock every premium TechBuddy tool for 30 days.','unlock',1200,'premium-all-tools','Premium pass',true)
on conflict(slug) do update set name=excluded.name, description=excluded.description, price_points=excluded.price_points,
 unlock_key=excluded.unlock_key, category=excluded.category, active=true;

-- Remove the unsafe anonymous member-write policies. Profile writes now go through authenticated server APIs.
drop policy if exists "Anyone can join resume members" on public.resume_members;
drop policy if exists "Anyone can update resume member" on public.resume_members;
