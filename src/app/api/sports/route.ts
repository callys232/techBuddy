import { NextResponse } from "next/server";
import { fetchUpcomingFixtures } from "@/lib/sportsEngine/espnData";
import { getLeagueConfig } from "@/lib/sportsEngine/leagues";
import type { Fixture } from "@/types/sports";

export const revalidate = 900;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("league") ?? "4328";
  const config = getLeagueConfig(leagueId);

  if (!config) {
    return NextResponse.json({ fixtures: [], error: "Unknown league." }, { status: 200 });
  }

  try {
    const espnFixtures = await fetchUpcomingFixtures(config.espnSport, config.espnLeague);
    const fixtures: Fixture[] = espnFixtures.slice(0, 15).map((f) => ({
      id: f.id,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      homeBadge: f.homeBadge,
      awayBadge: f.awayBadge,
      date: f.date,
      league: config.name,
      venue: f.venue,
    }));

    return NextResponse.json({ fixtures });
  } catch {
    return NextResponse.json(
      { fixtures: [], error: "Unable to load fixtures right now — try another league." },
      { status: 200 }
    );
  }
}
