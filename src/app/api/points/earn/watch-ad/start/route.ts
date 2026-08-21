import { NextResponse, type NextRequest } from "next/server";
import { issueWatchToken, MIN_WATCH_SECONDS, MAX_WATCHES_PER_DAY } from "@/lib/adToken";
import { countTodayTransactions, POINTS_RULES } from "@/lib/points";
import { getVerifiedEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const watchedToday = await countTodayTransactions(email, "watch_ad");
  if (watchedToday >= MAX_WATCHES_PER_DAY) {
    return NextResponse.json({ error: "Daily ad-watch limit reached — come back tomorrow" }, { status: 429 });
  }

  const token = issueWatchToken(email);
  return NextResponse.json({ token, minWatchSeconds: MIN_WATCH_SECONDS, reward: POINTS_RULES.watchAd });
}
