import { NextResponse, type NextRequest } from "next/server";
import { verifyWatchToken, MAX_WATCHES_PER_DAY } from "@/lib/adToken";
import { awardPoints, countTodayTransactions, POINTS_RULES } from "@/lib/points";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token as string | undefined;
  if (!token) return NextResponse.json({ error: "token is required" }, { status: 400 });

  const verified = verifyWatchToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Invalid or expired watch session" }, { status: 400 });
  }

  const watchedToday = await countTodayTransactions(verified.email, "watch_ad");
  if (watchedToday >= MAX_WATCHES_PER_DAY) {
    return NextResponse.json({ error: "Daily ad-watch limit reached — come back tomorrow" }, { status: 429 });
  }

  const balance = await awardPoints(verified.email, POINTS_RULES.watchAd, "watch_ad");
  return NextResponse.json({ balance, earned: POINTS_RULES.watchAd });
}
