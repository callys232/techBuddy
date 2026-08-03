import { STATS } from "@/mock/stats";

export function StatsBar() {
  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-[var(--container-px)]">
        <div className="flex flex-wrap items-center justify-center divide-x divide-[var(--border)]">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3 px-8 py-6">
              {i !== 0 && <span className="sr-only">|</span>}
              <p className="font-display text-2xl font-extrabold gradient-text leading-none">
                {stat.value}
              </p>
              <p className="text-[12px] text-[var(--fg)]/45 leading-snug max-w-[7rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
