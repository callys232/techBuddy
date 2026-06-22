/* Product-Market Fit Scorer — questions and scoring ────────────────────── */

export interface PMFQuestion {
  id:       string;
  section:  string;
  question: string;
  subtitle: string;
  options:  { id: string; label: string; hint?: string; score: number }[];
}

export const PMF_QUESTIONS: PMFQuestion[] = [
  /* ── Section 1: Retention ─────────────────────────────────────────────── */
  {
    id:       "retention",
    section:  "Retention",
    question: "What percentage of users who signed up are still active after 30 days?",
    subtitle: "This is the single strongest signal of product-market fit. 'Active' means they used your core feature at least once.",
    options:  [
      { id: "under10",  label: "Less than 10%",   hint: "Significant churn early",          score: 0  },
      { id: "10to25",   label: "10% – 25%",        hint: "Below average retention",          score: 20 },
      { id: "25to50",   label: "25% – 50%",        hint: "Decent, room to improve",          score: 45 },
      { id: "50to70",   label: "50% – 70%",        hint: "Strong retention",                 score: 70 },
      { id: "over70",   label: "70%+",             hint: "Exceptional — this is rare",       score: 95 },
    ],
  },
  {
    id:       "churn",
    section:  "Retention",
    question: "What is your monthly churn rate?",
    subtitle: "Churn rate = % of active users who stopped using the product each month.",
    options:  [
      { id: "over20",  label: "More than 20%",   hint: "Critical — product isn't sticky",  score: 0  },
      { id: "10to20",  label: "10% – 20%",        hint: "High — needs urgent attention",    score: 15 },
      { id: "5to10",   label: "5% – 10%",         hint: "Acceptable but improvable",        score: 40 },
      { id: "2to5",    label: "2% – 5%",          hint: "Good — work on the top cohort",    score: 70 },
      { id: "under2",  label: "Less than 2%",     hint: "Excellent retention",              score: 100},
    ],
  },

  /* ── Section 2: Organic Growth ───────────────────────────────────────── */
  {
    id:       "growth-source",
    section:  "Organic Growth",
    question: "How do most new users find out about your product?",
    subtitle: "Word of mouth is the strongest signal that users genuinely love the product enough to tell others.",
    options:  [
      { id: "paid",    label: "Paid advertising",     hint: "Facebook, Google, influencer",    score: 10 },
      { id: "sales",   label: "Direct sales / outbound", hint: "You reach out to every customer", score: 20 },
      { id: "mixed",   label: "Mix of paid and organic", hint: "Diversified acquisition",       score: 40 },
      { id: "seo",     label: "Organic search / content", hint: "People find you via Google",   score: 60 },
      { id: "wom",     label: "Word of mouth / referrals", hint: "Users tell their friends",    score: 95 },
    ],
  },
  {
    id:       "nps",
    section:  "Organic Growth",
    question: "If you asked users \"How likely are you to recommend us?\", what would most say?",
    subtitle: "This is your Net Promoter Score (NPS). Honest self-assessment is more useful than optimism here.",
    options:  [
      { id: "detractor", label: "They'd warn people away",    hint: "0–6 NPS range",  score: 0  },
      { id: "passive",   label: "They'd shrug — take it or leave it", hint: "7–8 NPS range", score: 35 },
      { id: "moderate",  label: "They'd probably mention it", hint: "Mixed NPS",      score: 55 },
      { id: "promoter",  label: "They actively recommend us", hint: "9–10 NPS range", score: 90 },
    ],
  },

  /* ── Section 3: Engagement ───────────────────────────────────────────── */
  {
    id:       "frequency",
    section:  "Engagement",
    question: "How often do your most engaged users use your product?",
    subtitle: "Frequency reveals habit formation. Daily use products have a much stronger moat.",
    options:  [
      { id: "rarely",  label: "Rarely — once a month or less", hint: "Low engagement product",   score: 10 },
      { id: "weekly",  label: "Weekly",                        hint: "Reasonable engagement",    score: 45 },
      { id: "several", label: "Several times per week",        hint: "Strong habit formation",   score: 70 },
      { id: "daily",   label: "Daily",                         hint: "Exceptional — true habit", score: 100},
    ],
  },
  {
    id:       "core-action",
    section:  "Engagement",
    question: "When users are active, are they completing your core value action?",
    subtitle: "Visiting ≠ using. Do they actually use the thing that makes your product valuable?",
    options:  [
      { id: "no",      label: "Rarely — they poke around but don't do the core thing", score: 0  },
      { id: "some",    label: "Some users do, most don't",                              score: 30 },
      { id: "most",    label: "Most active users complete the core action",             score: 65 },
      { id: "always",  label: "Almost every session includes the core action",         score: 100},
    ],
  },

  /* ── Section 4: Disappointment Test ─────────────────────────────────── */
  {
    id:       "disappointment",
    section:  "Disappointment Test",
    question: "If your product disappeared tomorrow, how would most of your users react?",
    subtitle: "This is Sean Ellis' original PMF question. The 40% threshold of 'Very disappointed' is the benchmark for PMF.",
    options:  [
      { id: "nbd",       label: "They'd shrug — easily replaced",     hint: "< 10% very disappointed", score: 0   },
      { id: "mild",      label: "Mildly inconvenienced",               hint: "~10–25% very disappointed", score: 25 },
      { id: "unhappy",   label: "Annoyed but would find an alternative", hint: "25–40% very disappointed", score: 50 },
      { id: "very",      label: "Very disappointed — hard to replace",  hint: "> 40% very disappointed", score: 90 },
    ],
  },
  {
    id:       "alternatives",
    section:  "Disappointment Test",
    question: "What do users say when asked what they'd use instead if you shut down?",
    subtitle: "\"Nothing\" or struggling to name an alternative is a strong PMF signal.",
    options:  [
      { id: "easy",      label: "They immediately name a specific competitor",   score: 0  },
      { id: "downgrade", label: "They'd go back to a manual / inferior process", score: 40 },
      { id: "nothing",   label: "They say 'nothing' or struggle to name one",    score: 90 },
    ],
  },

  /* ── Section 5: Revenue & Expansion ────────────────────────────────── */
  {
    id:       "revenue",
    section:  "Revenue & Expansion",
    question: "Are users paying for your product?",
    subtitle: "Willingness to pay is one of the clearest signals that users see genuine value.",
    options:  [
      { id: "free",   label: "No — it's free and no one has asked to pay",      score: 0  },
      { id: "ask",    label: "No — but users have asked us to charge them",      score: 50 },
      { id: "some",   label: "Yes — some are paying, some on free tier",        score: 65 },
      { id: "mostly", label: "Yes — most active users are paying",              score: 85 },
      { id: "all",    label: "Yes — essentially all active users pay",          score: 100},
    ],
  },
  {
    id:       "expansion",
    section:  "Revenue & Expansion",
    question: "Do users expand their usage over time?",
    subtitle: "Expansion — upgrading, adding seats, referring others — is a leading indicator of strong PMF.",
    options:  [
      { id: "shrink",  label: "No — usage tends to shrink over time",    score: 0  },
      { id: "flat",    label: "Flat — usage stays roughly the same",     score: 25 },
      { id: "some",    label: "Some users upgrade or refer others",      score: 55 },
      { id: "strong",  label: "Most users expand — upgrade / refer / add seats", score: 90 },
    ],
  },
];

/* ── Scoring ─────────────────────────────────────────────────────────────── */

export const PMF_SECTIONS = [...new Set(PMF_QUESTIONS.map((q) => q.section))];

const WEIGHTS: Record<string, number> = {
  retention:      1.8,
  churn:          1.6,
  "growth-source": 1.2,
  nps:            1.0,
  frequency:      1.2,
  "core-action":  1.0,
  disappointment: 1.8,
  alternatives:   1.2,
  revenue:        1.4,
  expansion:      1.0,
};

export function scorePMF(answers: Record<string, string>): {
  score:      number;
  grade:      "searching" | "signals" | "approaching" | "achieved";
  gradeLabel: string;
  gradeColor: string;
  sections:   { name: string; score: number; color: string }[];
  strengths:  { q: PMFQuestion; score: number }[];
  gaps:       { q: PMFQuestion; score: number; advice: string }[];
  topAction:  string;
} {
  let totalWeighted = 0;
  let totalWeight   = 0;

  const sectionScores: Record<string, { total: number; weight: number }> = {};

  for (const q of PMF_QUESTIONS) {
    const opt    = q.options.find((o) => o.id === answers[q.id]);
    const raw    = opt?.score ?? 0;
    const weight = WEIGHTS[q.id] ?? 1;
    totalWeighted += raw * weight;
    totalWeight   += 100 * weight;

    if (!sectionScores[q.section]) sectionScores[q.section] = { total: 0, weight: 0 };
    sectionScores[q.section].total  += raw * weight;
    sectionScores[q.section].weight += 100 * weight;
  }

  const score = Math.round((totalWeighted / totalWeight) * 100);

  const grade =
    score < 30 ? "searching"  :
    score < 52 ? "signals"    :
    score < 70 ? "approaching": "achieved";

  const gradeLabel =
    grade === "searching"   ? "Still Searching — You haven't found it yet"       :
    grade === "signals"     ? "Weak Signals — Early signs, big gaps remain"      :
    grade === "approaching" ? "Approaching PMF — Address the key gaps"           :
                              "PMF Achieved — The data says scale now";

  const gradeColor =
    grade === "searching"   ? "text-rose-400"    :
    grade === "signals"     ? "text-amber-400"   :
    grade === "approaching" ? "text-sky-400"     : "text-emerald-400";

  const sections = PMF_SECTIONS.map((name) => {
    const s     = sectionScores[name] ?? { total: 0, weight: 100 };
    const pct   = Math.round((s.total / s.weight) * 100);
    const color = pct >= 70 ? "bg-emerald-500/70" : pct >= 45 ? "bg-amber-500/70" : "bg-rose-500/70";
    return { name, score: pct, color };
  });

  const qScores = PMF_QUESTIONS.map((q) => {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    return { q, score: opt?.score ?? 0 };
  });

  const strengths = qScores.filter((x) => x.score >= 70).sort((a, b) => b.score - a.score);
  const gaps      = qScores.filter((x) => x.score < 50).sort((a, b) => a.score - b.score)
    .map(({ q, score }) => ({ q, score, advice: getAdvice(q.id, score) }));

  const topAction = getTopAction(grade, gaps[0]?.q.id);

  return { score, grade, gradeLabel, gradeColor, sections, strengths, gaps, topAction };
}

function getAdvice(qId: string, score: number): string {
  const map: Record<string, string> = {
    retention:       "Run exit surveys with churned users this week. Ask one question: 'What made you stop using the product?' Patterns in the answers tell you what to fix.",
    churn:           "Identify the moment users disengage. Use PostHog or Mixpanel to find the drop-off point in your user journey and fix that specific screen or flow.",
    "growth-source": "If users aren't telling their friends, they're not delighted — they're satisfied. Find your most engaged users and ask them what would make the product 10x better.",
    nps:             "Interview your 10 most active users. Ask what they love, what frustrates them, and what would make them recommend you without hesitation.",
    frequency:       "Daily habit formation comes from solving a daily problem. If users only need your product weekly or monthly, make sure the value delivered is proportionally high.",
    "core-action":   "Map the user journey to your core feature and remove every unnecessary step. If the core action has more than 3 steps, simplify it.",
    disappointment:  "Below 40% 'very disappointed' is the clearest signal you haven't found PMF. Talk to your most disappointed users — they're telling you exactly what's missing.",
    alternatives:    "If users have easy alternatives, you haven't differentiated enough. Find the specific thing only you can do and double down on it.",
    revenue:         "Introduce a paid tier, even if small. Willingness to pay is the strongest validation. If no one pays, the product is nice-to-have, not need-to-have.",
    expansion:       "Build a referral loop and in-product upsell. Users who expand are your best signal — talk to them about what triggered the expansion.",
  };
  return map[qId] ?? "Interview your users — the answers are always in the conversations.";
}

function getTopAction(grade: string, worstQId?: string): string {
  if (grade === "achieved") return "You have PMF — focus on scaling acquisition channels that already work. Don't reinvent the product.";
  if (!worstQId) return "Keep talking to users every week. Qualitative insight leads quantitative improvement.";
  const actions: Record<string, string> = {
    retention:       "Your #1 priority this week: call 5 users who churned. Do not build anything new until you understand why they left.",
    churn:           "Instrument your product to identify the exact moment users disengage. Fix that specific flow before building new features.",
    "growth-source": "Identify your top 10 most engaged users and ask them what would make them recommend you. Then build that.",
    nps:             "Run a 2-question NPS survey to your user base this week. Results will focus your next sprint.",
    disappointment:  "Run the Sean Ellis survey: 'How would you feel if you could no longer use this product?' If < 40% say 'very disappointed', you're still searching.",
    revenue:         "Launch a paid tier, any price. No free-to-paid conversion = no validation signal.",
    expansion:       "Build a referral mechanism. If your best users won't refer, find out why — that conversation is gold.",
  };
  return actions[worstQId] ?? "Talk to 5 churned users this week. The answers are in those conversations.";
}
