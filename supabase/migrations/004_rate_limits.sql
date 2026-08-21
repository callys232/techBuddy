-- ─── Rate limits ────────────────────────────────────────────────────────────
-- Fixed-window counter backed by a real table (not an in-memory Map) so the
-- limit holds across serverless cold starts / multiple instances. Keyed as
-- "<bucket>:<identifier>", e.g. "name-generator:203.0.113.5".

create table if not exists public.rate_limits (
  key           text        primary key,
  count         integer     not null default 1,
  window_start  timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
-- No anon/authenticated policies — only the service-role key (server-side
-- routes) ever touches this table.

create index if not exists rate_limits_window_idx on public.rate_limits (window_start);
