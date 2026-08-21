import { fetchSeasonResults } from "./espnData";
import { computeEloRatings, spreadModel, DEFAULT_ELO_CONFIG, type ResultInput } from "./elo";
import { buildPoissonModel, predictFromPoisson } from "./poisson";
import { getLeagueConfig } from "./leagues";

export type FormResult = "W" | "D" | "L";

export interface SportPrediction {
  homeTeam: string;
  awayTeam: string;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  predictedScore: string;
  confidence: "Low" | "Medium" | "High";
  homeForm: FormResult[];
  awayForm: FormResult[];
  headToHead: { homeWins: number; draws: number; awayWins: number; sample: number };
  keyFactors: string[];
  sport: "Football" | "Basketball";
  sampleSize: number;
}

function teamForm(results: ResultInput[], team: string, n = 5): FormResult[] {
  const games = results
    .filter((r) => r.homeTeam === team || r.awayTeam === team)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
  return games
    .map((g) => {
      const isHome = g.homeTeam === team;
      const gf = isHome ? g.homeScore : g.awayScore;
      const ga = isHome ? g.awayScore : g.homeScore;
      return gf > ga ? "W" : gf < ga ? "L" : "D";
    })
    .reverse(); // oldest → newest, reads left-to-right chronologically
}

function headToHead(results: ResultInput[], home: string, away: string) {
  const games = results.filter(
    (r) => (r.homeTeam === home && r.awayTeam === away) || (r.homeTeam === away && r.awayTeam === home)
  );
  let homeWins = 0, awayWins = 0, draws = 0;
  for (const g of games) {
    const homeScore = g.homeTeam === home ? g.homeScore : g.awayScore;
    const awayScore = g.homeTeam === home ? g.awayScore : g.homeScore;
    if (homeScore > awayScore) homeWins++;
    else if (homeScore < awayScore) awayWins++;
    else draws++;
  }
  return { homeWins, draws, awayWins, sample: games.length };
}

/**
 * Real prediction — pulls the season's completed results from ESPN, builds an
 * Elo (+ Poisson for goal-based sports) model from them, and reads win
 * probability, scoreline, form, and head-to-head off that model. No seeded
 * randomness anywhere in this path.
 */
export async function predictMatch(leagueId: string, homeTeam: string, awayTeam: string): Promise<SportPrediction> {
  const config = getLeagueConfig(leagueId);
  if (!config) throw new Error(`Unknown league: ${leagueId}`);

  const results = await fetchSeasonResults(config.espnSport, config.espnLeague, config.season);

  const homeForm = teamForm(results, homeTeam);
  const awayForm = teamForm(results, awayTeam);
  const h2h = headToHead(results, homeTeam, awayTeam);

  let homeWinPct: number, drawPct: number, awayWinPct: number, predictedScore: string;

  if (config.model === "poisson") {
    const model = buildPoissonModel(results);
    const p = predictFromPoisson(model, homeTeam, awayTeam);
    homeWinPct = Math.round(p.homeWinProb * 100);
    drawPct = Math.round(p.drawProb * 100);
    awayWinPct = 100 - homeWinPct - drawPct;
    predictedScore = `${p.predictedHomeGoals}-${p.predictedAwayGoals}`;
  } else {
    const ratings = computeEloRatings(results, { ...DEFAULT_ELO_CONFIG, useMarginOfVictory: true });
    const homeElo = ratings.get(homeTeam) ?? DEFAULT_ELO_CONFIG.baseRating;
    const awayElo = ratings.get(awayTeam) ?? DEFAULT_ELO_CONFIG.baseRating;
    const { homeWinProb } = spreadModel(homeElo, awayElo, DEFAULT_ELO_CONFIG.homeAdvantage, 28, 12);
    homeWinPct = Math.round(homeWinProb * 100);
    drawPct = 0; // no draws in basketball
    awayWinPct = 100 - homeWinPct;

    const avgScore = results.length ? results.reduce((s, r) => s + r.homeScore + r.awayScore, 0) / (results.length * 2) : 105;
    const gap = (homeElo + DEFAULT_ELO_CONFIG.homeAdvantage - awayElo) / 20;
    predictedScore = `${Math.round(avgScore + gap / 2)}-${Math.round(avgScore - gap / 2)}`;
  }

  const smallSample = results.length < 50;
  const spread = Math.abs(homeWinPct - awayWinPct);
  const confidence: SportPrediction["confidence"] =
    smallSample ? "Low" : spread > 28 ? "High" : spread > 14 ? "Medium" : "Low";

  const keyFactors: string[] = [
    `Built from ${results.length} completed matches this season — Elo ratings + ${config.model === "poisson" ? "a Poisson goal model" : "a point-spread model"}, the same approach FiveThirtyEight-style forecasters use. Not seeded or random.`,
    ...(smallSample ? [`Early in the season — only ${results.length} matches played so far, so treat this as a lower-confidence read.`] : []),
    `${homeTeam} recent form: ${homeForm.join("") || "no completed matches yet"} (last ${homeForm.length})`,
    `${awayTeam} recent form: ${awayForm.join("") || "no completed matches yet"} (last ${awayForm.length})`,
    h2h.sample > 0
      ? `Head-to-head this season: ${homeTeam} ${h2h.homeWins} — ${h2h.draws} — ${h2h.awayWins} ${awayTeam}`
      : "No head-to-head meetings yet this season",
  ];

  return {
    homeTeam,
    awayTeam,
    homeWinPct,
    drawPct,
    awayWinPct,
    predictedScore,
    confidence,
    homeForm,
    awayForm,
    headToHead: h2h,
    keyFactors,
    sport: config.sport,
    sampleSize: results.length,
  };
}
