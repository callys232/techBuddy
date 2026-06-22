"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { IconBrandWhatsapp, IconSparkles } from "@tabler/icons-react";
import { HERO_PAIN_CHIPS } from "@/mock/quote";

const StickmanBg = dynamic(
  () => import("@/components/bg").then((m) => ({ default: m.StickmanBg })),
  { ssr: false }
);

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

const PROOF_STATS = [
  { value: "8 weeks",  label: "from idea to live MVP" },
  { value: "35+",      label: "products solving real African problems" },
  { value: "3G-ready", label: "every product built for low bandwidth" },
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
      <StickmanBg />

      <div className="max-w-4xl relative z-10">
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
          className="font-body text-[17px] leading-relaxed text-[var(--fg)]/60 max-w-2xl mb-8"
        >
          Slow systems, broken user flows, products that can't scale — we solve the technical
          problems holding African businesses back, and ship software that works at scale.
        </motion.p>

        {/* Inline proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap gap-x-8 gap-y-3 mb-10 pb-10 border-b border-[var(--border)]"
        >
          {PROOF_STATS.map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-[var(--fg)]">{value}</span>
              <span className="text-xs text-[var(--fg)]/40">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Pain chip selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10"
        >
          <p className="text-xs text-[var(--fg)]/40 mb-3 uppercase tracking-widest font-mono">
            What are you building?
          </p>
          <div className="flex flex-wrap gap-2">
            {HERO_PAIN_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => toggle(chip)}
                className={[
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95",
                  selected.includes(chip)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_0_12px_rgba(56,189,248,0.2)]"
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
          transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href={`/quote${quoteParams}`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95"
          >
            <IconSparkles size={15} className="opacity-80" />
            Get a Free Quote
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi TechAgency! I'd like to discuss a project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] px-8 font-semibold text-[var(--fg)] hover:border-[#25D366] hover:text-[#25D366] transition-all active:scale-95"
          >
            <IconBrandWhatsapp size={17} />
            Chat on WhatsApp
          </a>
        </motion.div>

        {/* Social reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 text-xs text-[var(--fg)]/30"
        >
          Free consultation · No commitment · Reply within 24 hours
        </motion.p>
      </div>
    </section>
  );
}
