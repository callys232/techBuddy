import Link from "next/link";
import { IconBrandWhatsapp, IconArrowRight, IconClock } from "@tabler/icons-react";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export function CTAStrip() {
  return (
    <section className="relative overflow-hidden py-[var(--section-y)] text-center">
      {/* Ambient glow — centred orb */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_55%_65%_at_50%_50%,rgba(56,189,248,0.08)_0%,transparent_68%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)]">

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold text-[var(--ink)]/55 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now booking new projects
        </div>

        <h2 className="font-heading font-extrabold text-[var(--ink)] leading-tight mb-4 tracking-[-0.02em]
                       text-[clamp(2rem,5vw,3.5rem)]">
          Ready to Build<br />
          <span className="text-[var(--brand)]">Something Serious?</span>
        </h2>

        <p className="text-[var(--ink)]/50 mb-10 text-[15px] leading-relaxed max-w-xl mx-auto">
          Tell us what you&apos;re building — we&apos;ll reply with an honest scope and Naira range within 24 hours. No sales pitch, no commitment.
        </p>

        {/* Two CTAs */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <Link href="/quote" className="btn-primary px-9 py-4 text-[14px]">
            Get a Free Quote
            <IconArrowRight size={15} />
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to discuss a project with TechAgency.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-9 py-4 text-[14px] font-semibold text-[var(--ink)]/65 hover:border-[#25D366]/60 hover:text-[#25D366] transition-all active:scale-[0.97]"
          >
            <IconBrandWhatsapp size={16} />
            WhatsApp us directly
          </a>
        </div>

        {/* Reassurance strip */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-[var(--ink)]/35">
          <span className="flex items-center gap-1.5">
            <IconClock size={11} />
            Reply within 24 hours
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink)]/20" />
          <span>Free consultation · No obligation</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink)]/20" />
          <span>NDPR compliant</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink)]/20" />
          <Link href="/pricing" className="hover:text-[var(--brand)] transition-colors">
            View pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
