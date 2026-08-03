"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { TESTIMONIALS } from "@/mock/testimonials";

const N = TESTIMONIALS.length;

const RANKS = [
  { rotate: 0,  y: 0,  scale: 1,    zIndex: 30, opacity: 1    },
  { rotate: -3, y: 14, scale: 0.95, zIndex: 20, opacity: 0.4  },
  { rotate: -6, y: 26, scale: 0.9,  zIndex: 10, opacity: 0.18 },
];

const EXIT = { rotate: 18, x: 340, y: -120, scale: 0.8, opacity: 0, zIndex: 40 };

function StarRow({ n: count }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <IconStarFilled key={i} size={11} className="text-amber-400" />
      ))}
    </div>
  );
}

function Card({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="flex flex-col gap-5 h-full lm-card-solid p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      {/* Large opening quote mark — Lamidone style */}
      <div className="text-[56px] leading-none font-serif text-[var(--primary)]/15 -mb-2 -ml-1 select-none">
        &ldquo;
      </div>

      <div className="flex items-center justify-between">
        <StarRow n={t.rating} />
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--fg)]/25">
          {t.industry}
        </span>
      </div>

      <p className="flex-1 text-[15px] text-[var(--fg)]/72 leading-[1.85] italic">
        {t.quote}
      </p>

      {/* Divider */}
      <div className="gradient-line" />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 font-display font-bold text-sm gradient-text">
          {t.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-[var(--fg)] leading-snug truncate">
            {t.name}
          </p>
          <p className="text-[11px] gradient-text font-semibold truncate">{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive]   = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const activeRef             = useRef(active);
  const exitingRef            = useRef(exiting);
  activeRef.current           = active;
  exitingRef.current          = exiting;

  const advance = () => {
    if (exitingRef.current !== null) return;
    const curr = activeRef.current;
    setExiting(curr);
    setActive((curr + 1) % N);
    setTimeout(() => setExiting(null), 500);
  };

  const goTo = (i: number) => {
    if (exitingRef.current !== null || i === activeRef.current) return;
    setExiting(activeRef.current);
    setActive(i);
    setTimeout(() => setExiting(null), 500);
  };

  useEffect(() => {
    const id = setInterval(advance, 5500);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getAnimate = (i: number) => {
    if (i === exiting) {
      return { ...EXIT, transition: { duration: 0.44, ease: "easeIn" as const } };
    }
    const rank = ((i - active + N) % N);
    const base = RANKS[rank] ?? { rotate: -8, y: 34, scale: 0.90, zIndex: 0, opacity: 0 };
    return { ...base, x: 0, transition: { duration: 0.38, ease: "easeOut" as const } };
  };

  return (
    <section className="relative overflow-hidden py-[var(--section-y)]">
      {/* Ambient orb */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-[var(--primary)]/5 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Left: copy + controls ── */}
          <div>
            <span className="eyebrow-pill mb-5 inline-flex">
              <span className="pulse-dot" />
              Client stories
            </span>

            <h2 className="mt-5 font-display font-extrabold text-[var(--fg)] leading-[1.1] mb-5 tracking-[-0.02em]
                           text-[clamp(1.9rem,3.5vw,3rem)]">
              Problems solved.<br />
              <span className="gradient-text">Products shipped.</span>
            </h2>
            <p className="text-[var(--fg)]/50 leading-relaxed mb-8 max-w-sm text-[14.5px]">
              From Lagos fintechs to agritech NGOs — here&apos;s what our clients say after shipping with us.
            </p>

            {/* Lamidone-style dot nav — active is a pill */}
            <div className="flex items-center gap-2.5 mb-7">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={[
                    "rounded-full transition-all duration-300",
                    i === active
                      ? "w-8 h-2 bg-[var(--primary)] shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                      : "w-2 h-2 bg-[var(--border)] hover:bg-[var(--fg)]/25",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={advance}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--fg)]/55 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              Next review →
            </button>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-[var(--border)]">
              {[
                { stat: "8 wks",  label: "Avg. time to MVP" },
                { stat: "35+",    label: "Live products" },
                { stat: "94%",    label: "Re-engagement rate" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-extrabold gradient-text">{stat}</p>
                  <p className="text-xs text-[var(--fg)]/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/portfolio"
              className="inline-block mt-6 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              See all case studies →
            </Link>
          </div>

          {/* ── Right: stacked card deck ── */}
          <div
            className="relative h-[400px] cursor-pointer select-none"
            onClick={advance}
            title="Click to see next"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                animate={getAnimate(i)}
                className="absolute inset-0 origin-bottom-left"
              >
                <Card t={t} />
              </motion.div>
            ))}
            <p className="absolute -bottom-7 right-0 text-[10px] text-[var(--fg)]/25 font-mono tracking-wide select-none pointer-events-none">
              tap card to flip →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
