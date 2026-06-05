interface InvestCardProps {
  name: string;
  type: string;
  description: string;
  eligibility: string;
  ctaText: string;
}

const TYPE_COLORS: Record<string, string> = {
  Equity: "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]",
  Revenue: "bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]",
  Incubation: "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]",
  Advisory: "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]",
  Partnership: "bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]",
};

export function InvestCard({ name, type, description, eligibility, ctaText }: InvestCardProps) {
  return (
    <div className="flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-glow-teal)]">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-[var(--fg)]">{name}</h3>
        <span className={`font-mono text-xs font-semibold rounded-[var(--radius-badge)] px-2.5 py-1 ${TYPE_COLORS[type] ?? TYPE_COLORS.Advisory}`}>
          {type}
        </span>
      </div>
      <p className="text-sm text-[var(--fg)]/60 leading-relaxed mb-4">{description}</p>
      <p className="text-xs text-[var(--fg)]/40 mb-6">
        <span className="font-semibold text-[var(--fg)]/60">Eligibility:</span> {eligibility}
      </p>
      <a
        href="/invest/apply"
        className="mt-auto flex h-10 items-center justify-center rounded-full border border-[var(--primary)] text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all active:scale-95"
      >
        {ctaText}
      </a>
    </div>
  );
}
