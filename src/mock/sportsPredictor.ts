export interface SportLeague {
  id: string;
  sport: "Football" | "Basketball";
  name: string;
}

/** UI-facing league list — ids match src/lib/sportsEngine/leagues.ts, which
 *  carries the ESPN slugs and model choice actually used to build predictions. */
export const SPORT_LEAGUES: SportLeague[] = [
  { id: "4328", sport: "Football", name: "English Premier League" },
  { id: "4335", sport: "Football", name: "Spanish La Liga" },
  { id: "4332", sport: "Football", name: "Italian Serie A" },
  { id: "4331", sport: "Football", name: "German Bundesliga" },
  { id: "4334", sport: "Football", name: "French Ligue 1" },
  { id: "4480", sport: "Football", name: "UEFA Champions League" },
  { id: "4387", sport: "Basketball", name: "NBA" },
];
