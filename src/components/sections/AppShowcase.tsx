import Link from "next/link";
import { AppCard } from "@/components/ui/AppCard";
import { FEATURED_PROJECTS } from "@/mock/portfolio";
import { PageVectors } from "@/components/bg/PageVectors";

export function AppShowcase() {
  return (
    <section className="relative overflow-hidden bg-[var(--surface)] py-[var(--section-y)]">
      <PageVectors variant="top-right" intensity={0.35} />
      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="mb-12 flex flex-col items-center sm:items-start text-center sm:text-left justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex flex-col items-center sm:items-start">
            <span className="eyebrow justify-center sm:justify-start">Selected portfolio</span>
            <h2 className="mt-2 h-section text-center sm:text-left">
              Decisions, constraints, and intended outcomes
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ink-muted)] text-center sm:text-left">
              Each project explains the problem, the product decisions, and the technical approach. Concept work is labelled clearly, and projected outcomes are never presented as measured results.
            </p>
          </div>
          <Link href="/portfolio" className="link-underline shrink-0 text-sm font-semibold mx-auto sm:mx-0">
            Explore the portfolio →
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 snap-x snap-mandatory sm:snap-none">
          {FEATURED_PROJECTS.map((app) => (
            <div key={app.name} className="min-w-[80vw] sm:min-w-0 snap-start">
              <AppCard {...app} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
