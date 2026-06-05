"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PAIN_CHIPS = [
  "Slow website",
  "No mobile app",
  "Security gaps",
  "Need to scale",
  "Starting from scratch",
  "All of the above",
];

export function Hero() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (chip: string) =>
    setSelected((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );

  const quoteParams = selected.length
    ? `?pain=${encodeURIComponent(selected.join(","))}`
    : "";

  return (
    <section className="relative grain overflow-hidden min-h-[92vh] flex items-center px-[var(--container-px)] py-[var(--section-y)]">
      {/* Mesh gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,229,192,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(245,166,35,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-4xl">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--fg)]/70 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          Built for the African market
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-[1.05] mb-6"
        >
          We Build What Africa<br />Does Business With
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-[var(--fg)]/60 max-w-2xl mb-10"
        >
          Web apps, mobile, DevOps, security — end-to-end digital products for serious businesses.
        </motion.p>

        {/* Pain-point selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <p className="text-xs text-[var(--fg)]/40 mb-3 uppercase tracking-widest font-mono">
            What&apos;s your challenge?
          </p>
          <div className="flex flex-wrap gap-2">
            {PAIN_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => toggle(chip)}
                className={[
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95",
                  selected.includes(chip)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_0_12px_rgba(0,229,192,0.2)]"
                    : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50 hover:text-[var(--fg)]",
                ].join(" ")}
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href={`/quote${quoteParams}`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all active:scale-95"
          >
            See Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
