"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconWorld,
  IconShieldCheck,
  IconMapPin,
  IconCreditCard,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

const REASONS = [
  {
    Icon: IconWorld,
    title: "68% of your customers search before they buy",
    body: "Without a website, they find your competitor instead.",
    stat: "68%",
    statLabel: "research online before purchasing",
  },
  {
    Icon: IconShieldCheck,
    title: "A website decides trust in 5 seconds",
    body: "Customers judge whether you're real — or a hustle — before they read a single word.",
    stat: "75%",
    statLabel: "judge credibility by the website alone",
  },
  {
    Icon: IconMapPin,
    title: "One website. Every market you serve",
    body: "Serve Lagos, Abuja, Port Harcourt — and Accra, Nairobi, London, New York — from one place.",
    stat: "570M+",
    statLabel: "Africans online, and growing fast",
  },
  {
    Icon: IconCreditCard,
    title: "Collect payment at 2am without being awake",
    body: "Paystack, Flutterwave, bank transfers — automated from your site, around the clock.",
    stat: "3×",
    statLabel: "more revenue for businesses that sell online",
  },
  {
    Icon: IconTrophy,
    title: "A great website makes a 3-person team look like 300",
    body: "In a market where most competitors have weak online presence, the bar is low.",
    stat: "83%",
    statLabel: "of SME owners say their website drives business",
  },
  {
    Icon: IconUsers,
    title: "Your website is the only audience you own",
    body: "Instagram can suspend you. Algorithms change. Your website answers only to you.",
    stat: "∞",
    statLabel: "no algorithm between you and your customers",
  },
] as const;

function ReasonCard({
  Icon,
  title,
  body,
  stat,
  statLabel,
  index,
}: (typeof REASONS)[number] & { index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="lm-card lm-card-hover p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="icon-square">
          <Icon size={20} />
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-2xl font-extrabold gradient-text leading-none">{stat}</p>
          <p className="text-[10px] text-[var(--fg)]/35 mt-1 leading-snug max-w-[9rem]">{statLabel}</p>
        </div>
      </div>
      <div>
        <p className="font-heading font-bold text-[var(--fg)] text-[15px] leading-snug mb-1.5">{title}</p>
        <p className="text-[13.5px] text-[var(--fg)]/50 leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

export function WhyWebsiteSection() {
  const headerRef    = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section id="why" className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
      {/* Top separator */}
      <div className="gradient-line mb-16" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start">

          {/* ── Sticky left column ── */}
          <div ref={headerRef} className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35 }}
              className="mb-5"
            >
              <span className="eyebrow-pill">
                <span className="pulse-dot" />
                Why it matters
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-extrabold text-[var(--fg)] leading-tight mb-4
                         text-[clamp(1.75rem,3vw,2.4rem)] tracking-[-0.02em]"
            >
              Why every growing business needs a website{" "}
              <span className="gradient-text">now</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="text-[var(--fg)]/50 leading-relaxed mb-8 text-[14.5px]"
            >
              Africa&apos;s internet economy is the fastest-growing in the world — and the businesses that show up online now will own the next decade, wherever their customers are.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <Link
                href="/quote"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--primary)] px-7 py-3.5 font-heading text-[13px] font-bold text-[var(--bg)] btn-glow transition-all active:scale-[0.97]"
              >
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12" />
                Start with a free quote
              </Link>
            </motion.div>
          </div>

          {/* ── Right: 2-column card grid ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            {REASONS.map((r, i) => (
              <ReasonCard key={r.title} {...r} index={i} />
            ))}
          </div>

        </div>
      </div>

      <div className="gradient-line mt-16" />
    </section>
  );
}
