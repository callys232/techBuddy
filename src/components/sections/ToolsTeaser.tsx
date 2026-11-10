"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FREE_TOOLS } from "@/mock/tools";
import { PageVectors } from "@/components/bg/PageVectors";

export function ToolsTeaser() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface)] py-[var(--section-y)]">
      <PageVectors variant="flow" intensity={0.3} />

      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">

        {/* Header + real product screenshot */}
        <div className="mb-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow">Useful before you hire us</span>
            <h2 className="mt-2 h-section">
              Make the first decision with better information
            </h2>
            <p className="mt-3 text-[var(--ink)]/50 text-sm max-w-md leading-relaxed">
              Estimate a software project, define an MVP, compare technology choices, check NDPR readiness, or audit an existing website. Use the tools freely, then talk to us when you need an expert pair of hands.
            </p>
            <Link
              href="/tools"
              className="mt-6 hidden sm:inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              All tools →
            </Link>
          </div>

          {/* Real interface, not a mockup — the Fintech Fees Calculator, live with jump-in scroll animation */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/tools/fintech-fees-calculator" className="group block">
              <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--page)] shadow-lg overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                </div>
                <Image
                  src="/screenshots/fintech-fees-calculator.png"
                  alt="Fintech Fees Calculator interface — Paystack vs Flutterwave transaction cost comparison"
                  width={1440}
                  height={1024}
                  className="w-full h-auto"
                />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Tool cards — each box jumps into view as the user scrolls with staggered spring */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_TOOLS.slice(0, 6).map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.09,
                ease: [0.21, 1.02, 0.49, 0.99],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Link
                href={tool.href}
                className="group flex flex-col h-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--page)] p-6 hover:border-[var(--brand)]/60 shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{tool.icon}</span>
                  {tool.badge && (
                    <span
                      className={[
                        "font-mono text-[10px] font-semibold rounded-full px-2.5 py-0.5 uppercase tracking-wide",
                        i === 0
                          ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                          : i === 1
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400",
                      ].join(" ")}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title + desc */}
                <h3 className="font-heading font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--brand)] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-[var(--ink)]/50 leading-relaxed flex-1 mb-4">
                  {tool.desc}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] group-hover:gap-2.5 transition-all">
                  Use for free →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/tools" className="text-sm font-semibold text-[var(--brand)] hover:underline">
            View all free tools →
          </Link>
        </div>

      </div>
    </section>
  );
}
