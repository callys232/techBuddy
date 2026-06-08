"use client";

import { useState } from "react";
import Link from "next/link";
import { PROJECT_TYPES, FEATURE_ADDONS, TIMELINE_MULTIPLIERS } from "@/mock/tools";

function fmt(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

export function CostEstimator() {
  const [projectType, setProjectType]   = useState(PROJECT_TYPES[0].id);
  const [features,    setFeatures]      = useState<string[]>([]);
  const [timeline,    setTimeline]      = useState(TIMELINE_MULTIPLIERS[1].id);

  const base = PROJECT_TYPES.find((p) => p.id === projectType)?.base ?? 0;
  const featureTotal = FEATURE_ADDONS.filter((f) => features.includes(f.id)).reduce((s, f) => s + f.cost, 0);
  const mult = TIMELINE_MULTIPLIERS.find((t) => t.id === timeline)?.mult ?? 1;

  const raw  = (base + featureTotal) * mult;
  const low  = raw * 0.85;
  const high = raw * 1.2;

  const toggleFeature = (id: string) =>
    setFeatures((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const quoteParams = new URLSearchParams({
    service: projectType,
    features: features.join(","),
    budget: String(Math.round(raw)),
  }).toString();

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

      {/* ── Left: inputs ──────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Project type */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-3">What are you building?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PROJECT_TYPES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProjectType(p.id)}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all active:scale-[0.97]",
                  projectType === p.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50 hover:text-[var(--fg)]",
                ].join(" ")}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature addons */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-1">Features you need</p>
          <p className="text-xs text-[var(--fg)]/40 mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {FEATURE_ADDONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFeature(f.id)}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95",
                  features.includes(f.id)
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/40",
                ].join(" ")}
              >
                {f.label}
                <span className="ml-1.5 opacity-50 text-[10px]">+{(f.cost / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="font-heading font-semibold text-[var(--fg)] mb-3">Timeline</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIMELINE_MULTIPLIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeline(t.id)}
                className={[
                  "rounded-xl border px-3 py-3 text-xs font-medium text-left transition-all",
                  timeline === t.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--fg)]/55 hover:border-[var(--primary)]/40",
                ].join(" ")}
              >
                {t.label}
                {t.id === "asap" && (
                  <span className="block text-[10px] mt-1 opacity-60">+40% urgency fee</span>
                )}
                {t.id === "relaxed" && (
                  <span className="block text-[10px] mt-1 opacity-60">12% discount</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: result card ────────────────────────────────────────── */}
      <div className="glass rounded-[var(--radius-card)] p-6 border border-[var(--border)] sticky top-24">
        <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.25em] mb-4">
          Estimated range
        </p>

        <p className="font-display text-3xl font-extrabold text-[var(--fg)] leading-none mb-1">
          {fmt(low)}
        </p>
        <p className="font-display text-lg text-[var(--fg)]/40 mb-6">
          – {fmt(high)}
        </p>

        <div className="space-y-2 mb-6 text-xs text-[var(--fg)]/50">
          <div className="flex justify-between">
            <span>Base ({PROJECT_TYPES.find((p) => p.id === projectType)?.label})</span>
            <span>{fmt(base)}</span>
          </div>
          {features.length > 0 && (
            <div className="flex justify-between">
              <span>Features ({features.length})</span>
              <span>+{fmt(featureTotal)}</span>
            </div>
          )}
          {timeline !== "short" && (
            <div className="flex justify-between">
              <span>Timeline adjustment</span>
              <span>{mult > 1 ? "+" : ""}{Math.round((mult - 1) * 100)}%</span>
            </div>
          )}
          <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold text-[var(--fg)]/70">
            <span>Midpoint estimate</span>
            <span>{fmt(raw)}</span>
          </div>
        </div>

        <p className="text-[10px] text-[var(--fg)]/30 mb-5 leading-relaxed">
          This is a ballpark estimate based on average project complexity. Your actual quote may vary based on design requirements, integrations and team size.
        </p>

        <Link
          href={`/quote?${quoteParams}`}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95 w-full"
        >
          Get exact quote →
        </Link>
      </div>
    </div>
  );
}
