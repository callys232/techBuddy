"use client";

import { useState } from "react";
import Image from "next/image";
import { IconTrendingUp } from "@tabler/icons-react";
import { Popup } from "./Popup";
import type { Project } from "@/mock/portfolio";

type AppCardProps = Omit<Project, "category">;

export function AppCard({
  image,
  name,
  description,
  tags,
  stack,
  liveUrl,
  caseStudy,
  result,
  highlight,
  client,
  illustrative,
}: AppCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={caseStudy ? () => setOpen(true) : undefined}
        className={[
          "card-interactive group relative overflow-hidden",
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
          {illustrative && (
            <div className="absolute top-3 left-3 rounded-full bg-[var(--ink)]/80 backdrop-blur-sm px-2.5 py-1">
              <span className="font-mono text-[9px] uppercase tracking-wide text-white/90 leading-none">Concept project</span>
            </div>
          )}
          {/* Result badge overlay */}
          {highlight && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] px-2.5 py-1">
              <IconTrendingUp size={11} className="text-[var(--brand)] shrink-0" />
              <span className="font-mono text-[10px] text-[var(--ink)]/70 leading-none">{highlight}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading text-base font-bold text-[var(--ink)] mb-1">{name}</h3>
          {description && (
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs rounded-[var(--radius-badge)] border border-[var(--border)] px-2 py-0.5 text-[var(--ink-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {liveUrl && liveUrl !== "#" && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Live →
              </a>
            )}
            {caseStudy && (
              <button type="button" className="text-sm font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors">
                {illustrative ? "See concept →" : "Case study →"}
              </button>
            )}
          </div>
        </div>
      </div>

      {caseStudy && (
        <Popup isOpen={open} onClose={() => setOpen(false)} title={name} size="lg">
          <div className="space-y-6">
            {illustrative && (
              <div className="rounded-lg bg-[var(--warn)]/8 border border-[var(--warn)]/25 px-4 py-2.5">
                <p className="text-xs text-[var(--ink)]">
                  <strong>Concept project</strong> — this illustrates how we&apos;d approach this kind of build. It&apos;s not a completed client engagement, and the numbers below are a target, not a measured result.
                </p>
              </div>
            )}

            {/* Client & result */}
            <div className="rounded-xl bg-[var(--brand)]/5 border border-[var(--brand)]/20 p-4 space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brand)]">{illustrative ? "Target outcome" : "Key outcome"}</p>
              <p className="font-heading text-base font-bold text-[var(--ink)]">{result}</p>
              {client && <p className="text-xs text-[var(--ink-faint)]">{client}</p>}
            </div>

            {/* Description */}
            {description && (
              <div>
                <h4 className="font-heading font-bold text-[var(--ink)] mb-2 text-sm">About this project</h4>
                <p className="text-sm text-[var(--ink)]/80 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Highlight stat */}
            {highlight && (
              <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                <IconTrendingUp size={14} className="text-[var(--brand)] shrink-0" />
                <span>{highlight}</span>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h4 className="font-heading font-bold text-[var(--ink)] mb-2 text-sm">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-xs rounded-[var(--radius-badge)] border border-[var(--border)] px-2 py-0.5 text-[var(--ink-muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] text-center">
              <a href="/quote" className="btn-primary h-10 px-6 text-sm">
                Build something similar →
              </a>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
