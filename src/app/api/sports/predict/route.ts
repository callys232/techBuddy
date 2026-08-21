import { NextResponse } from "next/server";
import { predictMatch } from "@/lib/sportsEngine/predict";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const leagueId = body?.leagueId as string | undefined;
  const homeTeam = body?.homeTeam as string | undefined;
  const awayTeam = body?.awayTeam as string | undefined;

  if (!leagueId || !homeTeam || !awayTeam) {
    return NextResponse.json({ error: "leagueId, homeTeam and awayTeam are required" }, { status: 400 });
  }

  const allowed = await checkRateLimit("sports-predict", getClientIp(req), 15);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  try {
    const prediction = await predictMatch(leagueId, homeTeam, awayTeam);
    return NextResponse.json({ prediction });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not build a prediction right now";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
