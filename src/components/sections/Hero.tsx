"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight, IconBrandWhatsapp, IconArrowDown } from "@tabler/icons-react";
import { HERO_PAIN_CHIPS } from "@/mock/quote";
import { HeroHub } from "@/components/ui/HeroHub";
import { RotatingWord } from "@/components/ui/RotatingWord";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

const BUILD_WORDS = ["web app", "mobile app", "AI tool", "fintech platform", "dashboard", "MVP"];

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (chip: string) =>
    setSelected((p) => p.includes(chip) ? p.filter((c) => c !== chip) : [...p, chip]);

  return (
    <section className="shell min-h-[92vh] flex items-center py-[var(--section-y)]">
      {/* ── Two-panel layout — flex so the hub's animated collapse/expand
         width actually reflows the left panel, unlike a fixed grid track ── */}
      <div className="w-full flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">

        {/* ══ Left panel ══════════════════════════════════════════════ */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="card flex-1 min-w-0 flex flex-col items-center justify-center text-center px-8 py-10 lg:px-10 lg:py-12"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="mb-6">
            <span className="eyebrow">Built in Africa · Working Worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} className="h-hero mb-5">
            You have the <span className="text-[var(--brand)]">vision</span>.<br />
            We have the <span className="text-[var(--brand)]">team</span>.<br />
            Let&apos;s build your <RotatingWord words={BUILD_WORDS} />.
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={item} className="lead max-w-lg mx-auto mb-7">
            From fintech platforms to logistics systems — we engineer
            the web apps, mobile products, and AI integrations that
            help growing businesses move faster and scale further,
            wherever their customers are.
          </motion.p>

          {/* Proof strip */}
          <motion.div variants={item}
            className="flex flex-wrap justify-center gap-x-10 gap-y-4 pb-7 mb-7 border-b border-[var(--border)]">
            {[
              { v: "8 wks", l: "idea → live MVP"    },
              { v: "35+",   l: "products shipped"    },
              { v: "94%",   l: "client re-engagement" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <span className="block font-display font-semibold text-2xl text-[var(--brand)]">{v}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </motion.div>

          {/* Service chips */}
          <motion.div variants={item} className="mb-8 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] muted mb-3">
              What are you building?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_PAIN_CHIPS.map((chip) => {
                const on = selected.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggle(chip)}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
                      on
                        ? "border-[var(--brand)] bg-[var(--brand)]/8 text-[var(--brand)]"
                        : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/40 hover:text-[var(--ink)]",
                    ].join(" ")}
                  >
                    {chip}
                    {on && <span className="ml-1.5 text-[10px] opacity-70">✓</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/quote" className="btn-primary px-7 py-3.5 text-[13px]">
              Get a free quote
              <IconArrowRight size={14} />
            </Link>
            <a href="#why" className="btn-secondary px-7 py-3.5 text-[13px]">
              Why it matters <IconArrowDown size={13} />
            </a>
          </motion.div>

          {/* WhatsApp link */}
          <motion.div variants={item} className="mt-5 flex items-center gap-2">
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi TechAgency! I'd like to discuss a project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] faint hover:text-[var(--brand)] transition-colors"
            >
              <IconBrandWhatsapp size={14} />
              Chat on WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* ══ Right panel — collapsible hub (articles/investments/predictions/tools) ══ */}
        <HeroHub />

      </div>
    </section>
  );
}
