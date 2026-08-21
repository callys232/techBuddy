import type { Metadata } from "next";
import Link from "next/link";
import { BuildVsBuyCalc } from "@/components/sections/BuildVsBuyCalc";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Build vs Buy Calculator — Should You Build Custom or Use a SaaS Tool?",
  description:
    "Compare the 3-year total cost of building custom software against the best SaaS alternatives. Get a clear recommendation with break-even analysis — for 9 common business tool categories.",
  keywords: [
    "build vs buy software", "custom software vs SaaS",
    "should I build or buy software", "software ROI calculator",
    "CRM build or buy", "helpdesk build or buy",
  ],
};

export default function BuildVsBuyPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4 max-w-2xl">
            Build Custom or Buy a SaaS Tool?
          </h1>
          <p className="text-[var(--ink)]/50 max-w-xl mb-4 leading-relaxed">
            The answer isn&apos;t always "build" — and it&apos;s not always "buy." It depends on your customisation needs, timeline, team size, and how long you plan to use it. This tool does the maths for you.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink)]/35 mb-12">
            <span>⏱ ~3 minutes</span>
            <span>·</span>
            <span>📊 9 tool categories</span>
            <span>·</span>
            <span>💰 3-year cost comparison + break-even</span>
          </div>
          <BuildVsBuyCalc />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-xl">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> Build costs use our real project delivery data. SaaS costs use current public pricing for the most popular options in each category. Maintenance is estimated at 15% of build cost per year — realistic for a well-built product with ongoing updates.
          </p>
          <Link href="/tools" className="text-sm font-semibold text-[var(--brand)] hover:underline shrink-0">
            ← All free tools
          </Link>
        </div>
      </section>
    </div>
  );
}
