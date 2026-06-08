import Link from "next/link";
import { AppCard } from "@/components/ui/AppCard";
import { FEATURED_PROJECTS } from "@/mock/portfolio";

export function AppShowcase() {
  return (
    <section className="bg-[var(--surface)] py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">Our work</span>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--fg)]">
              Apps We&apos;ve Shipped
            </h2>
          </div>
          <Link href="/portfolio" className="hidden sm:inline text-sm font-semibold text-[var(--primary)] hover:underline">
            All projects →
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
