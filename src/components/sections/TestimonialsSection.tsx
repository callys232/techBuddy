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
    <div className="flex flex-col gap-5 h-full card p-8">
      {/* Large opening quote mark */}
      <div className="text-[56px] leading-none font-serif text-[var(--brand)]/15 -mb-2 -ml-1 select-none">
        &ldquo;
      </div>

      <div className="flex items-center justify-between">
        {t.illustrative ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--warn)]">Illustrative</span>
        ) : (
          <StarRow n={t.rating} />
        )}
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
          {t.industry}
        </span>
      </div>

      <p className="flex-1 text-[15px] text-[var(--ink)]/80 leading-[1.85] italic">
        {t.quote}
      </p>

      {/* Divider */}
      <div className="h-px bg-[var(--border)]" />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/12 font-heading font-bold text-sm text-[var(--brand)]">
          {t.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-[var(--ink)] leading-snug truncate">
            {t.name}
          </p>
          <p className="text-[11px] text-[var(--brand)] font-semibold truncate">{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  if (N === 0) return null;

  return <TestimonialsCarousel />;
}

function TestimonialsCarousel() {
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
      <div className="relative z-10 mx-auto max-w-6xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Left: copy + controls ── */}
          <div>
            <span className="eyebrow mb-5 inline-flex">Illustrative feedback</span>

            <h2 className="mt-5 font-heading font-extrabold text-[var(--ink)] leading-[1.1] mb-5 tracking-[-0.02em]
                           text-[clamp(1.9rem,3.5vw,3rem)]">
              Problems solved.<br />
              <span className="text-[var(--brand)]">Products shipped.</span>
            </h2>
            <p className="text-[var(--ink-muted)] leading-relaxed mb-3 max-w-sm text-[14.5px]">
              We&apos;re early — these aren&apos;t quotes from real clients yet. They&apos;re illustrative of the kind of feedback we&apos;re built to earn, based on how we work.
            </p>
            <p className="text-[var(--ink-faint)] leading-relaxed mb-8 max-w-sm text-[13px]">
              Once we ship real client work, this section becomes real client quotes — nothing else.
            </p>

            {/* Dot nav — active is a pill */}
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
                      ? "w-8 h-2 bg-[var(--brand)]"
                      : "w-2 h-2 bg-[var(--border)] hover:bg-[var(--ink)]/25",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={advance}
              className="btn-ghost h-10 px-5 text-sm"
            >
              Next →
            </button>

            <Link
              href="/portfolio"
              className="inline-block mt-10 pt-8 border-t border-[var(--border)] text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              See our concept work →
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
            <p className="absolute -bottom-7 right-0 text-[10px] text-[var(--ink)]/25 font-mono tracking-wide select-none pointer-events-none">
              tap card to flip →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
