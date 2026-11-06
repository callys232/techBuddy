import type { Metadata } from "next";
import { CostEstimator } from "@/components/sections/CostEstimator";
import { PageVectors } from "@/components/bg/PageVectors";
import { CurrencyBanner } from "@/components/ui/CurrencyBanner";
import { getUserLocation } from "@/lib/geo";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { ShareTool } from "@/components/ui/ShareTool";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Project Cost Estimator — How Much Does a Website or App Cost?",
  description:
    "Instant cost estimates in Naira (with USD equivalents) for web apps, mobile apps, SaaS platforms and e-commerce stores — based on real project delivery data. Adjust for features and timeline.",
  keywords: [
    "app development cost", "website cost 2026",
    "how much does it cost to build an app",
    "software development cost Africa", "web app price estimator",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Project Cost Estimator — Website & App Pricing | TechBuddy",
    description: "Instant cost estimates in Naira and USD, based on real project delivery data. Adjust for features and timeline.",
  },
};

export default async function CostEstimatorPage() {
  const location = await getUserLocation();

  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="flow" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <CurrencyBanner location={location} />
          <p className="eyebrow mb-4">
            Free Tool
          </p>
          <h1 className="h-display mb-4 max-w-2xl">
            How Much Will Your Build Cost?
          </h1>
          <p className="text-[var(--ink)]/50 max-w-xl mb-12 leading-relaxed">
            Select your project type, tick the features you need, and pick a timeline. We&apos;ll show you an estimated Naira range based on real projects we&apos;ve built.
          </p>
          <CostEstimator />
          <ShareTool toolName="Project Cost Estimator" className="mt-12" />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-sm text-[var(--ink)]/35 leading-relaxed max-w-2xl">
            <strong className="text-[var(--ink)]/50">How is this calculated?</strong> Base costs come from our median project delivery data across 120+ builds. Feature add-ons reflect average complexity. Timeline adjustments mirror real urgency premiums and negotiated long-lead discounts. The final quote you receive after the wizard may differ based on your specific requirements, design complexity, third-party integrations, and team composition.
          </p>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}

