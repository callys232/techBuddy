import { createServerClient } from "@/lib/supabase/client";

/** Earn amounts — tune here, not scattered across call sites. */
export const POINTS_RULES = {
  watchAd: 10,
  toolUse: 5,
  referral: 100,
  subscribe: 250,
} as const;

/** What points can actually buy — the "closed loop." Redeeming debits the
 *  ledger; what it unlocks is enforced by whatever calls redeemPoints(). */
export const POINTS_REWARDS = [
  { id: "premium-template-unlock", label: "Unlock 1 premium resume template (this download only)", cost: 300 },
  { id: "resume-premium-month",    label: "1 month of Resume Premium",                              cost: 1200 },
  { id: "quote-discount-10",       label: "₦50k off your next project quote",                        cost: 2000 },
] as const;

export type RewardId = (typeof POINTS_REWARDS)[number]["id"];

function normalize(email: string) {
  return email.toLowerCase().trim();
}

export async function getPointsBalance(email: string): Promise<number> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("points_balances")
      .select("balance")
      .eq("email", normalize(email))
      .maybeSingle();
    return data?.balance ?? 0;
  } catch {
    return 0;
  }
}

/** Records the transaction and bumps the cached balance. Not a single atomic
 *  DB transaction (Supabase JS client doesn't expose multi-statement
 *  transactions), so balance is a best-effort cache — points_transactions is
 *  the source of truth if it ever needs reconciling. */
export async function awardPoints(email: string, amount: number, reason: string): Promise<number> {
  const supabase = createServerClient();
  const normalized = normalize(email);

  await supabase.from("points_transactions").insert({ email: normalized, delta: amount, reason });

  const current = await getPointsBalance(normalized);
  const next = current + amount;
  await supabase.from("points_balances").upsert({ email: normalized, balance: next }, { onConflict: "email" });

  return next;
}

/** Counts how many times `reason` was awarded to this email since UTC midnight — used for daily caps. */
export async function countTodayTransactions(email: string, reason: string): Promise<number> {
  const supabase = createServerClient();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("points_transactions")
    .select("id", { count: "exact", head: true })
    .eq("email", normalize(email))
    .eq("reason", reason)
    .gte("created_at", startOfDay.toISOString());

  return count ?? 0;
}

/** Grants what a reward actually unlocks. Only "resume-premium-month" has an
 *  automatic effect (activates/extends the subscriptions row); the other
 *  rewards are ledger-only — fulfilled manually (template unlock flag on
 *  next download, quote discount applied by sales) since they're one-off
 *  and don't have a standing table to flip. */
export async function fulfillReward(email: string, rewardId: RewardId): Promise<void> {
  if (rewardId !== "resume-premium-month") return;

  const supabase = createServerClient();
  const normalized = normalize(email);

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("current_period_end, status")
    .eq("email", normalized)
    .maybeSingle();

  const base =
    existing?.status === "active" && existing.current_period_end && new Date(existing.current_period_end) > new Date()
      ? new Date(existing.current_period_end)
      : new Date();
  const periodEnd = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("subscriptions").upsert(
    { email: normalized, status: "active", plan: "Resume Premium (Points)", current_period_end: periodEnd },
    { onConflict: "email" }
  );
}

/** Throws if the balance can't cover the spend — caller decides how to surface that. */
export async function spendPoints(email: string, amount: number, reason: string): Promise<number> {
  const normalized = normalize(email);
  const current = await getPointsBalance(normalized);
  if (current < amount) throw new Error("Not enough points");

  const supabase = createServerClient();
  await supabase.from("points_transactions").insert({ email: normalized, delta: -amount, reason });

  const next = current - amount;
  await supabase.from("points_balances").upsert({ email: normalized, balance: next }, { onConflict: "email" });

  return next;
}
