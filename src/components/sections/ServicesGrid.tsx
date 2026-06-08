import Link from "next/link";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FEATURED_SERVICES } from "@/mock/services";

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-[var(--container-px)] py-[var(--section-y)]">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest">What we do</span>
          <h2 className="mt-2 font-display text-4xl font-extrabold text-[var(--fg)]">
            Full-Stack Services
          </h2>
        </div>
        <Link
          href="/services"
          className="hidden sm:inline text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_SERVICES.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Link href="/services" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          View all services →
        </Link>
      </div>
    </section>
  );
}
