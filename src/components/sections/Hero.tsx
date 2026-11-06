import Link from "next/link";
import { IconArrowRight, IconCircleCheck, IconShieldCheck, IconBolt } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";

const outcomes = [
  {
    title: "Less manual work",
    desc: "Replace disconnected tools, repetitive tasks, and spreadsheet workarounds with automated web & mobile systems.",
    badge: "Automation",
  },
  {
    title: "A better customer experience",
    desc: "Give customers clearer, faster ways to buy, book, pay, or get automated support across web & mobile.",
    badge: "UX & Payments",
  },
  {
    title: "A reliable path to launch",
    desc: "Get a clear scope, weekly visible progress, and dedicated post-launch maintenance with zero guesswork.",
    badge: "4-6 Wks MVP",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-soft)]/40 via-[var(--page)] to-[var(--page)] py-[var(--section-y)]">
      <PageVectors variant="top-right" intensity={0.4} />

      <div className="shell relative z-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="max-w-3xl">
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--ink)] mb-6 shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] text-[var(--ink-muted)]">Available for Q4 2026 builds</span>
              <span className="text-[var(--border-strong)]">·</span>
              <span className="text-[var(--brand)] font-semibold text-[11px]">5-day kickoff</span>
            </div>

            <h1 className="h-hero mb-6 text-balance">
              Make your business easier to run—and easier to grow.
            </h1>

            <p className="lead max-w-2xl mb-8 text-[var(--ink-muted)] leading-relaxed">
              We turn inefficient workflows and ambitious product ideas into dependable web and mobile software—from the first plan to launch, scaling, and ongoing support.
            </p>

            <div className="flex flex-col gap-3.5 sm:flex-row items-stretch sm:items-center">
              <Link href="/quote" className="btn-primary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                <span>Get a project estimate</span>
                <IconArrowRight size={15} />
              </Link>
              <Link href="/about" className="btn-ghost px-7 py-3.5 text-sm inline-flex items-center justify-center">
                See how we work
              </Link>
            </div>

            {/* Micro-trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[var(--ink-faint)] border-t border-[var(--border)] pt-5">
              <div className="flex items-center gap-2">
                <IconShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>NDA &amp; Full IP ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBolt size={16} className="text-[var(--brand)] shrink-0" />
                <span>Milestone-based delivery</span>
              </div>
            </div>
          </div>

          {/* Elevated Proof Panel */}
          <aside className="rounded-2xl border border-[var(--border-strong)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-soft)]/50 p-6 sm:p-8 shadow-card backdrop-blur-sm relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
                What changes with TechBuddy
              </p>
              <span className="font-mono text-[10px] text-[var(--ink-faint)] bg-[var(--surface-raised)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                Guaranteed
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {outcomes.map((item, index) => (
                <div key={item.title} className="flex gap-4 group">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/8 font-mono text-xs font-bold text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-colors duration-300">
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-heading text-base font-bold text-[var(--ink)]">
                        {item.title}
                      </h2>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--brand)]/80 bg-[var(--brand)]/5 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--ink-muted)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-4 flex items-center gap-3 text-xs text-[var(--ink-muted)]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <IconCircleCheck size={16} />
              </div>
              <span>
                <strong>End-to-end partner:</strong> Strategy, product design, engineering, and infrastructure all under one roof.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
