import Link from "next/link";

export function CTAStrip() {
  return (
    <section className="relative grain overflow-hidden bg-[var(--bg)] py-[var(--section-y)] text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,229,192,0.05) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-3xl px-[var(--container-px)]">
        <h2 className="font-display text-5xl font-extrabold text-[var(--fg)] leading-tight mb-6">
          Ready to Build<br />Something Serious?
        </h2>
        <p className="text-[var(--fg)]/50 mb-10 text-lg">
          Tell us about your project — free quote, no commitment, reply within 24 hours.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/quote"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-[var(--primary)] px-10 text-lg font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-[var(--border)] px-10 text-lg font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </section>
  );
}
