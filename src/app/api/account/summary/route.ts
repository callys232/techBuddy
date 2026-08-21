import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/client";
import { getPointsBalance, POINTS_REWARDS } from "@/lib/points";
import { listPurchases } from "@/lib/store";
import { getVerifiedEmail } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const supabase = createServerClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const balance = await getPointsBalance(email);

  const { data: transactions } = await supabase
    .from("points_transactions")
    .select("delta, reason, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(10);

  const purchases = await listPurchases(email);

  return NextResponse.json({
    subscription: subscription ?? null,
    points: { balance, rewards: POINTS_REWARDS, transactions: transactions ?? [] },
    purchases,
  });
}
