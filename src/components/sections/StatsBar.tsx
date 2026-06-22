import { StatCard } from "@/components/ui/StatCard";
import { STATS } from "@/mock/stats";
import { PageVectors } from "@/components/bg/PageVectors";

export function StatsBar() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
      <PageVectors variant="minimal" intensity={0.55} />
      <div className="relative z-10 mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border)]">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
