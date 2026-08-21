import type { Metadata } from "next";
import { InvestCard } from "@/components/ui/InvestCard";
import { INVEST_SCHEMES } from "@/mock/invest";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Investment & Incubation — We Co-Build With Ambitious Founders",
  description:
    "Equity builds, revenue-share development, incubation support and grant navigation for founders building the next big thing — rooted in Africa, open to founders everywhere.",
  keywords: [
    "startup equity", "co-build studio",
    "tech incubation", "revenue share software",
    "African founder investment", "non-dilutive grant",
  ],
  openGraph: {
    title: "We Invest in Ideas Worth Building | TechAgency",
    description:
      "Equity, revenue share, incubation and advisory for ambitious founders building serious products.",
  },
};

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.5} />
        <div className="relative z-10">
          <h1 className="h-display">
            We Invest in Ideas<br />Worth Building
          </h1>
          <p className="mt-6 text-lg text-[var(--ink)]/60 max-w-xl mx-auto">
            We don&apos;t just build — we partner. Equity, revenue share, incubation, and advisory.
          </p>
        </div>
      </section>

      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVEST_SCHEMES.map((scheme) => (
            <InvestCard key={scheme.name} {...scheme} />
          ))}
        </div>
      </section>

      {/* Application CTA */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center bg-[var(--surface)]">
        <h2 className="font-display text-2xl font-extrabold text-[var(--ink)] mb-3">
          Ready to pitch your idea?
        </h2>
        <p className="text-[var(--ink)]/55 mb-6 max-w-md mx-auto">
          Submit a short brief and we&apos;ll review it within 5 business days. No lengthy decks required.
        </p>
        <a
          href="/invest/apply"
          className="btn-primary h-11 px-8"
        >
          Apply now — it&apos;s free
        </a>
      </section>
    </div>
  );
}
