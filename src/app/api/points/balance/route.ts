import { NextResponse, type NextRequest } from "next/server";
import { getPointsBalance, POINTS_REWARDS } from "@/lib/points";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const balance = await getPointsBalance(email);
  return NextResponse.json({ balance, rewards: POINTS_REWARDS });
}
