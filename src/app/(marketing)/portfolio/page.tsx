import type { Metadata } from "next";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Portfolio — Digital Products Built for Africa",
  description:
    "Case studies of web platforms, mobile apps, fintech systems and SaaS products we've shipped for Nigerian and African startups and enterprises. From Lagos to Nairobi.",
  keywords: [
    "tech portfolio Nigeria", "web app case studies Africa",
    "mobile app Nigeria portfolio", "African startup software examples",
  ],
  openGraph: {
    title: "Our Work — Digital Products Built for Africa | TechAgency",
    description:
      "See how we've built platforms, apps and systems for serious African businesses.",
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.4} />
        <div className="relative z-10">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Projects We&apos;ve Built
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          From Lagos to Nairobi — products that move the needle.
        </p>
        </div>
      </section>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <PortfolioContent />
      </section>
    </div>
  );
}
