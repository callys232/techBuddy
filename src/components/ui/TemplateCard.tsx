"use client";

import { useState } from "react";
import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import { Popup } from "./Popup";
import { TemplatePreview } from "./TemplatePreview";
import type { ExternalTemplate } from "@/mock/templates";
import { formatPriceRange } from "@/mock/templates";

/* ── Our original templates ─────────────────────────────────────────────── */

interface TemplateCardProps {
  name:       string;
  type:       string;
  priceRange: { min: number; max: number };
  features:   string[];
  image:      string;
  onSelect:   () => void;
}

export function TemplateCard({ image, name, type, priceRange, features, onSelect }: TemplateCardProps) {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <div className="card-interactive group flex flex-col overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-[var(--page)]">
          <TemplatePreview image={image} name={name} type={type} />
          <span className="absolute right-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] bg-[var(--brand)]/10 text-[var(--brand)] px-2.5 py-1 capitalize">
            {type}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-base font-bold text-[var(--ink)]">{name}</h3>
          <p className="text-sm text-[var(--brand)] font-semibold mt-1 mb-3">
            {formatPriceRange(priceRange)}
          </p>
          <ul className="flex-1 space-y-1.5 mb-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                <IconCheck size={13} className="text-[var(--brand)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreview(true)} className="btn-ghost h-9 px-4 text-xs">
              Preview
            </button>
            <button type="button" onClick={onSelect} className="btn-primary flex-1 h-9 text-xs">
              Get quote
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={preview} onClose={() => setPreview(false)} title={`Preview — ${name}`} size="xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--page)] border border-[var(--border)]">
            <TemplatePreview image={image} name={name} type={type} />
          </div>
          <div className="text-center pt-2">
            <button type="button" onClick={() => { setPreview(false); onSelect(); }} className="btn-primary h-11 px-8">
              Get quote for this template
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}

/* ── External template reference card ───────────────────────────────────── */

interface ExternalCardProps extends Omit<ExternalTemplate, "source"> {
  source: "envato" | "github";
  onSelect: () => void;
}

export function ExternalTemplateCard({
  image, name, type, priceRange, features,
  sourceLabel, sourceUrl, originalPrice, onSelect,
}: ExternalCardProps) {
  const [preview, setPreview] = useState(false);

  const sourceBadgeColor = sourceLabel.startsWith("Theme")
    ? "bg-amber-500/10 text-amber-400"
    : "bg-emerald-500/10 text-emerald-400";

  return (
    <>
      <div className="card-interactive group flex flex-col overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-[var(--page)]">
          <TemplatePreview image={image} name={name} type={type} />
          <span className="absolute right-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] bg-[var(--brand)]/10 text-[var(--brand)] px-2.5 py-1 capitalize">
            {type}
          </span>
          <span className={`absolute left-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] px-2.5 py-1 ${sourceBadgeColor}`}>
            {sourceLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading text-base font-bold text-[var(--ink)]">{name}</h3>
            <span className="shrink-0 font-mono text-xs text-[var(--ink-faint)] mt-1">{originalPrice}</span>
          </div>
          <p className="text-sm text-[var(--brand)] font-semibold mb-3">
            Customisation: {formatPriceRange(priceRange)}
          </p>
          <ul className="flex-1 space-y-1.5 mb-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                <IconCheck size={13} className="text-[var(--brand)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-xs">
              <IconExternalLink size={12} />
              Source
            </a>
            <button type="button" onClick={() => setPreview(true)} className="btn-ghost h-9 px-4 text-xs">
              Preview
            </button>
            <button type="button" onClick={onSelect} className="btn-primary flex-1 h-9 text-xs">
              Customize
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={preview} onClose={() => setPreview(false)} title={`${name} — Reference`} size="xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--page)] border border-[var(--border)]">
            <TemplatePreview image={image} name={name} type={type} />
          </div>
          <div className="card-quiet p-4 text-sm text-[var(--ink-muted)] leading-relaxed">
            This is an external reference from <strong className="text-[var(--ink)]">{sourceLabel}</strong>. We&apos;ll use it as a starting point and build a custom version tailored to your brand, stack and requirements.
          </div>
          <div className="flex gap-3 justify-center pt-1">
            <button type="button" onClick={() => { setPreview(false); onSelect(); }} className="btn-primary h-11 px-8">
              Customize with us
            </button>
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost h-11 px-6">
              View original <IconExternalLink size={14} />
            </a>
          </div>
        </div>
      </Popup>
    </>
  );
}
