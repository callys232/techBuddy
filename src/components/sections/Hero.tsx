"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { IconArrowRight, IconBrandWhatsapp, IconArrowDown } from "@tabler/icons-react";
import { HERO_PAIN_CHIPS } from "@/mock/quote";
import { LiveActivityFeed } from "@/components/ui/LiveActivityFeed";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rectRef    = useRef<DOMRect | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    rectRef.current = el.getBoundingClientRect();
    const ro = new ResizeObserver(() => { rectRef.current = el.getBoundingClientRect(); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spotX  = useMotionValue(50);
  const spotY  = useMotionValue(50);
  const spotBg = useTransform(
    [spotX, spotY],
    (v: number[]) =>
      `radial-gradient(700px circle at ${v[0]}% ${v[1]}%, rgba(56,189,248,0.05) 0%, transparent 65%)`
  );

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = rectRef.current;
    if (!r) return;
    spotX.set(((e.clientX - r.left) / r.width)  * 100);
    spotY.set(((e.clientY - r.top)  / r.height) * 100);
  };

  const toggle = (chip: string) =>
    setSelected((p) => p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden min-h-[94vh] flex items-center px-[var(--container-px)] py-[var(--section-y)]"
    >
      {/* Ambient glow orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-[var(--primary)]/8 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[var(--primary)]/5 blur-[90px]" />

      {/* Cursor glow */}
      <motion.div aria-hidden style={{ background: spotBg }}
        className="pointer-events-none absolute inset-0 z-0" />

      {/* ── Two-panel grid ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full grid lg:grid-cols-[1fr_400px] gap-5 lg:gap-6 items-stretch">

        {/* ══ Left panel ══════════════════════════════════════════════ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lm-card flex flex-col items-center justify-center text-center px-8 py-10 lg:px-10 lg:py-12"
        >
          {/* Eyebrow pill */}
          <motion.div variants={item} className="mb-6">
            <span className="eyebrow-pill">
              <span className="pulse-dot" />
              Built in Africa · Working Worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item}
            className="font-display font-extrabold text-[var(--fg)] leading-[1.06] mb-5
                       text-[clamp(2.4rem,4.8vw,3.8rem)] tracking-[-0.02em]">
            We Build<br />
            <span className="gradient-text">Software Ambitious</span><br />
            Businesses Run On
          </motion.h1>

          {/* Accent divider */}
          <motion.div variants={item} className="w-16 h-px mb-5 gradient-line" />

          {/* Subtitle */}
          <motion.p variants={item}
            className="text-[16px] leading-[1.8] text-[var(--fg)]/55 max-w-lg mx-auto mb-7">
            From fintech platforms to logistics systems — we engineer
            the web apps, mobile products, and AI integrations that
            help growing businesses move faster and scale further,
            wherever their customers are.
          </motion.p>

          {/* Proof strip */}
          <motion.div variants={item}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 pb-7 mb-7 border-b border-[var(--border)]">
            {[
              { v: "8 wks", l: "idea → live MVP"    },
              { v: "35+",   l: "products shipped"    },
              { v: "94%",   l: "client re-engagement" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="font-display text-xl font-extrabold gradient-text">{v}</p>
                <p className="text-[11px] text-[var(--fg)]/40 mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>

          {/* Service tabs */}
          <motion.div variants={item} className="mb-8 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--fg)]/35 mb-3">
              What are you building?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_PAIN_CHIPS.map((chip) => {
                const on = selected.includes(chip);
                return (
                  <motion.button
                    key={chip}
                    type="button"
                    onClick={() => toggle(chip)}
                    whileTap={{ scale: 0.92 }}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150",
                      on
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                        : "border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)]/40 hover:text-[var(--fg)]",
                    ].join(" ")}
                  >
                    {chip}
                    {on && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-1.5 text-[10px] opacity-55"
                      >✓</motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/quote"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--primary)] px-7 py-3.5 font-heading text-[13px] font-bold text-[var(--bg)] btn-glow transition-all active:scale-[0.97]"
            >
              {/* Shimmer sweep */}
              <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12" />
              Get a free quote
              <IconArrowRight size={14} className="relative" />
            </Link>

            <a
              href="#why"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-3.5 font-heading text-[13px] font-semibold text-[var(--fg)]/65 hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-all"
            >
              Why it matters <IconArrowDown size={13} className="animate-bounce" />
            </a>
          </motion.div>

          {/* WhatsApp link */}
          <motion.div variants={item} className="mt-5 flex items-center gap-2">
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi TechAgency! I'd like to discuss a project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-[var(--fg)]/35 hover:text-[#25D366] transition-colors"
            >
              <IconBrandWhatsapp size={14} className="text-[var(--primary)]" />
              Chat on WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* ══ Right panel ═════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0  }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col lm-card overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(56,189,248,0.12)]">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--fg)]/40">
              Tool activity
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Live feed */}
          <div className="flex-1 overflow-hidden">
            <LiveActivityFeed embedded />
          </div>

          {/* Panel footer */}
          <div className="px-6 py-4 border-t border-[rgba(56,189,248,0.12)]">
            <Link
              href="/tools"
              className="flex items-center justify-between text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <span>Try our free planning tools</span>
              <IconArrowRight size={13} />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--fg)]/25">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-[var(--primary)]/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
