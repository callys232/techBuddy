"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  IconCode,
  IconDeviceMobile,
  IconServer,
  IconShield,
  IconCloud,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconArrowUpRight,
  IconSparkles,
} from "@tabler/icons-react";
import { ALL_SERVICES } from "@/mock/services";

/* ── Icons ─────────────────────────────────────────────────────────────────── */

const ICON_MAP = {
  code:            IconCode,
  "device-mobile": IconDeviceMobile,
  server:          IconServer,
  shield:          IconShield,
  cloud:           IconCloud,
  "credit-card":   IconCreditCard,
  search:          IconSearch,
  settings:        IconSettings,
} as const;

/* ── Colour palette — one per card, cycles across 14 services ─────────────── */

const PALETTE = [
  { card: "bg-sky-950 border-sky-700/40",     icon: "bg-sky-900/60 text-sky-400",         badge: "bg-sky-900/70 text-sky-300",         title: "text-sky-50",     desc: "text-sky-200/65",     accent: "text-sky-400",     glow: "hover:shadow-[0_24px_64px_rgba(56,189,248,0.25)]"   },
  { card: "bg-amber-950 border-amber-700/40", icon: "bg-amber-900/60 text-amber-400",     badge: "bg-amber-900/70 text-amber-300",     title: "text-amber-50",   desc: "text-amber-200/65",   accent: "text-amber-400",   glow: "hover:shadow-[0_24px_64px_rgba(245,166,35,0.25)]"   },
  { card: "bg-rose-950 border-rose-700/40",   icon: "bg-rose-900/60 text-rose-400",       badge: "bg-rose-900/70 text-rose-300",       title: "text-rose-50",    desc: "text-rose-200/65",    accent: "text-rose-400",    glow: "hover:shadow-[0_24px_64px_rgba(251,113,133,0.25)]"  },
  { card: "bg-emerald-950 border-emerald-700/40", icon: "bg-emerald-900/60 text-emerald-400", badge: "bg-emerald-900/70 text-emerald-300", title: "text-emerald-50", desc: "text-emerald-200/65", accent: "text-emerald-400", glow: "hover:shadow-[0_24px_64px_rgba(52,211,153,0.25)]"  },
  { card: "bg-violet-950 border-violet-700/40",   icon: "bg-violet-900/60 text-violet-400",   badge: "bg-violet-900/70 text-violet-300",   title: "text-violet-50",  desc: "text-violet-200/65",  accent: "text-violet-400",  glow: "hover:shadow-[0_24px_64px_rgba(167,139,250,0.25)]" },
  { card: "bg-orange-950 border-orange-700/40",   icon: "bg-orange-900/60 text-orange-400",   badge: "bg-orange-900/70 text-orange-300",   title: "text-orange-50",  desc: "text-orange-200/65",  accent: "text-orange-400",  glow: "hover:shadow-[0_24px_64px_rgba(251,146,60,0.25)]"  },
  { card: "bg-teal-950 border-teal-700/40",       icon: "bg-teal-900/60 text-teal-400",       badge: "bg-teal-900/70 text-teal-300",       title: "text-teal-50",    desc: "text-teal-200/65",    accent: "text-teal-400",    glow: "hover:shadow-[0_24px_64px_rgba(45,212,191,0.25)]"   },
] as const;

/* ── Stack positions ────────────────────────────────────────────────────────── */

const STACK_POS = [
  { rotate: 0,  y: 0,  scale: 1,    zIndex: 20, opacity: 1    }, // top
  { rotate: -8, y: 28, scale: 0.88, zIndex: 10, opacity: 0.18 }, // shadow hint
];

const EXIT_LEFT  = { rotate: -18, x: -340, y: -80, scale: 0.82, opacity: 0, zIndex: 30 };
const EXIT_RIGHT = { rotate:  18, x:  340, y: -80, scale: 0.82, opacity: 0, zIndex: 30 };

const N = ALL_SERVICES.length;

/* ── Component ─────────────────────────────────────────────────────────────── */

export function ServicesGrid() {
  const [active,      setActive]      = useState(0);
  const [exiting,     setExiting]     = useState<number | null>(null);
  const [exitDir,     setExitDir]     = useState<"left" | "right">("right");
  const [deckHovered, setDeckHovered] = useState(false);
  const activeRef  = useRef(active);
  const exitingRef = useRef(exiting);
  activeRef.current  = active;
  exitingRef.current = exiting;

  const go = (dir: "prev" | "next") => {
    if (exitingRef.current !== null) return;
    setExitDir(dir === "next" ? "right" : "left");
    setExiting(activeRef.current);
    setActive((prev) => dir === "next" ? (prev + 1) % N : (prev - 1 + N) % N);
    setTimeout(() => setExiting(null), 460);
  };

  const goTo = (i: number) => {
    if (exitingRef.current !== null || i === activeRef.current) return;
    setExitDir(i > activeRef.current ? "right" : "left");
    setExiting(activeRef.current);
    setActive(i);
    setTimeout(() => setExiting(null), 460);
  };

  const getRank   = (i: number) => ((i - active + N) % N);
  const isTopCard = (i: number) => getRank(i) === 0 && i !== exiting;

  /* Only cards that are visible (rank 0/1) or currently exiting need motion */
  const isVisible = (i: number) => {
    if (i === exiting) return true;
    const r = getRank(i);
    return r === 0 || r === 1;
  };

  const getAnimate = (i: number) => {
    /* Exiting card flies off — fast decisive tween */
    if (i === exiting) {
      const ex = exitDir === "right" ? EXIT_RIGHT : EXIT_LEFT;
      return { ...ex, transition: { duration: 0.38, ease: "easeIn" as const } };
    }
    const rank = getRank(i);
    /* Behind card peeks slightly on deck hover */
    if (rank === 1) {
      return {
        rotate: -8, y: 28, x: 0, scale: 0.88, zIndex: 10,
        opacity: deckHovered ? 0.28 : 0.18,
        transition: { type: "spring" as const, stiffness: 260, damping: 28 },
      };
    }
    /* Top card — spring into position */
    if (rank === 0) {
      return {
        rotate: 0, y: 0, x: 0, scale: 1, zIndex: 20, opacity: 1,
        transition: { type: "spring" as const, stiffness: 260, damping: 28 },
      };
    }
    /* Any other rank — instantly hidden, no animation needed */
    return { rotate: -10, y: 40, x: 0, scale: 0.84, zIndex: 0, opacity: 0 };
  };

  const palette = (i: number) => PALETTE[i % PALETTE.length];
  const svc = ALL_SERVICES[active];

  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-[1fr,480px] gap-12 lg:gap-20 items-center">

          {/* ── Left panel ──────────────────────────────────────────────── */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
              What we do
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[var(--fg)] leading-[1.1] mb-5">
              Services
            </h2>
            <p className="text-[var(--fg)]/50 leading-relaxed mb-10 max-w-sm">
              Fourteen services. One team. Built around what African businesses actually need to scale.
            </p>

            {/* Active service info — animates in on change, color matches active card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mb-8"
              >
                <p className={`font-display font-extrabold text-xl leading-snug mb-1 ${palette(active).accent}`}>
                  {svc.title}
                </p>
                <p className="text-sm text-[var(--fg)]/50 italic leading-relaxed mb-4">
                  {svc.outcome}
                </p>
                <Link
                  href={svc.href}
                  className={`group/link inline-flex items-center gap-1.5 text-sm font-semibold hover:underline ${palette(active).accent}`}
                >
                  Explore {svc.title}
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 2, y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <IconArrowUpRight size={13} />
                  </motion.span>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-3 mb-6">
              {(["prev", "next"] as const).map((dir) => (
                <motion.button
                  key={dir}
                  type="button"
                  onClick={() => go(dir)}
                  aria-label={dir === "prev" ? "Previous service" : "Next service"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {dir === "prev" ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
                </motion.button>
              ))}
              <span className="font-mono text-xs text-[var(--fg)]/30 ml-1">
                {active + 1} / {N}
              </span>
            </div>

            {/* Dot pagination */}
            <div className="flex flex-wrap gap-1.5">
              {ALL_SERVICES.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to service ${i + 1}`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ duration: 0.12 }}
                  className={[
                    "rounded-full transition-all duration-300 origin-center",
                    i === active
                      ? "w-5 h-[6px] bg-[var(--primary)]"
                      : "w-[6px] h-[6px] bg-[var(--border)]",
                  ].join(" ")}
                />
              ))}
            </div>

            <Link
              href="/services"
              className="inline-block mt-8 text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              View all services →
            </Link>
          </div>

          {/* ── Right: 2-card stack ──────────────────────────────────────── */}
          <div
            className="relative h-[420px] cursor-pointer select-none"
            onClick={() => go("next")}
            onMouseEnter={() => setDeckHovered(true)}
            onMouseLeave={() => setDeckHovered(false)}
          >
            {ALL_SERVICES.map((s, i) => {
              const p   = palette(i);
              const Ico = ICON_MAP[s.icon];
              const top = isTopCard(i);

              /* Skip full motion treatment for cards that are never visible */
              if (!isVisible(i)) return null;

              return (
                <motion.div
                  key={i}
                  initial={false}             /* no mount-flash — start at current computed position */
                  animate={getAnimate(i)}
                  /* Lift only on hover — no rotation (avoids origin-corner swing) */
                  whileHover={top ? { y: -10, scale: 1.02, transition: { duration: 0.18 } } : undefined}
                  whileTap={top ? { scale: 0.96, transition: { type: "spring", stiffness: 500, damping: 22 } } : undefined}
                  className={[
                    "absolute inset-0 origin-bottom",   /* pivot from center-bottom for natural card feel */
                    "rounded-[var(--radius-card)] border",
                    "shadow-[0_12px_48px_rgba(0,0,0,0.4)]",
                    top ? p.glow : "",
                    p.card,
                  ].join(" ")}
                >
                  <div className="flex flex-col h-full p-7">

                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon floats on the active card */}
                      <motion.span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.icon}`}
                        animate={top ? { y: [0, -4, 0] } : { y: 0 }}
                        transition={top
                          ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0 }
                        }
                      >
                        <Ico size={22} />
                      </motion.span>

                      <motion.span
                        className={`font-mono text-[10px] font-semibold rounded-full px-3 py-1 uppercase tracking-wide ${p.badge}`}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.12 }}
                      >
                        {s.tag}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-display text-2xl font-extrabold leading-snug mb-3 ${p.title}`}>
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed mb-4 flex-1 ${p.desc}`}>
                      {s.desc}
                    </p>

                    {/* Outcome */}
                    <p className={`text-xs italic leading-relaxed border-l-2 pl-3 mb-5 border-current/30 ${p.accent}`}>
                      {s.outcome}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Link
                        href={s.href}
                        onClick={(e) => e.stopPropagation()}
                        className={`group/more flex items-center gap-1 text-xs font-semibold ${p.accent}`}
                      >
                        Learn more
                        <motion.span
                          className="inline-block"
                          initial={{ x: 0, y: 0 }}
                          whileHover={{ x: 2, y: -2 }}
                          transition={{ duration: 0.14 }}
                        >
                          <IconArrowUpRight size={12} />
                        </motion.span>
                      </Link>

                      <Link
                        href={`/quote?service=${encodeURIComponent(s.title)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition-all"
                      >
                        <IconSparkles size={11} className="opacity-70" />
                        Get a quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <p className="absolute -bottom-7 right-0 text-[10px] text-[var(--fg)]/25 font-mono tracking-wide select-none pointer-events-none">
              tap to flip →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
