export interface SportLeague {
  id: string;
  sport: "Football" | "Basketball";
  name: string;
}

export const SPORT_LEAGUES: SportLeague[] = [
  { id: "4328", sport: "Football",   name: "English Premier League" },
  { id: "4335", sport: "Football",   name: "Spanish La Liga" },
  { id: "4332", sport: "Football",   name: "Italian Serie A" },
  { id: "4331", sport: "Football",   name: "German Bundesliga" },
  { id: "4334", sport: "Football",   name: "French Ligue 1" },
  { id: "4480", sport: "Football",   name: "UEFA Champions League" },
  { id: "4387", sport: "Basketball", name: "NBA" },
];

/* ── Deterministic seeded PRNG — same fixture always yields the same read ─── */

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
}

function genForm(rand: () => number, bias: number): FormResult[] {
  const out: FormResult[] = [];
  for (let i = 0; i < 5; i++) {
    const r = rand();
    if (r < 0.38 + bias) out.push("W");
    else if (r < 0.63 + bias * 0.5) out.push("D");
    else out.push("L");
  }
  return out;
}

function formScore(form: FormResult[]): number {
  return form.reduce((acc, r) => acc + (r === "W" ? 3 : r === "D" ? 1 : 0), 0);
}

/**
 * Deterministic "analytical read" — same fixture always produces the same
 * output. Not real odds or live stats; a rule-based form/H2H model used as
 * a lead-magnet, same spirit as the other free tools in this codebase.
 */
export function generatePrediction(
  homeTeam: string,
  awayTeam: string,
  date: string,
  sport: "Football" | "Basketball" = "Football"
): SportPrediction {
  const rand = mulberry32(hashSeed(`${homeTeam}|${awayTeam}|${date}`));

  const homeForm = genForm(rand, 0.06);
  const awayForm = genForm(rand, -0.03);

  const homeStrength = formScore(homeForm) + 3; // home advantage bump
  const awayStrength = formScore(awayForm);
  const total = homeStrength + awayStrength + 6; // baseline draw weight

  let homeWinPct = Math.round((homeStrength / total) * 100);
  let awayWinPct = Math.round((awayStrength / total) * 100);
  let drawPct = 100 - homeWinPct - awayWinPct;

  if (drawPct < 3) {
    const diff = 3 - drawPct;
    if (homeWinPct >= awayWinPct) homeWinPct -= diff;
    else awayWinPct -= diff;
    drawPct = 3;
  }

  const sample = 5 + Math.floor(rand() * 4); // 5–8 meetings on record
  let homeWins = 0;
  let awayWins = 0;
  for (let i = 0; i < sample; i++) {
    const r = rand();
    if (r < 0.42) homeWins++;
    else if (r < 0.72) awayWins++;
  }
  const draws = sample - homeWins - awayWins;

  let predictedScore: string;
  if (sport === "Basketball") {
    const homeScore = Math.round(95 + rand() * 17 + (homeWinPct - awayWinPct) / 8);
    const awayScore = Math.round(95 + rand() * 17 - (homeWinPct - awayWinPct) / 10);
    predictedScore = `${homeScore}-${awayScore}`;
  } else {
    const homeGoals = Math.min(4, Math.round(rand() * 2 + (homeWinPct > awayWinPct ? 1 : 0)));
    const awayGoals = Math.min(4, Math.round(rand() * 2 + (awayWinPct > homeWinPct ? 1 : 0)));
    predictedScore = `${homeGoals}-${awayGoals}`;
  }

  const spread = Math.abs(homeWinPct - awayWinPct);
  const confidence: SportPrediction["confidence"] = spread > 28 ? "High" : spread > 14 ? "Medium" : "Low";

  const keyFactors: string[] = [
    sport === "Basketball"
      ? "Home court advantage factored into pace and shot volume"
      : "Home ground advantage factored into win probability",
    `${homeTeam} recent form: ${homeForm.join("")} (${formScore(homeForm)} pts from last 5)`,
    `${awayTeam} recent form: ${awayForm.join("")} (${formScore(awayForm)} pts from last 5)`,
    `Head-to-head (last ${sample}): ${homeTeam} ${homeWins} — ${draws} — ${awayWins} ${awayTeam}`,
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
    headToHead: { homeWins, draws, awayWins, sample },
    keyFactors,
    sport,
  };
}
