"use client";

import { useState } from "react";
import Image from "next/image";
import { Popup } from "./Popup";

interface AppCardProps {
  image: string;
  name: string;
  tags: string[];
  stack: string[];
  liveUrl?: string;
  caseStudy?: boolean;
}

export function AppCard({ image, name, tags, stack, liveUrl, caseStudy }: AppCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={caseStudy ? () => setOpen(true) : undefined}
        className={[
          "group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]",
          "transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--primary)] hover:shadow-[var(--shadow-glow-teal)]",
          caseStudy ? "cursor-pointer" : "",
        ].join(" ")}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-[var(--fg)] mb-3">{name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs rounded-[var(--radius-badge)] border border-[var(--border)] px-2 py-0.5 text-[var(--fg)]/60"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                Live →
              </a>
            )}
            {caseStudy && (
              <button className="text-sm font-semibold text-[var(--fg)]/50 hover:text-[var(--fg)] transition-colors">
                Case study
              </button>
            )}
          </div>
        </div>
      </div>

      {caseStudy && (
        <Popup isOpen={open} onClose={() => setOpen(false)} title={name} size="lg">
          <div className="space-y-6 text-[var(--fg)]/80">
            <div>
              <h4 className="font-display font-bold text-[var(--fg)] mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-xs rounded-[var(--radius-badge)] border border-[var(--border)] px-2 py-0.5 text-[var(--fg)]/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm">Full case study content coming from Sanity CMS.</p>
            <div className="pt-4 border-t border-[var(--border)] text-center">
              <a
                href="/quote"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
              >
                Need something like this? Get a quote
              </a>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
