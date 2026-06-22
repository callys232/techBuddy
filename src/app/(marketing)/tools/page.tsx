import type { Metadata } from "next";
import Link from "next/link";
import { FREE_TOOLS } from "@/mock/tools";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Free Tools — Cost Estimator, Timeline Estimator, Stack Picker & Tech Audit",
  description:
    "Free tools for Nigerian founders: project cost estimator in Naira, realistic timeline estimator, tech stack picker, and a free manual tech audit of your site or app.",
  keywords: [
    "project cost estimator Nigeria", "tech stack picker Africa",
    "free website audit Nigeria", "how much does an app cost Nigeria",
    "best tech stack Nigeria 2026",
  ],
  openGraph: {
    title: "Free Tools for African Tech Founders | TechBuddy",
    description: "Estimate your build cost, pick the right tech stack, and get a free audit — no sign-up required.",
  },
};

const STATS = [
  { value: "2 min",  label: "Average time to estimate" },
  { value: "Free",   label: "No sign-up required" },
  { value: "48 hrs", label: "Audit turnaround" },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="center" intensity={0.6} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tools
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-5">
            Plan Your Build Before You Spend a Naira
          </h1>
          <p className="text-lg text-[var(--fg)]/55 leading-relaxed">
            Four free tools to estimate costs, plan your timeline, pick the right tech stack, and get your site audited — built for African founders.
          </p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="px-[var(--container-px)] py-8 flex flex-wrap gap-8 justify-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-extrabold text-[var(--primary)]">{s.value}</p>
              <p className="text-xs text-[var(--fg)]/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool cards ───────────────────────────────────────────────────── */}
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {FREE_TOOLS.map((tool, i) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group flex flex-col glass rounded-[var(--radius-card)] border border-[var(--border)] p-7 hover:border-[var(--primary)]/60 hover:-translate-y-1.5 hover:shadow-[var(--shadow-glow-sky)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl">{tool.icon}</span>
                {tool.badge && (
                  <span className={[
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wide",
                    i === 0
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "bg-emerald-500/10 text-emerald-400",
                  ].join(" ")}>
                    {tool.badge}
                  </span>
                )}
              </div>
              <h2 className="font-heading font-bold text-lg text-[var(--fg)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {tool.title}
              </h2>
              <p className="text-sm text-[var(--fg)]/50 leading-relaxed flex-1 mb-5">
                {tool.desc}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)] text-center border-t border-[var(--border)]">
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-3">Ready for a real quote?</h2>
        <p className="text-[var(--fg)]/50 max-w-sm mx-auto mb-8">
          Our estimator gives you a range. Our quote wizard gives you an exact number with a signed scope.
        </p>
        <Link
          href="/quote"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
        >
          Get a detailed quote →
        </Link>
      </section>
    </div>
  );
}
