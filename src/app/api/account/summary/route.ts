import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/client";
import { getPointsBalance, POINTS_REWARDS } from "@/lib/points";
import { listPurchases } from "@/lib/store";
import { getVerifiedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const email = user.email;

  const supabase = createServerClient();

  const subscriptionQuery = supabase
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const transactionsQuery = supabase
    .from("points_transactions")
    .select("delta, reason, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(50);
  const profileQuery = supabase.from("profiles").select("display_name, primary_goal, marketing_opt_in, onboarding_completed_at").eq("user_id", user.id).maybeSingle();
  const entitlementsQuery = supabase.from("entitlements").select("id, entitlement_key, source, status, starts_at, ends_at").eq("email", email).order("created_at", { ascending: false });
  const paymentsQuery = supabase.from("payment_orders").select("id, provider, product_key, amount, currency, status, created_at").eq("email", email).order("created_at", { ascending: false }).limit(50);
  const deletionQuery = supabase.from("account_deletion_requests").select("id, status, created_at, reviewed_at, admin_note").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();

  const [subscriptionResult, balance, transactionsResult, purchases, profileResult, entitlementsResult, paymentsResult, deletionResult] = await Promise.all([
    subscriptionQuery, getPointsBalance(email), transactionsQuery, listPurchases(email), profileQuery, entitlementsQuery, paymentsQuery, deletionQuery,
  ]);
  const error = subscriptionResult.error || transactionsResult.error || profileResult.error || entitlementsResult.error || paymentsResult.error || deletionResult.error;
  if (error) return NextResponse.json({ error: "Could not load complete account history" }, { status: 500 });

  return NextResponse.json({
    email,
    profile: profileResult.data ?? null,
    subscription: subscriptionResult.data ?? null,
    entitlements: entitlementsResult.data ?? [],
    payments: paymentsResult.data ?? [],
    deletionRequest: deletionResult.data ?? null,
    points: { balance, rewards: POINTS_REWARDS, transactions: transactionsResult.data ?? [] },
    purchases,
  });
}
