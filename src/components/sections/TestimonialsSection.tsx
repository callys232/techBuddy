"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconStarFilled, IconQuote, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { TESTIMONIALS } from "@/mock/testimonials";
import { PageVectors } from "@/components/bg/PageVectors";

const N = TESTIMONIALS.length;

/* Position config per rank (0 = top, 1 = second, 2 = third) */
const RANKS = [
  { rotate: 0,  y: 0,  scale: 1,    zIndex: 30, opacity: 1   },
  { rotate: -3, y: 14, scale: 0.97, zIndex: 20, opacity: 1   },
  { rotate: -6, y: 26, scale: 0.94, zIndex: 10, opacity: 0.9 },
];

/* Card flies off to the top-right when dismissed */
const EXIT = { rotate: 18, x: 340, y: -120, scale: 0.8, opacity: 0, zIndex: 40 };

function StarRow({ n: count }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <IconStarFilled key={i} size={12} className="text-amber-400" />
      ))}
    </div>
  );
}

function Card({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="flex flex-col gap-5 h-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between">
        <StarRow n={t.rating} />
        <IconQuote size={26} className="text-[var(--primary)]/15 shrink-0" />
      </div>

      <p className="flex-1 text-[14.5px] text-[var(--fg)]/72 leading-[1.85]">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 font-display font-bold text-sm text-[var(--primary)]">
          {t.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-[var(--fg)] leading-snug truncate">
            {t.name}
          </p>
          <p className="text-[11px] text-[var(--fg)]/40 truncate">{t.role} · {t.company}</p>
        </div>
        <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--fg)]/25">
          {t.industry}
        </span>
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

  /* Auto-advance every 5 s */
  useEffect(() => {
    const id = setInterval(advance, 5000);
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
      <PageVectors variant="bottom-left" intensity={0.32} />
      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: copy + controls ──────────────────────────────────────── */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
              Client stories
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.1] mb-5">
              Problems solved.<br />Products shipped.
            </h2>
            <p className="text-[var(--fg)]/50 leading-relaxed mb-8 max-w-sm">
              From Lagos fintechs to agritech NGOs — here&apos;s what our clients say after shipping with us.
            </p>

            {/* Dot pagination */}
            <div className="flex items-center gap-2.5 mb-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={[
                    "rounded-full transition-all duration-300",
                    i === active
                      ? "w-6 h-[7px] bg-[var(--primary)]"
                      : "w-[7px] h-[7px] bg-[var(--border)] hover:bg-[var(--fg)]/25",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={advance}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--fg)]/55 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              Next <IconChevronRight size={14} />
            </button>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-[var(--border)]">
              {[
                { stat: "8 wks",  label: "Avg. time to MVP" },
                { stat: "35+",    label: "Live products" },
                { stat: "94%",    label: "Re-engagement rate" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-extrabold text-[var(--fg)]">{stat}</p>
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

          {/* ── Right: stacked card deck ───────────────────────────────────── */}
          <div
            className="relative h-[380px] cursor-pointer select-none"
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

            {/* Tap hint — fades after first interaction */}
            <p className="absolute -bottom-7 right-0 text-[10px] text-[var(--fg)]/25 font-mono tracking-wide select-none pointer-events-none">
              tap card to flip →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
