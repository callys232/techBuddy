import type { Metadata } from "next";
import Link from "next/link";
import { FREE_TOOLS } from "@/mock/tools";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Free & Premium Tools — Resume Maker, Invoice Generator, QR Codes, AI Business Plans & More",
  description:
    "Seventeen tools for founders, job seekers and builders everywhere: cost estimator, invoice generator, QR codes, AI business plan generator, resume maker, and more. Most are free — no sign-up required.",
  keywords: [
    "project cost estimator", "tech stack picker",
    "free website audit", "how much does an app cost",
    "invoice generator", "qr code generator", "business name generator",
    "cover letter generator", "AI business plan generator",
  ],
  openGraph: {
    title: "Free & Premium Tools for Builders Everywhere | TechBuddy",
    description: "Estimate your build cost, generate invoices and QR codes, write a cover letter, or get an AI business plan — most are free.",
  },
};

const STATS = [
  { value: "17",     label: "Tools in the ecosystem" },
  { value: "Free",   label: "No sign-up for most" },
  { value: "48 hrs", label: "Manual audit turnaround" },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="center" intensity={0.6} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="eyebrow mb-4">
            Free Tools
          </p>
          <h1 className="h-display mb-5">
            Plan Your Build Before You Spend a Dime
          </h1>
          <p className="text-lg text-[var(--ink)]/55 leading-relaxed">
            Seventeen tools — estimate costs, generate invoices and QR codes, write a cover letter, name your business, build your resume, and more. A few premium tools go deeper with AI. No sign-up for most.
          </p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <RevealSection>
      <div className="bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="px-[var(--container-px)] py-8 flex flex-wrap gap-8 justify-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-extrabold text-[var(--brand)]">{s.value}</p>
              <p className="text-xs text-[var(--ink)]/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      </RevealSection>

      {/* ── Tool cards ───────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {FREE_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className={[
                "group flex flex-col glass rounded-[var(--radius-card)] border p-5 hover:-translate-y-1.5 transition-all duration-300",
                tool.premium
                  ? "border-amber-400/30 hover:border-amber-400/60 hover:shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                  : "border-[var(--border)] hover:border-[var(--brand)]/60",
              ].join(" ")}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{tool.icon}</span>
                {tool.badge && (
                  <span className={[
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-wide",
                    tool.premium
                      ? "bg-amber-400/15 text-amber-500"
                      : tool.badge === "New" || tool.badge === "AI-powered"
                        ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                        : "bg-emerald-500/10 text-emerald-400",
                  ].join(" ")}>
                    {tool.badge}
                  </span>
                )}
              </div>
              <h2 className={[
                "font-heading font-bold text-base text-[var(--ink)] mb-1.5 transition-colors",
                tool.premium ? "group-hover:text-amber-500" : "group-hover:text-[var(--brand)]",
              ].join(" ")}>
                {tool.title}
              </h2>
              <p className="text-sm text-[var(--ink)]/50 leading-relaxed flex-1 mb-4">
                {tool.desc}
              </p>
              <span className={[
                "inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all",
                tool.premium ? "text-amber-500" : "text-[var(--brand)]",
              ].join(" ")}>
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>
      </RevealSection>

      {/* ── Points store CTA ────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] py-16 text-center">
        <p className="eyebrow justify-center mb-3">Points store</p>
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-3">Unlock premium tools with points</h2>
        <p className="text-[var(--ink-muted)] max-w-sm mx-auto mb-8">
          Earn points by using free tools, or fund your account with crypto — then spend them on premium unlocks and downloads, no subscription needed.
        </p>
        <Link href="/store" className="btn-secondary h-12 px-8">
          Visit the store →
        </Link>
      </section>
      </RevealSection>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] py-[var(--section-y)] bg-[var(--surface)] text-center border-t border-[var(--border)]">
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-3">Ready for a real quote?</h2>
        <p className="text-[var(--ink-muted)] max-w-sm mx-auto mb-8">
          Our estimator gives you a range. Our quote wizard gives you an exact number with a signed scope.
        </p>
        <Link
          href="/quote"
          className="btn-primary h-12 px-8"
        >
          Get a detailed quote →
        </Link>
      </section>
      </RevealSection>
    </div>
  );
}
