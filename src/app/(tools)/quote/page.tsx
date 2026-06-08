import type { Metadata } from "next";
import { QuoteWizard } from "@/components/sections/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description: "Tell us about your project and get a tailored quote in minutes.",
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-[var(--container-px)] py-[var(--section-y)]">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <span className="font-mono text-sm text-[var(--primary)] uppercase tracking-widest">
            Free · No commitment
          </span>
          <h1 className="mt-3 font-display text-5xl font-extrabold text-[var(--fg)]">
            Tell Us About Your Project
          </h1>
          <p className="mt-4 text-[var(--fg)]/60">
            4 quick steps — takes about 2 minutes.
          </p>
        </div>
        <QuoteWizard />
      </div>
    </div>
  );
}
