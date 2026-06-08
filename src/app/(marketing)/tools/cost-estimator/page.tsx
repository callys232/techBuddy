import type { Metadata } from "next";
import { CostEstimator } from "@/components/sections/CostEstimator";

export const metadata: Metadata = {
  title: "Project Cost Estimator — How Much Does a Website or App Cost in Nigeria?",
  description:
    "Instant Naira cost estimates for web apps, mobile apps, SaaS platforms and e-commerce stores — based on real project data from Nigerian builds. Adjust for features and timeline.",
  keywords: [
    "app cost Nigeria", "website cost Nigeria 2026",
    "how much does it cost to build an app in Nigeria",
    "software development cost Africa", "web app price Nigeria",
  ],
};

export default function CostEstimatorPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4 max-w-2xl">
            How Much Will Your Build Cost?
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-12 leading-relaxed">
            Select your project type, tick the features you need, and pick a timeline. We&apos;ll show you an estimated Naira range based on real projects we&apos;ve built.
          </p>
          <CostEstimator />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[var(--fg)]/35 leading-relaxed max-w-2xl">
            <strong className="text-[var(--fg)]/50">How is this calculated?</strong> Base costs come from our median project delivery data across 120+ builds. Feature add-ons reflect average complexity. Timeline adjustments mirror real urgency premiums and negotiated long-lead discounts. The final quote you receive after the wizard may differ based on your specific requirements, design complexity, third-party integrations, and team composition.
          </p>
        </div>
      </section>
    </div>
  );
}
