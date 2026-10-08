import type { Metadata } from "next";
import Link from "next/link";
import { DowntimeCostCalculator } from "@/components/sections/DowntimeCostCalculator";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Downtime Cost Calculator — What an Outage Actually Costs You",
  description:
    "See what an hour of downtime costs your business — revenue at risk plus team productivity loss, modelled by business type. Free, instant.",
  keywords: [
    "downtime cost calculator", "cost of downtime", "uptime sla calculator",
    "cost of an outage", "website downtime cost",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Downtime Cost Calculator — What an Outage Costs | TechBuddy",
    description: "See what an hour of downtime costs in lost revenue and productivity, modelled by business type.",
  },
};

export default function DowntimeCostCalculatorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="technical" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="h-display mb-4 max-w-2xl">
            What Does an Hour of Downtime Actually Cost You?
          </h1>
          <p className="text-[var(--ink)]/50 max-w-xl mb-4 leading-relaxed">
            "We should have better uptime" is easy to say and hard to prioritise against a feature
            roadmap — until the number is in front of you. Model it here.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink)]/35 mb-12">
            <span>⏱ ~1 minute</span>
            <span>·</span>
            <span>📉 Revenue + team cost</span>
            <span>·</span>
            <span>🏷 4 business models</span>
          </div>
          <DowntimeCostCalculator />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 items-start justify-between">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-xl">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> Your monthly
            revenue divided into an hourly rate, adjusted by how directly your business model depends
            on uptime, plus your team&apos;s hourly cost during the outage. A modelled estimate, not a
            measurement of your actual infrastructure.
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
