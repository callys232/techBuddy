import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote Submitted",
  description: "We received your quote request and will be in touch soon.",
};

export default function QuoteConfirmPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-[var(--container-px)] py-[var(--section-y)] text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15 mb-6">
        <span className="text-3xl">✓</span>
      </div>
      <h1 className="font-display text-4xl font-extrabold text-[var(--fg)] mb-4">
        Quote Submitted!
      </h1>
      <p className="text-[var(--fg)]/60 max-w-md mb-10">
        We&apos;ve received your request. Expect a response within 24 hours. Book a discovery call below to fast-track things.
      </p>

      {/* Cal.com embed placeholder */}
      <div className="w-full max-w-xl rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="font-display text-xl font-bold text-[var(--fg)] mb-2">
          Book a Discovery Call
        </p>
        <p className="text-sm text-[var(--fg)]/50 mb-6">
          30 minutes with our team to discuss your project.
        </p>
        {/* Cal.com embed goes here */}
        <div className="h-40 flex items-center justify-center border border-dashed border-[var(--border)] rounded-lg text-[var(--fg)]/30 text-sm">
          Cal.com calendar embed
        </div>
      </div>

      <a
        href="/"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-7 text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
      >
        Back to home
      </a>
    </div>
  );
}
