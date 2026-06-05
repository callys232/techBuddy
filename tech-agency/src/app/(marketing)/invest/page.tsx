import type { Metadata } from "next";
import { InvestCard } from "@/components/ui/InvestCard";

export const metadata: Metadata = {
  title: "Investment & Schemes",
  description: "We invest in ideas worth building. Equity builds, revenue share, incubation, and partnerships.",
};

const SCHEMES = [
  {
    name: "Equity Build",
    type: "Equity",
    description: "We build your product in exchange for an equity stake. Best for strong ideas with traction.",
    eligibility: "Early-stage startups with validated idea",
    ctaText: "Express interest",
  },
  {
    name: "Revenue Share",
    type: "Revenue",
    description: "We build now, you pay from revenue. Zero upfront cost for vetted founders.",
    eligibility: "Founders with clear revenue model",
    ctaText: "Express interest",
  },
  {
    name: "Incubation Support",
    type: "Incubation",
    description: "Tech support at reduced rates for accelerator cohort companies.",
    eligibility: "Accelerator cohort members",
    ctaText: "Apply now",
  },
  {
    name: "Grant Navigator",
    type: "Advisory",
    description: "Advisory for available grants — we help you find and apply for non-dilutive funding.",
    eligibility: "All founders",
    ctaText: "Learn more",
  },
  {
    name: "Tech Partnership",
    type: "Partnership",
    description: "Long-term co-building arrangements for established companies expanding their tech.",
    eligibility: "Established businesses",
    ctaText: "Partner with us",
  },
];

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="relative grain overflow-hidden px-[var(--container-px)] py-[var(--section-y)] text-center">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none">
          We Invest in Ideas<br />Worth Building
        </h1>
        <p className="mt-6 text-lg text-[var(--fg)]/60 max-w-xl mx-auto">
          We don&apos;t just build — we partner. Equity, revenue share, incubation, and advisory.
        </p>
      </section>

      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SCHEMES.map((scheme) => (
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
