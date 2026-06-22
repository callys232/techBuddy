import Link from "next/link";
import { IconBrandWhatsapp, IconSparkles, IconClock } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export function CTAStrip() {
  return (
    <section className="relative grain overflow-hidden bg-[var(--bg)] py-[var(--section-y)] text-center">
      <PageVectors variant="center" intensity={0.3} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(0,229,192,0.05)_0%,transparent_70%)]"
      />
      <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)]">
        {/* Capacity signal */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--fg)]/60 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Taking 2 new client projects for Q3 2026 · Slots filling fast
        </div>

        <h2 className="font-display text-5xl font-extrabold text-[var(--fg)] leading-tight mb-4">
          Ready to Build<br />Something Serious?
        </h2>
        <p className="text-[var(--fg)]/50 mb-10 text-lg">
          Tell us what you&apos;re building — we&apos;ll reply with an honest scope and Naira range within 24 hours. No sales pitch, no commitment.
        </p>

        {/* Two paths */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link
            href="/quote"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-[var(--primary)] px-10 text-base font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
          >
            <IconSparkles size={16} className="opacity-80" />
            Get a Free Quote
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to discuss a project with TechAgency.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-[var(--border)] px-10 text-base font-semibold text-[var(--fg)] hover:border-[#25D366] hover:text-[#25D366] transition-all active:scale-95"
          >
            <IconBrandWhatsapp size={18} />
            WhatsApp us directly
          </a>
        </div>

        {/* Reassurance row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--fg)]/35">
          <span className="flex items-center gap-1.5">
            <IconClock size={12} />
            Reply within 24 hours
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--fg)]/20" />
          <span>Free consultation · No obligation</span>
          <span className="w-1 h-1 rounded-full bg-[var(--fg)]/20" />
          <span>NDPR compliant</span>
          <span className="w-1 h-1 rounded-full bg-[var(--fg)]/20" />
          <Link href="/pricing" className="hover:text-[var(--primary)] transition-colors">
            View pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
