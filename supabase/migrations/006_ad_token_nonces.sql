-- ─── Ad-watch token nonces ──────────────────────────────────────────────────
-- issueWatchToken() signs {email, startedAt} but nothing marked a token as
-- spent — the same valid token could be resubmitted to watch-ad/complete
-- repeatedly (bounded only by the 5/day count check), turning one 15-second
-- wait into up to 5x the intended points. Each token now carries a random
-- jti; the unique constraint here makes "already used" a single failed
-- insert instead of a separate read-then-write race.

create table if not exists public.used_ad_tokens (
  jti        text        primary key,
  email      text        not null,
  used_at    timestamptz not null default now()
);

alter table public.used_ad_tokens enable row level security;
-- No anon/authenticated policies — only the service-role key (server-side
-- watch-ad/complete route) ever touches this table.

create index if not exists used_ad_tokens_used_at_idx on public.used_ad_tokens (used_at);
