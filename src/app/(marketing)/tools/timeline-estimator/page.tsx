import type { Metadata } from "next";
import Link from "next/link";
import { TimelineEstimator } from "@/components/sections/TimelineEstimator";

export const metadata: Metadata = {
  title: "Project Timeline Estimator — How Long Will My Build Take?",
  description:
    "Get a realistic, phase-by-phase development timeline based on your project type, features, team readiness and integrations. Built from real Nigerian project delivery data.",
  keywords: [
    "how long to build an app Nigeria", "software development timeline Africa",
    "project timeline estimator Nigeria", "MVP timeline Nigeria",
    "web app development time Nigeria",
  ],
  openGraph: {
    title: "How Long Will Your Build Take? | TechAgency Africa",
    description: "Phase-by-phase timeline estimation based on 35+ real projects. Scope in 5 questions.",
  },
};

export default function TimelineEstimatorPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4 max-w-2xl">
            How Long Will Your Build Take?
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-4 leading-relaxed">
            Answer 5 questions about your project scope, design readiness, and team. We&apos;ll generate a phase-by-phase timeline and three possible launch dates — based on real delivery data from projects we&apos;ve shipped.
          </p>

          {/* Cross-link to cost estimator */}
          <div className="flex items-center gap-3 mb-12">
            <Link
              href="/tools/cost-estimator"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              💰 Want the cost too? Use the cost estimator →
            </Link>
          </div>

          <TimelineEstimator />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[var(--fg)]/35 leading-relaxed max-w-2xl">
            <strong className="text-[var(--fg)]/50">How is this calculated?</strong>{" "}
            Phase durations come from our delivery data across 35+ shipped products, from landing pages to full SaaS platforms. Feature additions are weighted by real implementation time (not estimates). Timeline deltas for design readiness, feedback speed, and integration complexity reflect the most common causes of project overruns we&apos;ve seen. A formal quote from our wizard will include contractual milestone dates and a fixed-scope agreement.
          </p>
        </div>
      </section>
    </div>
  );
}
