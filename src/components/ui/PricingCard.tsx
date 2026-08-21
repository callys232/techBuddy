import { IconCheck } from "@tabler/icons-react";

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  desc?: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
}

export function PricingCard({ tier, price, period, desc, features, recommended, ctaText }: PricingCardProps) {
  return (
    <div
      className={[
        "relative flex flex-col p-6",
        recommended ? "card border-[var(--brand)]/50" : "card-interactive",
      ].join(" ")}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-4 py-1 text-xs font-bold text-[var(--brand-ink)]">
          Recommended
        </span>
      )}
      <div className="mb-1">
        <h3 className="font-heading text-sm font-semibold text-[var(--ink)]">{tier}</h3>
        <div className="flex items-baseline gap-0.5 mt-1">
          <span className="font-heading text-2xl font-extrabold text-[var(--ink)]">{price}</span>
          {period && <span className="text-xs text-[var(--ink-faint)]">{period}</span>}
        </div>
      </div>
      {desc && <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-5">{desc}</p>}
      <ul className="flex-1 space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink)]/80">
            <IconCheck size={16} className="mt-0.5 shrink-0 text-[var(--brand)]" />
            {f}
          </li>
        ))}
      </ul>
      <a href="/quote" className={recommended ? "btn-primary h-11 text-sm" : "btn-ghost h-11 text-sm"}>
        {ctaText}
      </a>
    </div>
  );
}
