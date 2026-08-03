import { NextResponse } from "next/server";
import type { Fixture } from "@/types/sports";

export const revalidate = 900;

/* TheSportsDB public test key — free tier, no signup required */
const SPORTSDB_KEY = "3";

interface RawEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  dateEvent: string;
  strTime?: string;
  strVenue?: string;
}

function normalize(events: RawEvent[], league: string): Fixture[] {
  return events
    .filter((e) => e.strHomeTeam && e.strAwayTeam && e.dateEvent)
    .map((e) => ({
      id: e.idEvent,
      homeTeam: e.strHomeTeam,
      awayTeam: e.strAwayTeam,
      homeBadge: e.strHomeTeamBadge || undefined,
      awayBadge: e.strAwayTeamBadge || undefined,
      date: e.dateEvent,
      time: e.strTime,
      league,
      venue: e.strVenue || undefined,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("league") ?? "4328";
  const leagueName = searchParams.get("name") ?? "";

  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_KEY}/eventsnextleague.php?id=${leagueId}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = (await res.json()) as { events: RawEvent[] | null };
    const fixtures = normalize(data.events ?? [], leagueName).slice(0, 15);

    return NextResponse.json({ fixtures });
  } catch {
    return NextResponse.json(
      { fixtures: [], error: "Unable to load fixtures right now — try another league." },
      { status: 200 }
    );
  }
}
