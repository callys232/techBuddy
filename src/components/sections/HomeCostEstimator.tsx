"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSparkles, IconArrowRight } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { EstimatorModal } from "@/components/ui/EstimatorModal";

const EXAMPLES = [
  { type: "Landing page",    range: "₦200k – ₦500k" },
  { type: "Mobile app",      range: "₦1.5M – ₦6M"   },
  { type: "Web app / MVP",   range: "₦900k – ₦4M"   },
  { type: "SaaS platform",   range: "₦5M – ₦20M+"   },
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
            <div>
              <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
                Free tool
              </span>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.1] mb-5">
                What Will Your Build Cost?
              </h2>
              <p className="text-[var(--fg)]/50 leading-relaxed mb-8 max-w-md">
                Select your project type, features, and timeline. Get an instant Naira estimate based on real projects we&apos;ve shipped — no sign-up, no commitment.
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-13 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-heading font-bold text-base text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
              >
                <IconSparkles size={16} className="opacity-80" />
                Get an instant estimate
              </button>

              <p className="mt-4 text-xs text-[var(--fg)]/30">
                Takes 60 seconds · Free · No commitment
              </p>

              {/* Cross-links */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-8 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--fg)]/30">More free tools:</span>
                <Link href="/tools/timeline-estimator"
                  className="text-xs font-semibold text-[var(--fg)]/45 hover:text-[var(--primary)] transition-colors">
                  📅 Timeline
                </Link>
                <Link href="/tools/build-vs-buy"
                  className="text-xs font-semibold text-[var(--fg)]/45 hover:text-[var(--primary)] transition-colors">
                  ⚖️ Build vs Buy
                </Link>
                <Link href="/tools/pmf-score"
                  className="text-xs font-semibold text-[var(--fg)]/45 hover:text-[var(--primary)] transition-colors">
                  📈 PMF Score
                </Link>
                <Link href="/tools"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">
                  All 8 tools <IconArrowRight size={11} />
                </Link>
              </div>
            </div>

            {/* Right: price range cards */}
            <div className="grid grid-cols-2 gap-3">
              {EXAMPLES.map(({ type, range }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg)] p-5 text-left hover:border-[var(--primary)]/60 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-sky)] transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-[var(--fg)]/45 group-hover:text-[var(--primary)] transition-colors">
                    {type}
                  </span>
                  <span className="font-display text-lg font-extrabold text-[var(--fg)] leading-tight">
                    {range}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
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
