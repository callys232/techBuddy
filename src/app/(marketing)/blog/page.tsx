import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogContent } from "@/components/sections/BlogContent";
import { NewsFeed } from "@/components/sections/NewsFeed";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog — Tech Insights for Founders & Builders Everywhere",
  description:
    "Practical guides on building digital products, fintech integration, DevOps on emerging-market infrastructure, startup strategy and engineering best practices — grounded in Africa, useful anywhere.",
  keywords: [
    "African tech blog", "startup insights",
    "fintech tutorial", "web development blog",
    "startup engineering",
  ],
  openGraph: {
    title: "Tech Insights for Founders & Builders Everywhere | TechAgency Blog",
    description:
      "Practical engineering guides, startup strategy and fintech deep-dives — from a team building across Africa and beyond.",
  },
};

const GOALS = [
  { label: "Ship your MVP faster",       href: "/blog?category=startup-tech" },
  { label: "Pass NDPR compliance",       href: "/blog?category=security" },
  { label: "Learn what breaks at scale", href: "/blog?category=devops" },
  { label: "Pick the right stack",       href: "/blog?category=web-dev" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.35} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="eyebrow mb-5 inline-flex">The TechBuddy Blog</span>

          <h1 className="h-hero mb-5">
            Built by Builders,<br />for Builders
          </h1>

          <p className="lead max-w-lg mx-auto mb-8">
            Engineering write-ups, fintech integration guides, and startup strategy from the
            team building TechBuddy. No thought-leadership — just what works, what
            breaks, and what we&apos;d do differently.
          </p>

          {/* Real, sourced counts — not invented */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <span className="block font-display font-semibold text-2xl text-[var(--brand)]">11</span>
              <span className="stat-label">articles</span>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="text-center">
              <span className="block font-display font-semibold text-2xl text-[var(--brand)]">7</span>
              <span className="stat-label">categories</span>
            </div>
          </div>

          {/* Outcome-framed goals — what you land by reading, not what we cover */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {GOALS.map((g) => (
              <Link
                key={g.label}
                href={g.href}
                className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--ink-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <Suspense fallback={null}>
          <BlogContent />
        </Suspense>
      </section>
      </RevealSection>

      {/* ── Live news feed ───────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <div className="mb-10">
          <span className="eyebrow mb-4 inline-flex">Live from around the world</span>
          <h2 className="h-section">
            News that moves builders, everywhere
          </h2>
          <p className="muted mt-2 max-w-lg text-[14.5px]">
            Aggregated every 30 minutes from global tech press, African tech coverage, and crypto/fintech sources — so you&apos;re not the last to know.
          </p>
        </div>
        <NewsFeed />
      </section>
      </RevealSection>
    </div>
  );
}
