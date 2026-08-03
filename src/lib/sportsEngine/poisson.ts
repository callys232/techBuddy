/**
 * Poisson attack/defense model — the standard approach (Dixon-Coles family)
 * for goal-based sports where scoring is a low-count discrete event: soccer,
 * hockey, and (approximately) baseball. Not appropriate for point-spread
 * sports like NFL/NBA — see spreadModel() in elo.ts for those.
 */

import type { ResultInput } from "./elo";

export interface TeamStrength {
  attack: number;  // >1 scores more than league average
  defense: number; // >1 concedes more than league average
}

export interface PoissonModel {
  leagueAvgGoals: number;
  strengths: Map<string, TeamStrength>;
  homeAdvantage: number; // multiplier on expected home goals, e.g. 1.35
}

export function buildPoissonModel(results: ResultInput[], homeAdvantage = 1.35): PoissonModel {
  const totalGoals = results.reduce((sum, r) => sum + r.homeScore + r.awayScore, 0);
  const leagueAvgGoals = results.length ? totalGoals / (results.length * 2) : 1.3;

  const scored = new Map<string, number>();
  const conceded = new Map<string, number>();
  const games = new Map<string, number>();

  const bump = (map: Map<string, number>, key: string, n: number) => map.set(key, (map.get(key) ?? 0) + n);

  for (const r of results) {
    bump(scored, r.homeTeam, r.homeScore);
    bump(scored, r.awayTeam, r.awayScore);
    bump(conceded, r.homeTeam, r.awayScore);
    bump(conceded, r.awayTeam, r.homeScore);
    bump(games, r.homeTeam, 1);
    bump(games, r.awayTeam, 1);
  }

  const strengths = new Map<string, TeamStrength>();
  for (const team of games.keys()) {
    const n = games.get(team) ?? 1;
    const avgScored = (scored.get(team) ?? 0) / n;
    const avgConceded = (conceded.get(team) ?? 0) / n;
    strengths.set(team, {
      attack: leagueAvgGoals > 0 ? avgScored / leagueAvgGoals : 1,
      defense: leagueAvgGoals > 0 ? avgConceded / leagueAvgGoals : 1,
    });
  }

  return { leagueAvgGoals, strengths, homeAdvantage };
}

function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let logP = -lambda + k * Math.log(lambda);
  for (let i = 2; i <= k; i++) logP -= Math.log(i);
  return Math.exp(logP);
}

export interface PoissonPrediction {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  predictedHomeGoals: number;
  predictedAwayGoals: number;
}

const MAX_GOALS = 8;

export function predictFromPoisson(
  model: PoissonModel,
  homeTeam: string,
  awayTeam: string
): PoissonPrediction {
  const home = model.strengths.get(homeTeam) ?? { attack: 1, defense: 1 };
  const away = model.strengths.get(awayTeam) ?? { attack: 1, defense: 1 };

  const expHomeGoals = home.attack * away.defense * model.leagueAvgGoals * model.homeAdvantage;
  const expAwayGoals = away.attack * home.defense * model.leagueAvgGoals;

  let homeWinProb = 0, drawProb = 0, awayWinProb = 0;
  let bestProb = -1, predictedHomeGoals = 0, predictedAwayGoals = 0;

  for (let h = 0; h <= MAX_GOALS; h++) {
    const ph = poissonPmf(h, expHomeGoals);
    for (let a = 0; a <= MAX_GOALS; a++) {
      const pa = poissonPmf(a, expAwayGoals);
      const p = ph * pa;
      if (h > a) homeWinProb += p;
      else if (h < a) awayWinProb += p;
      else drawProb += p;
      if (p > bestProb) { bestProb = p; predictedHomeGoals = h; predictedAwayGoals = a; }
    }
  }

  const total = homeWinProb + drawProb + awayWinProb || 1;
  return {
    homeWinProb: homeWinProb / total,
    drawProb: drawProb / total,
    awayWinProb: awayWinProb / total,
    predictedHomeGoals,
    predictedAwayGoals,
  };
}
