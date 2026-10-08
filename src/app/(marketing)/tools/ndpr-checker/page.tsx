import type { Metadata } from "next";
import { NDPRChecker } from "@/components/sections/NDPRChecker";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "NDPR Compliance Checker — How Compliant Is Your Nigerian Product?",
  description:
    "Answer 16 questions and get an instant NDPR compliance score, gap analysis with legal context, and priority actions. Built specifically for Nigerian businesses and startups.",
  keywords: [
    "NDPR compliance Nigeria", "data protection Nigeria checker",
    "NITDA compliance audit", "Nigerian data privacy self-assessment",
    "NDPR gap analysis", "data protection officer Nigeria",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Free NDPR Compliance Checker | TechBuddy",
    description: "16 questions. Instant compliance score. Specific gaps and what to do about them.",
  },
};

export default function NDPRCheckerPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="top-right" intensity={0.38} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool · Nigeria-specific</p>
          <h1 className="h-display mb-4 max-w-2xl">
            How NDPR Compliant Is Your Product?
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-4 leading-relaxed">
            The Nigerian Data Protection Regulation (NDPR) requires every business that processes personal data to meet 16 core requirements. Answer honestly — this isn&apos;t a sales pitch, it&apos;s a real compliance check.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink-faint)] mb-12">
            <span>⏱ ~8 minutes</span>
            <span>·</span>
            <span>📋 16 questions across 6 categories</span>
            <span>·</span>
            <span>⚖️ Based on NDPR 2019 & NITDA guidelines</span>
          </div>

          <NDPRChecker />
        </div>
      </section>

      <RevealSection>
      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-sm text-[var(--ink-faint)] leading-relaxed max-w-2xl">
            <strong className="text-[var(--ink-muted)]">Disclaimer:</strong> This tool is for educational and preliminary self-assessment purposes only. It does not constitute legal advice. For a formal NDPR compliance audit or filing with NITDA, engage a licensed Data Protection Compliance Organisation (DPCO). The questions are based on the NDPR 2019, the NDPR Implementation Framework, and NITDA guidelines as of 2026.
          </p>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}

