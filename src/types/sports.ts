export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeBadge?: string;
  awayBadge?: string;
  date: string;
  time?: string;
  league: string;
  venue?: string;
}

export interface SportsApiResponse {
  fixtures: Fixture[];
  error?: string;
}
