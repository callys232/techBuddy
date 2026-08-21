import type { Metadata } from "next";
import { SportPredictor } from "@/components/sections/SportPredictor";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Sport Predictor — Free Football & Basketball Match Analysis",
  description:
    "Pick an upcoming Premier League, La Liga, Serie A, Bundesliga, Champions League or NBA fixture and get a free win-probability analysis, form guide, and head-to-head record.",
  keywords: [
    "football match predictor", "premier league prediction tool",
    "sports prediction tool", "NBA prediction tool",
    "match analysis free tool",
  ],
  openGraph: {
    title: "Sport Predictor — Free Match Analysis | TechAgency",
    description: "Win probability, form guide and head-to-head record for upcoming top-league fixtures — free.",
  },
};

export default function SportPredictorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="scattered" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="eyebrow justify-center mb-4">Free Tool · Sport Predictor</p>
          <h1 className="h-display mb-4">
            Who Wins The Next Big Match?
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mx-auto mb-4 leading-relaxed">
            Pick a fixture from the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League or NBA — get a win-probability breakdown, form guide, head-to-head record and projected scoreline, built from this season&apos;s real results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--ink-faint)] mb-12">
            <span>Live upcoming fixtures</span>
            <span>·</span>
            <span>7 leagues</span>
            <span>·</span>
            <span>Free — no sign-up to browse</span>
          </div>

          <SportPredictor />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-sm text-[var(--ink-faint)] leading-relaxed max-w-2xl mx-auto text-center">
            <strong className="text-[var(--ink-muted)]">How is this generated?</strong> Fixtures and season results come from a live sports data feed. Predictions are built with Elo ratings (and a Poisson goal model for football) computed from this season&apos;s actual completed matches — the same family of models FiveThirtyEight-style forecasters use. It is not verified betting odds or insider information, and confidence is lower early in a season when fewer matches have been played. For entertainment purposes only; please gamble responsibly.
          </p>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
