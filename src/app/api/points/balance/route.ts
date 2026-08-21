import { NextResponse, type NextRequest } from "next/server";
import { getPointsBalance, POINTS_REWARDS } from "@/lib/points";
import { getVerifiedEmail } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const balance = await getPointsBalance(email);
  return NextResponse.json({ balance, rewards: POINTS_REWARDS });
}
