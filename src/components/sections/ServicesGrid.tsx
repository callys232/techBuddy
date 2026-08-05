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
import { PageVectors } from "@/components/bg/PageVectors";

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

/* ── Suite tints — one per service, cycling through the 8-hue suite palette.
   Applied only to the icon glyph, tag badge and hover-tint chip — the card
   surface itself stays flat (--surface), never a colored background fill. ── */
const SUITE_TINTS = [
  "var(--suite-1)", "var(--suite-2)", "var(--suite-3)", "var(--suite-4)",
  "var(--suite-5)", "var(--suite-6)", "var(--suite-7)", "var(--suite-8)",
];

/* ── Stack positions ────────────────────────────────────────────────────────── */

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
        opacity: deckHovered ? 0.5 : 0.35,
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

  const tint = (i: number) => SUITE_TINTS[i % SUITE_TINTS.length];
  const svc = ALL_SERVICES[active];

  return (
    <section className="relative overflow-hidden py-[var(--section-y)]">
      <PageVectors variant="technical" intensity={0.2} />
      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid lg:grid-cols-[1fr,480px] gap-12 lg:gap-20 items-center">

          {/* ── Left panel ──────────────────────────────────────────────── */}
          <div>
            <span className="eyebrow mb-5 inline-flex">What we do</span>
            <h2 className="h-section mb-5">
              Fourteen services. One team.
            </h2>
            <p className="muted leading-relaxed mb-10 max-w-sm text-[14.5px]">
              Built around what African businesses actually need to scale.
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
                <p className="font-display font-semibold text-xl leading-snug mb-1" style={{ color: tint(active) }}>
                  {svc.title}
                </p>
                <p className="text-sm muted italic leading-relaxed mb-4">
                  {svc.outcome}
                </p>
                <Link
                  href={svc.href}
                  className="group/link inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color: tint(active) }}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                >
                  {dir === "prev" ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
                </motion.button>
              ))}
              <span className="font-mono text-xs faint ml-1">
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
                    i === active ? "w-5 h-[6px]" : "w-[6px] h-[6px] bg-[var(--border)]",
                  ].join(" ")}
                  style={i === active ? { background: "var(--brand)" } : undefined}
                />
              ))}
            </div>

            <Link href="/services" className="link-underline inline-block mt-8 text-sm font-semibold">
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
              const Ico = ICON_MAP[s.icon];
              const top = isTopCard(i);
              const c = tint(i);

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
                  className="absolute inset-0 origin-bottom card"
                  style={{ borderColor: top ? c : "var(--border)" }}
                >
                  <div className="flex flex-col h-full p-7">

                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon floats on the active card */}
                      <motion.span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: `color-mix(in srgb, ${c} 12%, var(--surface))`, color: c }}
                        animate={top ? { y: [0, -4, 0] } : { y: 0 }}
                        transition={top
                          ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0 }
                        }
                      >
                        <Ico size={22} />
                      </motion.span>

                      <motion.span
                        className="font-mono text-[10px] font-semibold rounded-full px-3 py-1 uppercase tracking-wide"
                        style={{ background: `color-mix(in srgb, ${c} 14%, var(--surface))`, color: c }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.12 }}
                      >
                        {s.tag}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl font-semibold leading-snug mb-3 text-[var(--ink)]">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-4 flex-1 muted">
                      {s.desc}
                    </p>

                    {/* Outcome */}
                    <p className="text-xs italic leading-relaxed border-l-2 pl-3 mb-5" style={{ borderColor: c, color: "var(--ink-muted)" }}>
                      {s.outcome}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <Link
                        href={s.href}
                        onClick={(e) => e.stopPropagation()}
                        className="group/more flex items-center gap-1 text-xs font-semibold"
                        style={{ color: c }}
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
                        className="btn-primary h-8 px-3 text-[11px]"
                      >
                        <IconSparkles size={11} />
                        Get a quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <p className="absolute -bottom-7 right-0 text-[10px] faint font-mono tracking-wide select-none pointer-events-none">
              tap to flip →
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
