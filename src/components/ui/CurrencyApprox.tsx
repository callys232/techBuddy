"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";

/** Renders a converted-currency hint (e.g. "≈ $125") next to a Naira price. Renders nothing for Nigerian visitors. */
export function CurrencyApprox({
  ngn,
  ngnMax,
  className = "block text-[11px] text-[var(--ink-faint)] mt-0.5",
}: {
  ngn: number;
  ngnMax?: number;
  className?: string;
}) {
  const { approx, approxRange } = useCurrency();
  const text = ngnMax != null ? approxRange(ngn, ngnMax) : approx(ngn);
  if (!text) return null;
  return <span className={className}>{text}</span>;
}
