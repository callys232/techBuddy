import type { Metadata } from "next";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Portfolio — Product Design & Engineering Work",
  description:
    "A portfolio of product concepts across web, mobile, fintech, and SaaS—showing our approach to strategy, interface design, and production engineering.",
  keywords: [
    "tech portfolio", "web app examples",
    "mobile app portfolio", "African startup software examples",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Product Design & Engineering Portfolio | TechBuddy",
    description:
      "A preview of the platforms, apps and systems we design and build for serious, ambitious businesses.",
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.4} />
        <div className="relative z-10">
          <p className="eyebrow justify-center mb-4">Selected portfolio</p>
          <h1 className="h-display">
            See the reasoning behind the product
          </h1>
          <p className="mt-6 text-lg text-[var(--ink-muted)] max-w-xl mx-auto">
            A transparent portfolio of concept projects—not client claims—showing how we approach product strategy, interface design, technical architecture, and measurable outcomes.
          </p>
        </div>
      </section>
      <RevealSection>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <PortfolioContent />
      </section>
      </RevealSection>
    </div>
  );
}
