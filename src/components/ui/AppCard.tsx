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
}: AppCardProps) {
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
          {/* Result badge overlay */}
          {highlight && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[var(--bg)]/90 backdrop-blur-sm border border-[var(--border)] px-2.5 py-1">
              <IconTrendingUp size={11} className="text-[var(--primary)] shrink-0" />
              <span className="font-mono text-[10px] text-[var(--fg)]/70 leading-none">{highlight}</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-[var(--fg)] mb-1">{name}</h3>
          {description && (
            <p className="text-xs text-[var(--fg)]/50 leading-relaxed mb-3 line-clamp-2">{description}</p>
          )}
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
            {liveUrl && liveUrl !== "#" && (
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
              <button type="button" className="text-sm font-semibold text-[var(--fg)]/50 hover:text-[var(--fg)] transition-colors">
                Case study →
              </button>
            )}
          </div>
        </div>
      </div>

      {caseStudy && (
        <Popup isOpen={open} onClose={() => setOpen(false)} title={name} size="lg">
          <div className="space-y-6">
            {/* Client & result */}
            <div className="rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-4 space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">Key outcome</p>
              <p className="font-display text-base font-bold text-[var(--fg)]">{result}</p>
              {client && <p className="text-xs text-[var(--fg)]/45">{client}</p>}
            </div>

            {/* Description */}
            {description && (
              <div>
                <h4 className="font-display font-bold text-[var(--fg)] mb-2 text-sm">About this project</h4>
                <p className="text-sm text-[var(--fg)]/70 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Highlight stat */}
            {highlight && (
              <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                <IconTrendingUp size={14} className="text-[var(--primary)] shrink-0" />
                <span>{highlight}</span>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h4 className="font-display font-bold text-[var(--fg)] mb-2 text-sm">Tech Stack</h4>
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

            <div className="pt-4 border-t border-[var(--border)] text-center">
              <a
                href="/quote"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
              >
                Build something similar →
              </a>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
