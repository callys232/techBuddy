import { createServerClient } from "@/lib/supabase/client";

export const POINTS_RULES = { watchAd: 10, toolUse: 5, referral: 100, subscribe: 250 } as const;
export const POINTS_PER_USD = 100;
export const TOPUP_PRESETS_USD = [5, 10, 25, 50] as const;

/** Time-based passes live here; permanent tool unlocks come from the product catalogue. */
export const POINTS_REWARDS = [
  { id: "all-tools-premium-month", label: "All Premium tools for 30 days", cost: 1200 },
] as const;
export type RewardId = (typeof POINTS_REWARDS)[number]["id"];

const normalize = (email: string) => email.toLowerCase().trim();

export async function getPointsBalance(email: string): Promise<number> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("points_balances").select("balance").eq("email", normalize(email)).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.balance ?? 0;
}

export async function awardPoints(email: string, amount: number, reason: string, idempotencyKey?: string): Promise<number> {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("Invalid points amount");
  const { data, error } = await createServerClient().rpc("mutate_points", {
    p_email: normalize(email), p_delta: amount, p_reason: reason, p_idempotency_key: idempotencyKey ?? null,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function spendPoints(email: string, amount: number, reason: string, idempotencyKey?: string): Promise<number> {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("Invalid points amount");
  const { data, error } = await createServerClient().rpc("mutate_points", {
    p_email: normalize(email), p_delta: -amount, p_reason: reason, p_idempotency_key: idempotencyKey ?? null,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function countTodayTransactions(email: string, reason: string): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const { count, error } = await createServerClient().from("points_transactions").select("id", { count: "exact", head: true })
    .eq("email", normalize(email)).eq("reason", reason).gte("created_at", start.toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function redeemPremiumMonth(email: string, userId: string, cost: number, idempotencyKey: string) {
  const { data, error } = await createServerClient().rpc("redeem_premium_month", {
    p_email: normalize(email), p_user_id: userId, p_cost: cost, p_idempotency_key: idempotencyKey,
  });
  if (error) throw new Error(error.message);
  return data;
}
