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
  teal: "hover:border-[var(--accent-teal)] hover:shadow-[0_0_24px_rgba(0,229,192,0.2)]",
  amber: "hover:border-[var(--accent-amber)] hover:shadow-[0_0_24px_rgba(245,166,35,0.2)]",
  coral: "hover:border-[var(--accent-coral)] hover:shadow-[0_0_24px_rgba(255,92,77,0.2)]",
} as const;

const BADGE_COLOR = {
  teal: "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]",
  amber: "bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]",
  coral: "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]",
} as const;

interface ServiceCardProps {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  tag: string;
  href: string;
  color?: keyof typeof GLOW;
}

export function ServiceCard({ icon, title, desc, tag, href, color = "teal" }: ServiceCardProps) {
  const Icon = ICONS[icon];

  return (
    <Link
      href={href}
      className={[
        "group relative flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border)]",
        "bg-[var(--surface)] p-6 transition-all duration-300",
        "hover:-translate-y-1.5",
        GLOW[color],
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg)]">
          <Icon size={22} className="text-[var(--primary)]" />
        </span>
        <span className={`font-mono text-xs font-semibold rounded-[var(--radius-badge)] px-2.5 py-1 ${BADGE_COLOR[color]}`}>
          {tag}
        </span>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-[var(--fg)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{desc}</p>
      </div>
      <span className="mt-auto text-sm font-semibold text-[var(--primary)] group-hover:underline">
        Learn more →
      </span>
    </Link>
  );
}
