import Link from "next/link";
import { FREE_TOOLS } from "@/mock/tools";
import { PageVectors } from "@/components/bg/PageVectors";

export function ToolsTeaser() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface)] py-[var(--section-y)]">
      <PageVectors variant="flow" intensity={0.3} />

      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
              Free tools
            </span>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--fg)]">
              Plan Before You Build
            </h2>
            <p className="mt-3 text-[var(--fg)]/50 text-sm max-w-md leading-relaxed">
              Six free tools to estimate cost, map your timeline, pick a tech stack, check NDPR compliance, scope your MVP, and audit your site — no sign-up required.
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:inline text-sm font-semibold text-[var(--primary)] hover:underline shrink-0"
          >
            All tools →
          </Link>
        </div>

        {/* Tool cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_TOOLS.map((tool, i) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg)] p-6 hover:border-[var(--primary)]/60 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-sky)] transition-all duration-300"
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{tool.icon}</span>
                {tool.badge && (
                  <span className={[
                    "font-mono text-[10px] font-semibold rounded-full px-2.5 py-0.5 uppercase tracking-wide",
                    i === 0
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : i === 1
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400",
                  ].join(" ")}>
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Title + desc */}
              <h3 className="font-heading font-bold text-[var(--fg)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-[var(--fg)]/50 leading-relaxed flex-1 mb-4">
                {tool.desc}
              </p>

              {/* CTA */}
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all">
                Use for free →
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/tools" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            View all free tools →
          </Link>
        </div>

      </div>
    </section>
  );
}
