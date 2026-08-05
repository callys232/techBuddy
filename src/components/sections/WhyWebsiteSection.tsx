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
import { BarChart } from "@/components/ui/BarChart";

/* Suite tints — one hue per reason, applied only to the icon glyph and the
   card's hover tint via --suite-tint, never to chrome or CTAs. */
const SUITE_TINTS = [
  "var(--suite-1)", "var(--suite-2)", "var(--suite-3)",
  "var(--suite-4)", "var(--suite-5)", "var(--suite-6)",
];

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
  const tint   = SUITE_TINTS[index % SUITE_TINTS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="feature-card p-6 flex flex-col gap-4"
      style={{ "--suite-tint": tint } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="icon-square" style={{ color: tint, borderColor: "var(--border)" }}>
          <Icon size={20} />
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-2xl font-semibold leading-none" style={{ color: tint }}>{stat}</p>
          <p className="text-[10px] faint mt-1 leading-snug max-w-[9rem]">{statLabel}</p>
        </div>
      </div>
      <div>
        <p className="font-heading font-bold text-[var(--ink)] text-[15px] leading-snug mb-1.5">{title}</p>
        <p className="text-[13.5px] muted leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

export function WhyWebsiteSection() {
  const headerRef    = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

  return (
    <section id="why" className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
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
              <span className="eyebrow">Why it matters</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="h-section mb-4"
            >
              Why every growing business needs a website now
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="muted leading-relaxed mb-8 text-[14.5px]"
            >
              Africa&apos;s internet economy is the fastest-growing in the world — and the businesses that show up online now will own the next decade, wherever their customers are.
            </motion.p>

            {/* Chart — the 68% claim, shown not just stated */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="card p-5 mb-8"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] faint mb-4">
                How customers decide
              </p>
              <BarChart
                data={[
                  { label: "Research online first", value: 68 },
                  { label: "Buy without researching", value: 32 },
                ]}
                formatValue={(v) => `${v}%`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.22 }}
            >
              <Link href="/quote" className="btn-primary px-7 py-3.5 text-[13px]">
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
