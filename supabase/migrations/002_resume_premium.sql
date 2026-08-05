-- ─── Resume Members ───────────────────────────────────────────────────────────
-- Free-account signups gating resume PDF downloads (magic-link OTP via Supabase Auth).

create table if not exists public.resume_members (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  name        text        not null,
  created_at  timestamptz not null default now()
);

alter table public.resume_members enable row level security;

create policy "anon_upsert_resume_members"
  on public.resume_members for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_own_resume_member"
  on public.resume_members for update
  to anon, authenticated
  using (true)
  with check (true);

create index if not exists resume_members_email_idx on public.resume_members (email);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
-- Tracks Resume Premium billing state, kept in sync by the Paystack webhook
-- (see src/app/api/payments/webhook/route.ts). Never written to from the client —
-- only the service-role key (server-side) inserts/updates this table.

create table if not exists public.subscriptions (
  id                          uuid        primary key default gen_random_uuid(),
  email                       text        not null,
  status                      text        not null default 'inactive', -- 'active' | 'non-renewing' | 'inactive'
  plan                        text        not null default 'Resume Premium',
  paystack_customer_code      text,
  paystack_subscription_code  text,
  current_period_end          timestamptz,
  created_at                  timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- No anon/authenticated policies — this table is only ever touched by the
-- service-role key (webhook + status check), which bypasses RLS entirely.
-- Explicitly no public policies means the anon/authenticated roles get zero
-- access if a client-side key is ever used against it by mistake.

create unique index if not exists subscriptions_email_idx on public.subscriptions (email);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
