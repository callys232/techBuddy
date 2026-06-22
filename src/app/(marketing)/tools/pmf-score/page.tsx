import type { Metadata } from "next";
import Link from "next/link";
import { PMFScorer } from "@/components/sections/PMFScorer";

export const metadata: Metadata = {
  title: "Product-Market Fit Score — Do You Have PMF?",
  description:
    "10 questions on retention, organic growth, engagement, and revenue signals. Get an honest PMF score, a breakdown by dimension, and the single most important action to take this week.",
  keywords: [
    "product market fit test Nigeria", "PMF score calculator",
    "do I have product market fit", "startup PMF test Africa",
    "Sean Ellis PMF survey online",
  ],
};

export default function PMFScorePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">Free Tool · For Founders</p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4 max-w-2xl">
            Do You Have Product-Market Fit?
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-4 leading-relaxed">
            Most founders feel like they&apos;re close to PMF without being able to prove it. This 10-question assessment uses the same framework as Superhuman, Y Combinator, and Sean Ellis to give you an honest answer — and tells you exactly what to fix.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg)]/35 mb-12">
            <span>⏱ ~4 minutes</span>
            <span>·</span>
            <span>📋 10 questions across 5 dimensions</span>
            <span>·</span>
            <span>📈 Score + specific gap analysis + top action</span>
          </div>
          <PMFScorer />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--fg)]/35 leading-relaxed max-w-xl">
            <strong className="text-[var(--fg)]/50">Methodology:</strong> Questions are adapted from Sean Ellis&apos; original PMF survey, the Superhuman PMF framework, and Y Combinator&apos;s product health diagnostics. Because this is a self-assessment (not an actual survey of your users), treat your score as a directional signal — the gap analysis is more actionable than the number itself.
          </p>
          <Link href="/tools" className="text-sm font-semibold text-[var(--primary)] hover:underline shrink-0">
            ← All free tools
          </Link>
        </div>
      </section>
    </div>
  );
}
