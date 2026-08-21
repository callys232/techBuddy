import type { Metadata } from "next";
import { StoreContent } from "@/components/sections/StoreContent";

export const metadata: Metadata = {
  title: "Store — Unlock Tools & Templates With Points",
  description: "Spend your TechBuddy points on premium template unlocks, tool access, and downloadable resources. Fund your account with crypto to top up.",
  robots: { index: false, follow: false },
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Points store</p>
          <h1 className="h-display mb-3">
            Spend your points
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Unlock premium tools and templates without a subscription — earn points across the ecosystem, or fund your account with crypto from your dashboard.
          </p>
          <StoreContent />
        </div>
      </section>
    </div>
  );
}
