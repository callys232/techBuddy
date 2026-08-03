import type { ResultInput } from "./elo";

/**
 * ESPN's public site-api endpoints — free, no key, no enforced rate limit.
 * Undocumented/unofficial (not an ESPN-supported product) but widely relied
 * on for exactly this kind of read-only public score data. Chosen because
 * TheSportsDB's free tier caps out at ~5 historical results per league,
 * nowhere near enough to compute a real rating.
 */

const BASE = "https://site.api.espn.com/apis/site/v2/sports";

interface EspnTeamsResponse {
  sports?: { leagues?: { teams?: { team: { id: string; displayName: string } }[] }[] }[];
}

interface EspnCompetitor {
  homeAway: "home" | "away";
  team: { displayName: string };
  score?: { value?: number };
}

interface EspnEvent {
  id: string;
  date: string;
  competitions: {
    status: { type: { completed: boolean } };
    competitors: EspnCompetitor[];
  }[];
}

interface EspnScheduleResponse {
  events?: EspnEvent[];
}

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`ESPN ${res.status} — ${url}`);
  return res.json();
}

export async function fetchTeamIds(sportSlug: string, leagueSlug: string): Promise<{ id: string; name: string }[]> {
  const data = await fetchJson<EspnTeamsResponse>(`${BASE}/${sportSlug}/${leagueSlug}/teams?limit=100`, 86400);
  const teams = data.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return teams.map((t) => ({ id: t.team.id, name: t.team.displayName }));
}

function normalizeEvents(events: EspnEvent[]): ResultInput[] {
  const results: ResultInput[] = [];
  for (const e of events) {
    const comp = e.competitions?.[0];
    if (!comp?.status?.type?.completed) continue;
    const home = comp.competitors.find((c) => c.homeAway === "home");
    const away = comp.competitors.find((c) => c.homeAway === "away");
    const homeScore = home?.score?.value;
    const awayScore = away?.score?.value;
    if (!home || !away || homeScore == null || awayScore == null) continue;
    results.push({
      homeTeam: home.team.displayName,
      awayTeam: away.team.displayName,
      homeScore,
      awayScore,
      date: e.date,
    });
  }
  return results;
}

/**
 * Full season of completed results for a league, built by fetching every
 * team's schedule and deduping shared fixtures by event id. Cached for a day
 * — this is the expensive call, ratings only need to move once daily.
 */
export async function fetchSeasonResults(sportSlug: string, leagueSlug: string, season: number): Promise<ResultInput[]> {
  const teams = await fetchTeamIds(sportSlug, leagueSlug);

  const schedules = await Promise.allSettled(
    teams.map((t) =>
      fetchJson<EspnScheduleResponse>(
        `${BASE}/${sportSlug}/${leagueSlug}/teams/${t.id}/schedule?season=${season}`,
        86400
      )
    )
  );

  const seen = new Set<string>();
  const results: ResultInput[] = [];

  for (const s of schedules) {
    if (s.status !== "fulfilled") continue;
    for (const r of normalizeEvents(s.value.events ?? [])) {
      const key = `${r.date}|${r.homeTeam}|${r.awayTeam}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(r);
    }
  }

  return results;
}

export interface EspnFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeBadge?: string;
  awayBadge?: string;
  date: string;
  time?: string;
  venue?: string;
}

interface EspnScoreboardEvent {
  id: string;
  date: string;
  competitions: {
    venue?: { fullName?: string };
    competitors: (EspnCompetitor & { team: { displayName: string; logo?: string } })[];
    status: { type: { completed: boolean } };
  }[];
}

interface EspnScoreboardResponse {
  events?: EspnScoreboardEvent[];
}

function dateRangeParam(days: number): string {
  const fmt = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);
  return `${fmt(start)}-${fmt(end)}`;
}

/** Upcoming fixtures for a league — ESPN's scoreboard defaults to "today" only, so we widen the window. */
export async function fetchUpcomingFixtures(sportSlug: string, leagueSlug: string): Promise<EspnFixture[]> {
  const data = await fetchJson<EspnScoreboardResponse>(
    `${BASE}/${sportSlug}/${leagueSlug}/scoreboard?dates=${dateRangeParam(21)}`,
    900
  );

  return (data.events ?? [])
    .filter((e) => !e.competitions?.[0]?.status?.type?.completed)
    .map((e) => {
      const comp = e.competitions[0];
      const home = comp.competitors.find((c) => c.homeAway === "home");
      const away = comp.competitors.find((c) => c.homeAway === "away");
      return {
        id: e.id,
        homeTeam: home?.team.displayName ?? "TBD",
        awayTeam: away?.team.displayName ?? "TBD",
        homeBadge: home?.team.logo,
        awayBadge: away?.team.logo,
        date: e.date,
        venue: comp.venue?.fullName,
      };
    })
    .filter((f) => f.homeTeam !== "TBD" && f.awayTeam !== "TBD");
}
