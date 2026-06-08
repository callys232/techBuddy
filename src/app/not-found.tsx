import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-[var(--container-px)] text-center">
      <p className="font-mono text-[var(--primary)] text-xs uppercase tracking-[0.3em] mb-6">
        404 — Page Not Found
      </p>

      <div className="relative mb-8 select-none" aria-hidden>
        <span className="font-display text-[12rem] font-extrabold leading-none text-[var(--fg)]/[0.04] select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* stickman */}
            <circle cx="60" cy="28" r="12" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
            <line x1="60" y1="40" x2="60" y2="78" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* arms up (surprised) */}
            <line x1="60" y1="52" x2="34" y2="40" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="52" x2="86" y2="40" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* legs */}
            <line x1="60" y1="78" x2="42" y2="100" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="78" x2="78" y2="100" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            {/* question mark above head */}
            <text x="60" y="18" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="bold" fontFamily="monospace">?</text>
          </svg>
        </div>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[var(--fg)] mb-4">
        Lost in the Build
      </h1>
      <p className="text-[var(--fg)]/50 max-w-sm mb-10 leading-relaxed">
        Our stickman jumped past this one. The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
        >
          Contact Us
        </Link>
      </div>

      <div className="mt-16 flex flex-wrap gap-6 justify-center text-sm text-[var(--fg)]/30">
        {["/services", "/portfolio", "/blog", "/quote"].map((href) => (
          <Link key={href} href={href} className="hover:text-[var(--primary)] transition-colors">
            {href}
          </Link>
        ))}
      </div>
    </div>
  );
}
