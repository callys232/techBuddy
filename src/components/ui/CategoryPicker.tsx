"use client";

export const CATEGORIES = [
  "Fintech / Finance",
  "E-commerce / Retail",
  "Healthcare / Medtech",
  "Logistics / Delivery",
  "Education / EdTech",
  "Agriculture / AgriTech",
  "Real Estate / PropTech",
  "Media / Entertainment",
  "Manufacturing",
  "NGO / Social Impact",
  "Government / Public Sector",
  "Professional Services",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number] | "";

interface Props {
  value:    Category;
  onChange: (v: Category) => void;
  label?:   string;
}

export function CategoryPicker({ value, onChange, label = "What industry are you in?" }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[var(--fg)]/60">
          {label}
          <span className="font-normal text-[var(--fg)]/35 ml-1">— optional</span>
        </p>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-[var(--fg)]/35 hover:text-rose-400 transition-colors"
          >
            Clear ×
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const on = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(on ? "" : cat)}
              className={[
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-all active:scale-95",
                on
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)]/40 hover:text-[var(--fg)]",
              ].join(" ")}
            >
              {cat}
              {on && <span className="opacity-60 font-bold leading-none ml-0.5">×</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
