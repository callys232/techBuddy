import { StatCard } from "@/components/ui/StatCard";

const STATS = [
  { value: 120, label: "Projects Delivered", suffix: "+", color: "teal" as const },
  { value: 99, label: "Uptime Guaranteed", suffix: ".9%", color: "amber" as const },
  { value: 14, label: "Countries Served", suffix: "", color: "teal" as const },
  { value: 98, label: "Client Satisfaction", suffix: "%", color: "coral" as const },
];

export function StatsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border)]">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
