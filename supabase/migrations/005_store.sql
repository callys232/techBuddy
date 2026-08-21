-- ─── Store catalog ──────────────────────────────────────────────────────────
-- "Tools we upload" — a real, database-backed catalog instead of the old
-- hardcoded 3-item POINTS_REWARDS array, so new items can be added by writing
-- a row (and, for downloads, uploading a file to the 'products' storage
-- bucket) without a code deploy.

create table if not exists public.products (
  id             uuid        primary key default gen_random_uuid(),
  slug           text        not null unique,
  name           text        not null,
  description    text        not null,
  type           text        not null check (type in ('download', 'unlock')),
  price_points   integer     not null,
  file_path      text,       -- storage path in the 'products' bucket — type=download
  unlock_key     text,       -- feature identifier checked by isUnlocked() — type=unlock
  category       text,
  active         boolean     not null default true,
  created_at     timestamptz not null default now()
);

alter table public.products enable row level security;
-- No anon/authenticated policies — the catalog is read through the API
-- (service-role), not queried directly from the client.

create index if not exists products_active_idx on public.products (active);

-- ─── Purchases ──────────────────────────────────────────────────────────────
-- One row per (email, product) — also doubles as the access-check table for
-- both re-downloading a file and checking whether an unlock is owned.

create table if not exists public.purchases (
  id                  uuid        primary key default gen_random_uuid(),
  email               text        not null,
  product_id          uuid        not null references public.products(id),
  price_paid_points   integer     not null,
  created_at          timestamptz not null default now()
);

alter table public.purchases enable row level security;

create index if not exists purchases_email_idx on public.purchases (email);
create unique index if not exists purchases_email_product_idx on public.purchases (email, product_id);

-- ─── Storage bucket for downloadable product files ─────────────────────────
-- Private — files are only ever served via short-lived signed URLs generated
-- server-side after a purchase is verified, never a public bucket URL.

insert into storage.buckets (id, name, public)
values ('products', 'products', false)
on conflict (id) do nothing;

-- No storage.objects policies for anon/authenticated — every read goes
-- through the service-role client when generating a signed URL.

-- ─── Seed: real unlock-type products using features that already exist ────
-- Download-type products need an actual file uploaded to the 'products'
-- bucket first, so none are seeded here — add those rows once a real file
-- is uploaded via the Supabase dashboard.

insert into public.products (slug, name, description, type, price_points, unlock_key, category, active)
values
  (
    'resume-premium-templates',
    'Executive & Technical Resume Templates',
    'Unlock the two premium resume templates (Executive, Technical) plus AI-powered resume suggestions — no subscription required, this unlock never expires.',
    'unlock',
    500,
    'resume-premium-templates',
    'Resume Maker',
    true
  ),
  (
    'premium-audit-unlock',
    'Unlimited Premium Audit Reports',
    'Unlock the automated deep-dive audit (security headers, SEO, performance) as a branded PDF, any time — no subscription required, this unlock never expires.',
    'unlock',
    300,
    'premium-audit-unlock',
    'Premium Audit',
    true
  )
on conflict (slug) do nothing;
