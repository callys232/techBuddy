import type { Metadata } from "next";
import Link from "next/link";
import { TimelineEstimator } from "@/components/sections/TimelineEstimator";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Project Timeline Estimator — How Long Will My Build Take?",
  description:
    "Get a realistic, phase-by-phase development timeline based on your project type, features, team readiness and integrations. Built from real project delivery data.",
  keywords: [
    "how long to build an app", "software development timeline",
    "project timeline estimator", "MVP timeline estimator",
    "web app development time",
  ],
  openGraph: {
    title: "How Long Will Your Build Take? | TechAgency",
    description: "Phase-by-phase timeline estimation, scoped in 5 questions.",
  },
};

export default function TimelineEstimatorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="scattered" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4 max-w-2xl">
            How Long Will Your Build Take?
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-4 leading-relaxed">
            Answer 5 questions about your project scope, design readiness, and team. We&apos;ll generate a phase-by-phase timeline and three possible launch dates.
          </p>

          {/* Cross-link to cost estimator */}
          <div className="flex items-center gap-3 mb-12">
            <Link
              href="/tools/cost-estimator"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              💰 Want the cost too? Use the cost estimator →
            </Link>
          </div>

          <TimelineEstimator />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-sm text-[var(--ink-faint)] leading-relaxed max-w-2xl">
            <strong className="text-[var(--ink-muted)]">How is this calculated?</strong>{" "}
            This is a rule-based estimate — phase durations and deltas modeled on typical project patterns, from landing pages to full SaaS platforms, not a live database. Timeline deltas for design readiness, feedback speed, and integration complexity reflect the most common causes of project overruns. A formal quote from our wizard will include contractual milestone dates and a fixed-scope agreement.
          </p>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}

