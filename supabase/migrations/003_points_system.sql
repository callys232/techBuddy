-- ─── Points balances ──────────────────────────────────────────────────────────
-- Running balance per user. Points are a closed-loop ecosystem currency —
-- never cashed out, only earned and spent within TechBuddy (discounts on
-- Resume Premium, unlocking a premium template, quote discounts, etc).

create table if not exists public.points_balances (
  email       text        primary key,
  balance     integer     not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.points_balances enable row level security;
-- No anon/authenticated policies — only the service-role key (server-side
-- routes) ever writes here, same pattern as subscriptions.

-- ─── Points transactions ──────────────────────────────────────────────────────
-- Full audit ledger — every earn/spend is a row here. The balance in
-- points_balances is a cached sum, always derivable by re-summing this table.

create table if not exists public.points_transactions (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null,
  delta       integer     not null,          -- positive = earned, negative = spent
  reason      text        not null,          -- 'watch_ad' | 'tool_use' | 'referral' | 'subscribe' | 'redeem:<reward_id>'
  created_at  timestamptz not null default now()
);

alter table public.points_transactions enable row level security;

create index if not exists points_tx_email_idx   on public.points_transactions (email);
create index if not exists points_tx_created_idx on public.points_transactions (created_at desc);
