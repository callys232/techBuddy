import Link from "next/link";

export function InvestTeaser() {
  return (
    <section className="relative overflow-hidden py-[var(--section-y)]">
      {/* Inverted-section pattern (Lamidone EcosystemHubs trick) */}
      <div className="absolute inset-0 bg-[var(--ink)] dark:bg-[var(--ink)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #38BDF8 0%, transparent 60%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--page)]/20 bg-[var(--page)]/10 text-[10px] font-bold tracking-[0.38em] uppercase text-[var(--page)]/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            We partner, not just build
          </span>

          <h2 className="mt-2 font-display font-extrabold text-[var(--page)] leading-tight tracking-[-0.02em] mb-5
                         text-[clamp(1.9rem,3.5vw,3rem)]">
            We Don&apos;t Just Build —<br />
            <span style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We Invest in Ideas
            </span>{" "}Worth Building
          </h2>

          <p className="text-[var(--page)]/65 leading-relaxed text-[14.5px] mb-8 max-w-lg">
            Equity builds, revenue share arrangements, incubation support, and long-term tech partnerships for serious founders across Africa.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/invest"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-heading text-[13px] font-bold text-[#1a1200] hover:opacity-90 transition-all active:scale-[0.97]"
            >
              Explore schemes
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--page)]/25 px-7 py-3.5 font-heading text-[13px] font-semibold text-[var(--page)]/75 hover:border-amber-400/60 hover:text-amber-400 transition-all active:scale-[0.97]"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
