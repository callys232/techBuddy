import type { Metadata } from "next";
import { PricingCard } from "@/components/ui/PricingCard";
import { ServicesContent } from "@/components/sections/ServicesContent";
import { PRICING_TIERS } from "@/mock/services";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Software Development Services in Nigeria — Web, Mobile, AI & Fintech",
  description:
    "Hire a founder-led software development team in Nigeria for web applications, mobile apps, AI integration, fintech payments, DevOps, cybersecurity, UI/UX design, and ongoing product support.",
  keywords: [
    "web development", "mobile app development",
    "fintech integration", "DevOps engineering",
    "React Next.js development", "cloud infrastructure",
    "security audit", "software development company Nigeria",
    "Lagos app developer", "AI development services",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Digital Services — Web, Mobile & Fintech Engineering | TechBuddy",
    description:
      "End-to-end engineering services for ambitious businesses everywhere. One studio, every layer of the stack.",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="flow" intensity={0.35} />
        <h1 className="h-display">
          One expert team from product idea to production
        </h1>
        <p className="mt-6 text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
          Launch a focused product, replace a fragile workflow, or improve an existing system. We help determine what should be built, explain the tradeoffs, and remain accountable through release.
        </p>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] pb-16">
        <ServicesContent />
      </section>
      </RevealSection>

      <RevealSection delay={0.05}>
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="h-section text-center mb-12">Support after launch</h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.tier} {...tier} />
          ))}
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
