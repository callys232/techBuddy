interface InvestCardProps {
  name: string;
  type: string;
  description: string;
  eligibility: string;
  ctaText: string;
}

/** Five investment types get five distinct suite hues instead of squeezing
 *  into the old 3-color teal/amber/coral system. */
const TYPE_TINT: Record<string, string> = {
  Equity: "var(--suite-1)",
  Revenue: "var(--suite-4)",
  Incubation: "var(--suite-3)",
  Advisory: "var(--suite-7)",
  Partnership: "var(--suite-5)",
};

export function InvestCard({ name, type, description, eligibility, ctaText }: InvestCardProps) {
  const tint = TYPE_TINT[type] ?? "var(--suite-7)";

  return (
    <div style={{ "--suite-tint": tint } as React.CSSProperties} className="card-interactive flex flex-col p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-base font-bold text-[var(--ink)]">{name}</h3>
        <span
          className="font-mono text-xs font-semibold rounded-[var(--radius-badge)] px-2.5 py-1"
          style={{ backgroundColor: "color-mix(in srgb, var(--suite-tint) 12%, transparent)", color: "var(--suite-tint)" }}
        >
          {type}
        </span>
      </div>
      <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-3">{description}</p>
      <p className="text-xs text-[var(--ink-faint)] mb-4">
        <span className="font-semibold text-[var(--ink-muted)]">Eligibility:</span> {eligibility}
      </p>
      <a href="/invest/apply" className="btn-secondary mt-auto h-10 text-sm">
        {ctaText}
      </a>
    </div>
  );
}
