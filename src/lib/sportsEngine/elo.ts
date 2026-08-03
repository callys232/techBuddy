/**
 * Generic Elo rating engine. Same core math FiveThirtyEight uses for their
 * NFL/NBA/soccer Elo models — replay a season's results chronologically,
 * each match nudges both teams' ratings toward what the result implies.
 */

export interface ResultInput {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string; // ISO — matches are replayed in date order
}

export interface EloConfig {
  /** Rating points a team's home-field advantage is worth */
  homeAdvantage: number;
  /** Base learning rate — how much one result moves a rating */
  kFactor: number;
  /** Everyone starts here before any results are replayed */
  baseRating: number;
  /** Use a margin-of-victory multiplier (NFL/NBA style) instead of flat K */
  useMarginOfVictory: boolean;
}

export const DEFAULT_ELO_CONFIG: EloConfig = {
  homeAdvantage: 65,
  kFactor: 20,
  baseRating: 1500,
  useMarginOfVictory: false,
};

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/** FiveThirtyEight-style MOV multiplier — blowouts move ratings more, but with
 *  diminishing returns, and less so when the favorite was already expected to win big. */
function movMultiplier(pointDiff: number, eloDiff: number): number {
  return Math.log(Math.abs(pointDiff) + 1) * (2.2 / (Math.abs(eloDiff) * 0.001 + 2.2));
}

export function computeEloRatings(
  results: ResultInput[],
  config: EloConfig = DEFAULT_ELO_CONFIG
): Map<string, number> {
  const ratings = new Map<string, number>();
  const rating = (team: string) => ratings.get(team) ?? config.baseRating;

  const sorted = [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const r of sorted) {
    const homeElo = rating(r.homeTeam);
    const awayElo = rating(r.awayTeam);

    const expectedHome = expectedScore(homeElo + config.homeAdvantage, awayElo);
    const actualHome = r.homeScore > r.awayScore ? 1 : r.homeScore < r.awayScore ? 0 : 0.5;

    let k = config.kFactor;
    if (config.useMarginOfVictory) {
      const eloDiff = homeElo + config.homeAdvantage - awayElo;
      k *= movMultiplier(r.homeScore - r.awayScore, eloDiff);
    }

    const delta = k * (actualHome - expectedHome);
    ratings.set(r.homeTeam, homeElo + delta);
    ratings.set(r.awayTeam, awayElo - delta);
  }

  return ratings;
}

/** Win probability from an Elo gap alone (draw handled separately per-sport) */
export function eloWinProbability(ratingA: number, ratingB: number, homeAdvantage = 0): number {
  return expectedScore(ratingA + homeAdvantage, ratingB);
}

/** Standard normal CDF — used to turn a predicted point spread into a win probability */
function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function erf(x: number): number {
  // Abramowitz–Stegun approximation — accurate to ~1e-7, plenty for this use
  const sign = x < 0 ? -1 : 1;
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * Math.abs(x));
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export interface SpreadModelResult {
  homeWinProb: number;
  predictedSpread: number; // positive = home favored, in points
}

/**
 * Point-spread win model for high-scoring sports (NFL/NBA) where goal-based
 * Poisson doesn't fit — same approach FiveThirtyEight uses: Elo gap → point
 * spread → win probability via the sport's typical score-margin distribution.
 */
export function spreadModel(
  homeElo: number,
  awayElo: number,
  homeAdvantageElo: number,
  spreadDivisor: number,
  gameStdDev: number
): SpreadModelResult {
  const eloDiff = homeElo + homeAdvantageElo - awayElo;
  const predictedSpread = eloDiff / spreadDivisor;
  const homeWinProb = normalCdf(predictedSpread / gameStdDev);
  return { homeWinProb, predictedSpread };
}
