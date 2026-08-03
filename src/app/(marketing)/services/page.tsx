import type { Metadata } from "next";
import { PricingCard } from "@/components/ui/PricingCard";
import { ServicesContent } from "@/components/sections/ServicesContent";
import { PRICING_TIERS } from "@/mock/services";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Services — Web, Mobile, Fintech & DevOps Engineering",
  description:
    "Full-stack web applications, iOS & Android mobile apps, fintech integration, cloud DevOps, security auditing and ongoing maintenance — all under one roof, from a Lagos-born team serving clients worldwide.",
  keywords: [
    "web development", "mobile app development",
    "fintech integration", "DevOps engineering",
    "React Next.js development", "cloud infrastructure",
    "security audit",
  ],
  openGraph: {
    title: "Digital Services — Web, Mobile & Fintech Engineering | TechAgency",
    description:
      "End-to-end engineering services for ambitious businesses everywhere. One studio, every layer of the stack.",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="flow" intensity={0.35} />
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Everything Your Business Needs to Win Online
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-2xl mx-auto">
          From strategy to deployment — we cover every layer of the stack.
        </p>
      </section>

      <section className="px-[var(--container-px)] pb-16">
        <ServicesContent />
      </section>

      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h2 className="font-display text-4xl font-bold text-center text-[var(--fg)] mb-12">Maintenance Plans</h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.tier} {...tier} />
          ))}
        </div>
      </section>
    </div>
  );
}
