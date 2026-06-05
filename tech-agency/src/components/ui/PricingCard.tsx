import { IconCheck } from "@tabler/icons-react";

interface PricingCardProps {
  tier: string;
  price: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
}

export function PricingCard({ tier, price, features, recommended, ctaText }: PricingCardProps) {
  return (
    <div
      className={[
        "relative flex flex-col rounded-[var(--radius-card)] border p-7 transition-all duration-300",
        recommended
          ? "border-[var(--primary)] bg-[var(--surface)] shadow-[var(--shadow-glow-teal)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50",
      ].join(" ")}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-bold text-[var(--bg)]">
          Recommended
        </span>
      )}
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold text-[var(--fg)]">{tier}</h3>
        <p className="mt-2 font-display text-3xl font-extrabold text-[var(--fg)]">{price}</p>
      </div>
      <ul className="flex-1 space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[var(--fg)]/70">
            <IconCheck size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href="/quote"
        className={[
          "flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-all active:scale-95",
          recommended
            ? "bg-[var(--primary)] text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)]"
            : "border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
        ].join(" ")}
      >
        {ctaText}
      </a>
    </div>
  );
}
