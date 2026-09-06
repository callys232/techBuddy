import { NextResponse, type NextRequest } from "next/server";
import { redeemPremiumMonth, POINTS_REWARDS, type RewardId } from "@/lib/points";
import { getVerifiedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rewardId = body?.rewardId as RewardId | undefined;
  const idempotencyKey = req.headers.get("idempotency-key") ?? body?.idempotencyKey;

  if (!rewardId || !idempotencyKey) {
    return NextResponse.json({ error: "rewardId and idempotency key are required" }, { status: 400 });
  }

  const reward = POINTS_REWARDS.find((r) => r.id === rewardId);
  if (!reward) {
    return NextResponse.json({ error: "Unknown reward" }, { status: 400 });
  }

  try {
    const result = await redeemPremiumMonth(user.email, user.id, reward.cost, idempotencyKey);
    return NextResponse.json({ ...result, reward });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Redemption failed";
    return NextResponse.json({ error: message.includes("Not enough") ? "Not enough points" : message }, { status: 400 });
  }
}
