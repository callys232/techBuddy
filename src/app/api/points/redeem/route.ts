import { NextResponse, type NextRequest } from "next/server";
import { spendPoints, fulfillReward, POINTS_REWARDS, type RewardId } from "@/lib/points";
import { getVerifiedEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rewardId = body?.rewardId as RewardId | undefined;

  if (!rewardId) {
    return NextResponse.json({ error: "rewardId is required" }, { status: 400 });
  }

  const reward = POINTS_REWARDS.find((r) => r.id === rewardId);
  if (!reward) {
    return NextResponse.json({ error: "Unknown reward" }, { status: 400 });
  }

  try {
    const balance = await spendPoints(email, reward.cost, `redeem:${reward.id}`);
    await fulfillReward(email, reward.id);
    return NextResponse.json({ balance, reward });
  } catch {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 });
  }
}
