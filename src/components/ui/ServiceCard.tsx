"use client";

import Link from "next/link";
import {
  IconCode,
  IconDeviceMobile,
  IconServer,
  IconShield,
  IconCloud,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconArrowRight,
} from "@tabler/icons-react";

const ICONS = {
  code: IconCode,
  "device-mobile": IconDeviceMobile,
  server: IconServer,
  shield: IconShield,
  cloud: IconCloud,
  "credit-card": IconCreditCard,
  search: IconSearch,
  settings: IconSettings,
} as const;

const GLOW = {
  teal:  "hover:border-[var(--accent-teal)] hover:shadow-[0_0_24px_rgba(0,229,192,0.15)]",
  amber: "hover:border-[var(--accent-amber)] hover:shadow-[0_0_24px_rgba(245,166,35,0.15)]",
  coral: "hover:border-[var(--accent-coral)] hover:shadow-[0_0_24px_rgba(255,92,77,0.15)]",
} as const;

const ICON_COLOR = {
  teal:  "text-[var(--color-accent-teal)]",
  amber: "text-[var(--color-accent-amber)]",
  coral: "text-[var(--color-accent-coral)]",
} as const;

const TAG_COLOR = {
  teal:  "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]",
  amber: "bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]",
  coral: "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]",
} as const;

interface ServiceCardProps {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  outcome: string;
  tag: string;
  href: string;
  color?: keyof typeof GLOW;
  startingFrom: string;
}

export function ServiceCard({
  icon, title, desc, outcome, tag, href, color = "teal", startingFrom,
}: ServiceCardProps) {
  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border)]",
        "bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1.5",
        GLOW[color],
      ].join(" ")}
    >
      {/* Icon + tag */}
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg)] ${ICON_COLOR[color]}`}>
          <Icon size={22} />
        </span>
        <span className={`font-mono text-xs font-semibold rounded-[var(--radius-badge)] px-2.5 py-1 ${TAG_COLOR[color]}`}>
          {tag}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-display text-xl font-bold text-[var(--fg)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{desc}</p>
      </div>

      {/* Outcome line */}
      <p className="text-xs text-[var(--fg)]/45 italic leading-relaxed border-l-2 border-[var(--border)] pl-3">
        {outcome}
      </p>

      {/* Footer: price + CTA */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <span className="font-mono text-xs font-medium text-[var(--fg)]/40">{startingFrom}</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] group-hover:gap-2 transition-all">
          Learn more <IconArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
