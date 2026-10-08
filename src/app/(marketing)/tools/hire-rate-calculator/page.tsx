import type { Metadata } from "next";
import Link from "next/link";
import { HireRateCalculator } from "@/components/sections/HireRateCalculator";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Nigerian Tech Hire Rate Calculator — What to Budget by Role",
  description:
    "Typical monthly rates for frontend, backend, mobile, DevOps engineers, designers and PMs in the Lagos/Abuja tech market, by seniority. Free, instant.",
  keywords: [
    "nigeria developer salary", "lagos tech salary", "hire developer nigeria cost",
    "software engineer salary nigeria", "tech hiring budget nigeria",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Nigerian Tech Hire Rate Calculator | TechBuddy",
    description: "Typical monthly rates by role and seniority in the Lagos/Abuja tech market. Free, instant.",
  },
};

export default function HireRateCalculatorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4 max-w-2xl">
            What Should You Budget to Hire in Nigeria?
          </h1>
          <p className="text-[var(--ink)]/50 max-w-xl mb-4 leading-relaxed">
            Pick a role and seniority level to get a realistic monthly rate for the Lagos/Abuja
            market — a starting point for a job post or a hiring conversation, not a guarantee.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink)]/35 mb-12">
            <span>⏱ ~15 seconds</span>
            <span>·</span>
            <span>🇳🇬 Lagos/Abuja market</span>
            <span>·</span>
            <span>👥 7 roles × 3 seniority levels</span>
          </div>
          <HireRateCalculator />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-xl">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> A general market
            estimate for 2026, not a formal survey — actual offers vary by company stage, exact skill
            set, and whether the role is remote for a foreign employer, which typically pays more.
          </p>
          <Link href="/tools" className="text-sm font-semibold text-[var(--brand)] hover:underline shrink-0">
            ← All free tools
          </Link>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
