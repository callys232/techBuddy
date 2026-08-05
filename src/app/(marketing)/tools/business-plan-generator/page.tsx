import type { Metadata } from "next";
import { BusinessPlanGenerator } from "@/components/sections/BusinessPlanGenerator";

export const metadata: Metadata = {
  title: "AI Business Plan Generator — Investor-Ready, in Minutes | TechBuddy Premium",
  description:
    "Turn your idea into a structured business plan — executive summary, market analysis, business model, go-to-market and financial summary — ready to share with investors. TechBuddy Premium.",
  keywords: [
    "AI business plan generator", "business plan template",
    "startup business plan generator", "investor pitch generator",
  ],
};

export default function BusinessPlanGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-6xl mx-auto">
          <p className="eyebrow mb-4">Premium Tool · AI-powered</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            AI Business Plan Generator
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Describe your idea — get a structured, investor-ready business plan with market analysis, business model, and go-to-market strategy.
          </p>
          <BusinessPlanGenerator />
        </div>
      </section>
    </div>
  );
}
