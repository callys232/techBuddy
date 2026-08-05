import { STATS } from "@/mock/stats";

/* Same four proof stats shown in Hero and WhyWebsiteSection — one
   source of truth, not a second set of numbers that can drift. */
const SHOWN = [STATS.productsShipped, STATS.timeToMvp, STATS.clientReEngagement, STATS.engineersInNetwork];

export function StatsBar() {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="shell">
        <div className="flex flex-wrap items-center justify-center divide-x divide-[var(--border)]">
          {SHOWN.map((stat) => (
            <div key={stat.id} className="flex items-center gap-3 px-8 py-6">
              <p className="font-display font-semibold text-2xl text-[var(--brand)] leading-none">{stat.value}</p>
              <p className="text-[12px] muted leading-snug max-w-[7rem]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
