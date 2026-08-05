import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/client";
import { getPointsBalance, POINTS_REWARDS } from "@/lib/points";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const normalized = email.toLowerCase().trim();
  const supabase = createServerClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("email", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const balance = await getPointsBalance(normalized);

  const { data: transactions } = await supabase
    .from("points_transactions")
    .select("delta, reason, created_at")
    .eq("email", normalized)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    subscription: subscription ?? null,
    points: { balance, rewards: POINTS_REWARDS, transactions: transactions ?? [] },
  });
}
