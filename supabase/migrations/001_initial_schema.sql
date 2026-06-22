-- ─── Tables ────────────────────────────────────────────────────────────────────

create table if not exists public.quote_requests (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  email           text        not null,
  whatsapp        text        not null,
  company         text,
  pain_points     text[]      not null default '{}',
  template_id     text,
  budget_range    integer     not null,
  timeline        text        not null,
  features        text[]      not null default '{}',
  contact_method  text        not null,
  source          text,
  created_at      timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  department  text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.newsletter_subs (
  id             uuid        primary key default gen_random_uuid(),
  email          text        not null unique,
  tags           text[]      not null default '{}',
  status         text        not null default 'active',
  subscribed_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  email             text        not null,
  booking_datetime  timestamptz not null,
  service_type      text,
  notes             text,
  created_at        timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.quote_requests    enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.newsletter_subs   enable row level security;
alter table public.bookings          enable row level security;

-- Public can INSERT (form submissions); only service_role can SELECT/UPDATE/DELETE
-- service_role bypasses RLS entirely, so no explicit policy needed for admin reads.

create policy "anon_insert_quote_requests"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

create policy "anon_insert_contact_messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "anon_insert_newsletter_subs"
  on public.newsletter_subs for insert
  to anon, authenticated
  with check (true);

create policy "anon_upsert_newsletter_subs"
  on public.newsletter_subs for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon_insert_bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists quote_requests_email_idx   on public.quote_requests  (email);
create index if not exists quote_requests_created_idx on public.quote_requests  (created_at desc);
create index if not exists contact_created_idx        on public.contact_messages (created_at desc);
create index if not exists newsletter_email_idx       on public.newsletter_subs  (email);
create index if not exists bookings_datetime_idx      on public.bookings         (booking_datetime);

-- ─── Audit Requests ───────────────────────────────────────────────────────────

create table if not exists public.audit_requests (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  email        text        not null,
  website_url  text        not null,
  audit_types  text[]      not null default '{}',
  created_at   timestamptz not null default now()
);

alter table public.audit_requests enable row level security;

create policy "anon_insert_audit_requests"
  on public.audit_requests for insert
  to anon, authenticated
  with check (true);

create index if not exists audit_requests_email_idx   on public.audit_requests (email);
create index if not exists audit_requests_created_idx on public.audit_requests (created_at desc);
