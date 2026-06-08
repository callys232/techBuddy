import type { Metadata } from "next";
import { InvestCard } from "@/components/ui/InvestCard";
import { INVEST_SCHEMES } from "@/mock/invest";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Investment & Incubation — We Co-Build With African Founders",
  description:
    "Equity builds, revenue-share development, incubation support and grant navigation for African startup founders. We build your product while you grow your business.",
  keywords: [
    "startup equity Nigeria", "co-build Africa",
    "tech incubation Nigeria", "revenue share software Africa",
    "African founder investment", "non-dilutive grant Nigeria",
  ],
  openGraph: {
    title: "We Invest in Ideas Worth Building | TechAgency Africa",
    description:
      "Equity, revenue share, incubation and advisory for African founders building serious products.",
  },
};

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <PageVectors variant="scattered" intensity={0.5} />
        <div className="relative z-10">
          <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
            We Invest in Ideas<br />Worth Building
          </h1>
          <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
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

      {/* Auth-gated application — Clerk sign-in required */}
      <section className="px-[var(--container-px)] py-[var(--section-y)] text-center bg-[var(--surface)]">
        <p className="text-[var(--fg)]/60 mb-4">Sign in to submit a full application.</p>
        <a
          href="/sign-in?redirect=/invest/apply"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--primary)] px-7 font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all"
        >
          Sign in to apply
        </a>
      </section>
    </div>
  );
}
