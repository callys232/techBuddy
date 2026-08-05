import { IconCheck, IconX, IconMinus } from "@tabler/icons-react";

export type CapabilityState = "yes" | "no" | "partial";

export interface ComparisonRow {
  capability: string;
  values: CapabilityState[];
}

interface ComparisonTableProps {
  columns: string[];
  /** Which column index is "us" — gets the highlighted background */
  highlightColumn?: number;
  rows: ComparisonRow[];
}

function StateGlyph({ state }: { state: CapabilityState }) {
  if (state === "yes") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--good)]">
        <IconCheck size={14} className="text-white" strokeWidth={3} />
      </span>
    );
  }
  if (state === "partial") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)]">
        <IconMinus size={12} className="text-[var(--ink-faint)]" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)]">
      <IconX size={12} className="text-[var(--ink-faint)]" strokeWidth={2.5} />
    </span>
  );
}

/**
 * Three-state comparison table (yes / no / partial) — more credible than an
 * all-green checkmark column. "No" renders as a neutral outline, not a red
 * flag: status color (--bad) is reserved for genuine errors/warnings, not
 * "this competitor lacks a feature."
 */
export function ComparisonTable({ columns, highlightColumn = 0, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[560px]">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
              Capability
            </th>
            {columns.map((col, i) => (
              <th
                key={col}
                className={[
                  "px-4 py-3 text-center text-xs font-bold uppercase tracking-wider",
                  i === highlightColumn ? "text-[var(--brand)]" : "text-[var(--ink-muted)]",
                ].join(" ")}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.capability} className={ri % 2 === 1 ? "bg-[var(--surface)]" : undefined}>
              <td className="px-4 py-3.5 text-sm text-[var(--ink)] border-t border-[var(--border)]">
                {row.capability}
              </td>
              {row.values.map((v, i) => (
                <td
                  key={i}
                  className={[
                    "px-4 py-3.5 text-center border-t border-[var(--border)]",
                    i === highlightColumn ? "bg-[var(--brand)]/[0.04]" : "",
                  ].join(" ")}
                >
                  <StateGlyph state={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-5 mt-4 px-4 text-xs text-[var(--ink-muted)]">
        <span className="flex items-center gap-1.5"><StateGlyph state="yes" /> Included</span>
        <span className="flex items-center gap-1.5"><StateGlyph state="partial" /> Partial / limited</span>
        <span className="flex items-center gap-1.5"><StateGlyph state="no" /> Not included</span>
      </div>
    </div>
  );
}
