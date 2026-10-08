import type { Metadata } from "next";
import { PremiumAudit } from "@/components/sections/PremiumAudit";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Premium Audit Report — Instant Automated Site Audit | TechBuddy Premium",
  description:
    "An instant, automated deep-dive audit — security headers, SEO signals, performance and best practices — as a branded PDF report. TechBuddy Premium.",
  keywords: [
    "automated website audit", "security headers checker",
    "SEO audit tool", "website performance report",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Premium Audit Report — Instant Site Deep-Dive | TechBuddy",
    description: "Security headers, SEO signals, performance and best practices — as a branded PDF report.",
  },
};

export default function PremiumAuditPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Premium Tool</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            Premium Audit Report
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Enter your URL — get an instant, automated report on security, SEO and performance, on top of our free 48-hour manual review.
          </p>
          <PremiumAudit />
        </div>
      </section>
    </div>
  );
}
