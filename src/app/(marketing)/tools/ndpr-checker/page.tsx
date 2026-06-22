import type { Metadata } from "next";
import { NDPRChecker } from "@/components/sections/NDPRChecker";

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
    title: "Free NDPR Compliance Checker | TechAgency Africa",
    description: "16 questions. Instant compliance score. Specific gaps and what to do about them.",
  },
};

export default function NDPRCheckerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.25em] mb-4">
            Free Tool · Nigeria-specific
          </p>
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-4 max-w-2xl">
            How NDPR Compliant Is Your Product?
          </h1>
          <p className="text-[var(--fg)]/50 max-w-xl mb-4 leading-relaxed">
            The Nigerian Data Protection Regulation (NDPR) requires every business that processes personal data to meet 16 core requirements. Answer honestly — this isn&apos;t a sales pitch, it&apos;s a real compliance check.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg)]/35 mb-12">
            <span>⏱ ~8 minutes</span>
            <span>·</span>
            <span>📋 16 questions across 6 categories</span>
            <span>·</span>
            <span>⚖️ Based on NDPR 2019 & NITDA guidelines</span>
          </div>

          <NDPRChecker />
        </div>
      </section>

      <section className="px-[var(--container-px)] py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[var(--fg)]/35 leading-relaxed max-w-2xl">
            <strong className="text-[var(--fg)]/50">Disclaimer:</strong> This tool is for educational and preliminary self-assessment purposes only. It does not constitute legal advice. For a formal NDPR compliance audit or filing with NITDA, engage a licensed Data Protection Compliance Organisation (DPCO). The questions are based on the NDPR 2019, the NDPR Implementation Framework, and NITDA guidelines as of 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
