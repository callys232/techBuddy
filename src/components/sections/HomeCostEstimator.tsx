"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSparkles, IconArrowRight } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { EstimatorModal } from "@/components/ui/EstimatorModal";
import { CurrencyApprox } from "@/components/ui/CurrencyApprox";

const EXAMPLES = [
  { type: "Landing page",    range: "₦200k – ₦500k", ngnMin: 200_000,   ngnMax: 500_000    },
  { type: "Mobile app",      range: "₦1.5M – ₦6M",   ngnMin: 1_500_000, ngnMax: 6_000_000  },
  { type: "Web app / MVP",   range: "₦900k – ₦4M",   ngnMin: 900_000,   ngnMax: 4_000_000  },
  { type: "SaaS platform",   range: "₦5M – ₦20M+",   ngnMin: 5_000_000, ngnMax: 20_000_000 },
];

export function HomeCostEstimator() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.32} />

        <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <div className="lg:order-2">
              <span className="eyebrow">Plan with confidence</span>
              <h2 className="mt-2 h-section mb-5">
                Know the likely cost before the first sales call
              </h2>
              <p className="text-[var(--ink)]/50 leading-relaxed mb-8 max-w-md">
                Choose what you&apos;re building, the features you need, and your timeline. You&apos;ll get a practical Naira budget range you can use to plan the next step—without creating an account.
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-13 items-center gap-2 rounded-full bg-[var(--brand)] px-8 font-heading font-bold text-base text-[var(--page)] hover:opacity-90 transition-all active:scale-95"
              >
                <IconSparkles size={16} className="opacity-80" />
                Get an instant estimate
              </button>

              <p className="mt-4 text-xs text-[var(--ink)]/30">
                Takes 60 seconds · Free · No commitment
              </p>

              {/* Cross-links */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-8 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--ink)]/30">More free tools:</span>
                <Link href="/tools/timeline-estimator"
                  className="text-xs font-semibold text-[var(--ink)]/45 hover:text-[var(--brand)] transition-colors">
                  📅 Timeline
                </Link>
                <Link href="/tools/build-vs-buy"
                  className="text-xs font-semibold text-[var(--ink)]/45 hover:text-[var(--brand)] transition-colors">
                  ⚖️ Build vs Buy
                </Link>
                <Link href="/tools/pmf-score"
                  className="text-xs font-semibold text-[var(--ink)]/45 hover:text-[var(--brand)] transition-colors">
                  📈 PMF Score
                </Link>
                <Link href="/tools"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline">
                  All 8 tools <IconArrowRight size={11} />
                </Link>
              </div>
            </div>

            {/* Right: price range cards */}
            <div className="grid grid-cols-2 gap-3 lg:order-1">
              {EXAMPLES.map(({ type, range, ngnMin, ngnMax }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--page)] p-5 text-left hover:border-[var(--brand)]/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-[var(--ink)]/45 group-hover:text-[var(--brand)] transition-colors">
                    {type}
                  </span>
                  <span className="font-display text-lg font-extrabold text-[var(--ink)] leading-tight">
                    {range}
                  </span>
                  <CurrencyApprox ngn={ngnMin} ngnMax={ngnMax} className="block text-[10px] text-[var(--ink-faint)]" />
                  <span className="text-[10px] font-mono text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Estimate mine →
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Modal */}
      <EstimatorModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
