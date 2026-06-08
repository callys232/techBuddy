import type { Metadata } from "next";
import { TemplatesContent } from "@/components/sections/TemplatesContent";

export const metadata: Metadata = {
  title: "Web Templates — Launch-Ready Starters for African Businesses",
  description:
    "Production-ready Next.js templates for Nigerian businesses, e-commerce stores, SaaS platforms, fintech dashboards and landing pages — customised to your brand and deployed in days.",
  keywords: [
    "web template Nigeria", "Next.js template Africa",
    "SaaS starter Nigeria", "e-commerce template Nigeria",
    "landing page template Africa",
  ],
  openGraph: {
    title: "Launch-Ready Web Templates for African Businesses | TechAgency",
    description:
      "Pre-built, production-ready templates — customised to your brand, deployed in days.",
  },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          Start Fast, Launch Faster
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          Production-ready templates — customized to your brand, deployed in days.
        </p>
      </section>
      <section className="px-[var(--container-px)] pb-[var(--section-y)]">
        <TemplatesContent />
      </section>
    </div>
  );
}
