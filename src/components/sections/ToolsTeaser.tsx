import Image from "next/image";
import Link from "next/link";
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
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-widest">
              Free tools
            </span>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--ink)]">
              Plan Before You Build
            </h2>
            <p className="mt-3 text-[var(--ink)]/50 text-sm max-w-md leading-relaxed">
              Six free tools to estimate cost, map your timeline, pick a tech stack, check NDPR compliance, scope your MVP, and audit your site — no sign-up required.
            </p>
            <Link
              href="/tools"
              className="mt-6 hidden sm:inline-flex text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              All tools →
            </Link>
          </div>

          {/* Real interface, not a mockup — the Fintech Fees Calculator, live */}
          <Link href="/tools/fintech-fees-calculator" className="group block">
            <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--page)] shadow-lg overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                <span className="ml-2 font-mono text-[10px] text-[var(--ink-faint)] truncate">techbuddy.ng/tools/fintech-fees-calculator</span>
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
        </div>

        {/* Tool cards — curated to match the "Six free tools" copy above; the
           rest of the 21-tool catalog lives behind the "All tools" link. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_TOOLS.slice(0, 6).map((tool, i) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--page)] p-6 hover:border-[var(--brand)]/60 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{tool.icon}</span>
                {tool.badge && (
                  <span className={[
                    "font-mono text-[10px] font-semibold rounded-full px-2.5 py-0.5 uppercase tracking-wide",
                    i === 0
                      ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                      : i === 1
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400",
                  ].join(" ")}>
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
