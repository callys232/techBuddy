import { STATS } from "@/mock/stats";

/* Same four proof stats shown in Hero and WhyWebsiteSection — one
   source of truth, not a second set of numbers that can drift. */
const SHOWN = [STATS.productsShipped, STATS.timeToMvp, STATS.clientReEngagement, STATS.engineersInNetwork];

export function StatsBar() {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="shell">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-[var(--border)] sm:divide-x">
          {SHOWN.map((stat, idx) => (
            <div
              key={stat.id}
              className={`flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5 px-4 py-5 sm:px-8 sm:py-6 ${
                idx % 2 === 1 ? "border-l border-[var(--border)] lg:border-l-0" : ""
              }`}
            >
              <p className="font-display font-bold text-2xl sm:text-3xl text-[var(--brand)] leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-[12px] text-[var(--ink-muted)] leading-tight max-w-[8rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
