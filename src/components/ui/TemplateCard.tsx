"use client";

import { useState } from "react";
import Image from "next/image";
import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import { Popup } from "./Popup";
import type { Template, ExternalTemplate } from "@/mock/templates";
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
      <div className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)]/60 hover:shadow-[var(--shadow-glow-teal)]">
        <div className="relative aspect-video overflow-hidden bg-[var(--bg)]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] px-2.5 py-1 capitalize">
            {type}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold text-[var(--fg)]">{name}</h3>
          <p className="text-sm text-[var(--primary)] font-semibold mt-1 mb-3">
            {formatPriceRange(priceRange)}
          </p>
          <ul className="flex-1 space-y-1.5 mb-5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[var(--fg)]/60">
                <IconCheck size={13} className="text-[var(--primary)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="h-9 px-4 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={onSelect}
              className="flex-1 h-9 rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Get quote
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={preview} onClose={() => setPreview(false)} title={`Preview — ${name}`} size="xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setPreview(false); onSelect(); }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
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
      <div className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)]/60 hover:shadow-[var(--shadow-glow-teal)]">
        <div className="relative aspect-video overflow-hidden bg-[var(--bg)]">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized={image.startsWith("http")}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] px-2.5 py-1 capitalize">
            {type}
          </span>
          <span className={`absolute left-3 top-3 font-mono text-xs rounded-[var(--radius-badge)] px-2.5 py-1 ${sourceBadgeColor}`}>
            {sourceLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-[var(--fg)]">{name}</h3>
            <span className="shrink-0 font-mono text-xs text-[var(--fg)]/35 mt-1">{originalPrice}</span>
          </div>
          <p className="text-sm text-[var(--primary)] font-semibold mb-3">
            Customisation: {formatPriceRange(priceRange)}
          </p>
          <ul className="flex-1 space-y-1.5 mb-5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[var(--fg)]/60">
                <IconCheck size={13} className="text-[var(--primary)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <IconExternalLink size={12} />
              Source
            </a>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="h-9 px-4 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={onSelect}
              className="flex-1 h-9 rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Customize
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={preview} onClose={() => setPreview(false)} title={`${name} — Reference`} size="xl">
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
            <Image
              src={image}
              alt={name}
              fill
              unoptimized={image.startsWith("http")}
              className="object-cover"
            />
          </div>
          <div className="glass rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--fg)]/55 leading-relaxed">
            This is an external reference from <strong className="text-[var(--fg)]">{sourceLabel}</strong>. We&apos;ll use it as a starting point and build a custom version tailored to your brand, stack and requirements.
          </div>
          <div className="flex gap-3 justify-center pt-1">
            <button
              type="button"
              onClick={() => { setPreview(false); onSelect(); }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Customize with us
            </button>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--border)] px-6 font-semibold text-[var(--fg)]/60 hover:border-[var(--primary)] hover:text-[var(--fg)] transition-all"
            >
              View original <IconExternalLink size={14} />
            </a>
          </div>
        </div>
      </Popup>
    </>
  );
}
