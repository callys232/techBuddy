import Link from "next/link";
import { IconArrowRight, IconCircleCheck } from "@tabler/icons-react";

const outcomes = [
  "Less manual work",
  "A better customer experience",
  "A reliable path to launch",
];

export function Hero() {
  return (
    <section className="shell flex min-h-[76vh] items-center py-[var(--section-y)]">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Software for growing businesses</p>
          <h1 className="h-hero mb-6">
            Make your business easier to run—and easier to grow.
          </h1>
          <p className="lead max-w-2xl mb-8">
            We turn inefficient workflows and ambitious product ideas into dependable web and mobile software—from the first plan to launch and support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="btn-primary px-7 py-3.5 text-sm">
              Get a project estimate <IconArrowRight size={15} />
            </Link>
            <Link href="/about" className="btn-ghost px-7 py-3.5 text-sm">
              See how we work
            </Link>
          </div>
          <p className="mt-5 text-xs text-[var(--ink-faint)]">Tell us what needs to work better. We’ll reply with a practical next step and budget range.</p>
        </div>

        <aside className="proof-panel">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">What changes</p>
          <div className="mt-6 space-y-5">
            {outcomes.map((outcome, index) => (
              <div key={outcome} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--brand)]/25 bg-[var(--brand)]/8 font-mono text-xs text-[var(--brand)]">0{index + 1}</span>
                <div>
                  <h2 className="font-heading text-base font-semibold text-[var(--ink)]">{outcome}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {index === 0 && "Replace disconnected tools, repetitive tasks, and spreadsheet workarounds."}
                    {index === 1 && "Give customers clearer, faster ways to buy, book, pay, or get support."}
                    {index === 2 && "Get a focused scope, visible progress, and support after the launch."}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 border-t border-[var(--border)] pt-5 text-sm text-[var(--ink-muted)]">
            <IconCircleCheck size={16} className="mr-2 inline text-[var(--brand)]" />
            Strategy, design, engineering, and launch support in one team.
          </div>
        </aside>
      </div>
    </section>
  );
}