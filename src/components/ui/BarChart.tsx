"use client";

import { useState } from "react";

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  /** Formats the value for the tooltip and the direct end-label, e.g. (v) => `${v}%` */
  formatValue?: (v: number) => string;
  height?: number;
}

const BAR_THICKNESS = 22; // marks-and-anatomy.md: bar ≤24px thick
const GAP = 2;            // surface-gap spacer between bars

/**
 * Single-series horizontal bar chart. One hue (brand blue) since there's only
 * one series — per dataviz rules, a single series needs no legend, and text
 * stays in ink tokens while only the bar fill carries the brand color.
 */
export function BarChart({ data, formatValue = (v) => String(v), height }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = BAR_THICKNESS + GAP + 14; // bar + gap + label row

  return (
    <div className="w-full" role="img" aria-label={data.map((d) => `${d.label}: ${formatValue(d.value)}`).join(", ")}>
      <div className="space-y-3" style={height ? { height, overflowY: "auto" } : undefined}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={d.label}
              className="relative"
              style={{ height: rowH }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[var(--ink)]">{d.label}</span>
                <span className="text-xs font-semibold tabular-nums text-[var(--ink-muted)]">
                  {formatValue(d.value)}
                </span>
              </div>
              {/* Track — recessive, one step off surface */}
              <div className="relative h-[22px] rounded-[4px] bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full rounded-[4px] transition-[width] duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: "var(--brand)",
                    opacity: isHovered ? 1 : 0.88,
                  }}
                />
              </div>
              {isHovered && (
                <div
                  className="absolute -top-1 -translate-y-full rounded-lg bg-[var(--ink)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--page)] shadow-lg pointer-events-none z-10"
                  style={{ left: `${Math.min(pct, 92)}%`, transform: "translate(-50%, -100%)" }}
                >
                  {d.label}: {formatValue(d.value)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
