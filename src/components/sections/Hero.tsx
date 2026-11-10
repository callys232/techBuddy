import Link from "next/link";
import { IconArrowRight, IconCircleCheck, IconShieldCheck, IconBolt } from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { HeroPlayground } from "@/components/sections/HeroPlayground";

const outcomes = [
  {
    title: "Less manual work",
    desc: "Replace disconnected tools, repetitive tasks, and spreadsheet workarounds with automated web & mobile systems.",
    badge: "Automation",
  },
  {
    title: "A better customer experience",
    desc: "Give customers clearer, faster ways to buy, book, pay, or get automated support across web & mobile.",
    badge: "UX & Payments",
  },
  {
    title: "A reliable path to launch",
    desc: "Get a clear scope, weekly visible progress, and dedicated post-launch maintenance with zero guesswork.",
    badge: "4-6 Wks MVP",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-soft)]/40 via-[var(--page)] to-[var(--page)] py-[var(--section-y)]">
      <PageVectors variant="top-right" intensity={0.4} />

      <div className="shell relative z-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="max-w-3xl">
            <h1 className="h-hero mb-6 text-balance">
              Make your business easier to run—and easier to grow.
            </h1>

            <p className="lead max-w-2xl mb-8 text-[var(--ink-muted)] leading-relaxed">
              We turn inefficient workflows and ambitious product ideas into dependable web and mobile software—from the first plan to launch, scaling, and ongoing support.
            </p>

            <div className="flex flex-col gap-3.5 sm:flex-row items-stretch sm:items-center">
              <Link href="/quote" className="btn-primary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                <span>Get a project estimate</span>
                <IconArrowRight size={15} />
              </Link>
              <Link href="/about" className="btn-ghost px-7 py-3.5 text-sm inline-flex items-center justify-center">
                See how we work
              </Link>
            </div>

            {/* Micro-trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-[var(--ink-faint)] border-t border-[var(--border)] pt-5">
              <div className="flex items-center gap-2">
                <IconShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>NDA &amp; Full IP ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBolt size={16} className="text-[var(--brand)] shrink-0" />
                <span>Milestone-based delivery</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Architecture & Tool Playground */}
          <div className="w-full">
            <HeroPlayground />
          </div>
        </div>
      </div>
    </section>
  );
}
