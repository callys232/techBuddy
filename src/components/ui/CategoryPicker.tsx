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
  const clear = () => onChange("");

  return (
    <div>
      <p className="text-xs font-semibold text-[var(--fg)]/60 mb-2">
        {label}
        <span className="font-normal text-[var(--fg)]/35 ml-1">— optional</span>
      </p>

      {/* Selected chip — only visible when something is chosen */}
      {value ? (
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 py-1 pl-3 pr-1.5 text-[11px] font-semibold text-[var(--primary)]">
            <span>{value}</span>
            {/* Explicit delete button — removes selection entirely */}
            <button
              type="button"
              onClick={clear}
              aria-label="Remove selected industry"
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/25 hover:bg-rose-400 hover:text-white text-[var(--primary)] transition-all leading-none font-bold text-[10px]"
            >
              ×
            </button>
          </div>
          <span className="text-[10px] text-[var(--fg)]/30">click × to remove</span>
        </div>
      ) : null}

      {/* Option pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const selected = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(selected ? "" : cat)}
              className={[
                "rounded-full border px-3 py-1 text-[11px] font-medium transition-all active:scale-95",
                selected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--fg)]/50 hover:border-[var(--primary)]/40 hover:text-[var(--fg)]",
              ].join(" ")}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
