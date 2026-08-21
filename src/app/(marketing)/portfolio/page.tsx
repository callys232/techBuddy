import type { Metadata } from "next";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Portfolio — Concept Projects Showing How We Build",
  description:
    "Concept web platforms, mobile apps, fintech systems and SaaS products that show our design and engineering approach — a preview of what we'd build for you.",
  keywords: [
    "tech portfolio", "web app examples",
    "mobile app portfolio", "African startup software examples",
  ],
  openGraph: {
    title: "How We Build — Concept Projects | TechAgency",
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
          <p className="eyebrow justify-center mb-4">Concept work</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-none">
            How We Build
          </h1>
          <p className="mt-6 text-lg text-[var(--ink-muted)] max-w-xl mx-auto">
            These are concept projects — not completed client engagements — that show the kind of platform, app, and system design we bring to a real build.
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
