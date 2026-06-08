import Link from "next/link";

export function InvestTeaser() {
  return (
    <section className="relative grain overflow-hidden bg-[var(--surface)] py-[var(--section-y)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 90% 50%, rgba(245,166,35,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="max-w-2xl">
          <span className="font-mono text-xs text-[var(--color-accent-amber)] uppercase tracking-widest">
            We partner, not just build
          </span>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-[var(--fg)] leading-tight">
            We Don&apos;t Just Build —<br />We Invest in Ideas Worth Building
          </h2>
          <p className="mt-5 text-[var(--fg)]/60 leading-relaxed">
            Equity builds, revenue share arrangements, incubation support, and long-term tech partnerships for serious founders across Africa.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/invest"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent-amber)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-amber)] transition-all active:scale-95"
            >
              Explore schemes
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[var(--color-accent-amber)] hover:text-[var(--color-accent-amber)] transition-all active:scale-95"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
