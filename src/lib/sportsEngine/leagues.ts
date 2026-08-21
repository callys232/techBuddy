/**
 * Maps each league we offer in the UI to its ESPN site-api slugs and which
 * statistical model fits its scoring pattern: Poisson for low-count/goal-based
 * sports (soccer), the Elo point-spread model for high-scoring sports (NBA).
 */

export interface LeagueConfig {
  /** Stable id used in the UI and as the query param — matches SPORT_LEAGUES in mock/sportsPredictor.ts */
  id: string;
  sport: "Football" | "Basketball";
  name: string;
  espnSport: string;
  espnLeague: string;
  /** ESPN's season year param — the year the season *started* for leagues that span a new-year boundary */
  season: number;
  model: "poisson" | "spread";
}

const CURRENT_SEASON = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1;

export const LEAGUES: LeagueConfig[] = [
  { id: "4328", sport: "Football", name: "English Premier League", espnSport: "soccer", espnLeague: "eng.1", season: CURRENT_SEASON, model: "poisson" },
  { id: "4335", sport: "Football", name: "Spanish La Liga", espnSport: "soccer", espnLeague: "esp.1", season: CURRENT_SEASON, model: "poisson" },
  { id: "4332", sport: "Football", name: "Italian Serie A", espnSport: "soccer", espnLeague: "ita.1", season: CURRENT_SEASON, model: "poisson" },
  { id: "4331", sport: "Football", name: "German Bundesliga", espnSport: "soccer", espnLeague: "ger.1", season: CURRENT_SEASON, model: "poisson" },
  { id: "4334", sport: "Football", name: "French Ligue 1", espnSport: "soccer", espnLeague: "fra.1", season: CURRENT_SEASON, model: "poisson" },
  { id: "4480", sport: "Football", name: "UEFA Champions League", espnSport: "soccer", espnLeague: "uefa.champions", season: CURRENT_SEASON, model: "poisson" },
  { id: "4387", sport: "Basketball", name: "NBA", espnSport: "basketball", espnLeague: "nba", season: CURRENT_SEASON, model: "spread" },
];

export function getLeagueConfig(id: string): LeagueConfig | undefined {
  return LEAGUES.find((l) => l.id === id);
}
