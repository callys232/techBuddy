"use client";

import { useState } from "react";
import Image from "next/image";
import { IconCheck } from "@tabler/icons-react";
import { Popup } from "./Popup";

interface TemplateCardProps {
  image: string;
  name: string;
  type: string;
  price: string;
  features: string[];
  onSelect: () => void;
}

export function TemplateCard({ image, name, type, price, features, onSelect }: TemplateCardProps) {
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
          <p className="text-sm text-[var(--primary)] font-semibold mt-1 mb-3">{price}</p>
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
              onClick={() => setPreview(true)}
              className="flex-1 h-9 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              Preview
            </button>
            <button
              onClick={onSelect}
              className="flex-1 h-9 rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={preview} onClose={() => setPreview(false)} title={`Preview — ${name}`} size="xl">
        <div className="space-y-4">
          <div className="flex gap-3 justify-center">
            <button className="text-xs font-mono border border-[var(--border)] rounded px-3 py-1 text-[var(--fg)]/60 hover:border-[var(--primary)] transition-colors">
              Desktop
            </button>
            <button className="text-xs font-mono border border-[var(--border)] rounded px-3 py-1 text-[var(--fg)]/60 hover:border-[var(--primary)] transition-colors">
              Mobile
            </button>
          </div>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="text-center pt-2">
            <button
              onClick={() => { setPreview(false); onSelect(); }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-8 font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Select this template
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}
