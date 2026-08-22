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
  IconCurrencyBitcoin,
  IconArrowRight,
  IconClock,
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
  coin: IconCurrencyBitcoin,
} as const;

/** teal/amber/coral from the old 3-accent system map onto the suite-tint
 *  palette — avoiding suite-1 (blue) since that's already the brand color. */
const SUITE_TINT = {
  teal: "var(--suite-6)",
  amber: "var(--suite-4)",
  coral: "var(--suite-5)",
} as const;

interface ServiceCardProps {
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  outcome: string;
  tag: string;
  href: string;
  color?: keyof typeof SUITE_TINT;
  startingFrom: string;
  comingSoon?: boolean;
}

export function ServiceCard({
  icon,
  title,
  desc,
  outcome,
  tag,
  href,
  color = "teal",
  comingSoon = false,
}: ServiceCardProps) {
  const Icon = ICONS[icon];

  const style = { "--suite-tint": SUITE_TINT[color] } as React.CSSProperties;
  const className = [
    "group flex flex-col gap-3 p-4",
    comingSoon ? "card opacity-70 cursor-default" : "card-interactive",
  ].join(" ");

  const content = (
    <>
      {/* Icon + tag */}
      <div className="flex items-start justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--page)]"
          style={{ color: "var(--suite-tint)" }}
        >
          <Icon size={18} />
        </span>
        <span
          className="flex items-center gap-1 font-mono text-xs font-semibold rounded-[var(--radius-badge)] px-2.5 py-1"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--suite-tint) 12%, transparent)",
            color: "var(--suite-tint)",
          }}
        >
          {comingSoon && <IconClock size={11} />}
          {tag}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-heading text-base font-bold text-[var(--ink)] mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Outcome line */}
      <p className="text-xs text-[var(--ink-faint)] italic leading-relaxed border-l-2 border-[var(--border)] pl-3">
        {outcome}
      </p>

      {/* Footer: CTA only */}
      {!comingSoon && (
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <span className="flex items-center gap-1 text-sm font-semibold text-[var(--brand)] group-hover:gap-2 transition-all">
            Learn more <IconArrowRight size={13} />
          </span>
        </div>
      )}
    </>
  );

  if (comingSoon) {
    return (
      <div style={style} className={className}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} style={style} className={className}>
      {content}
    </Link>
  );
}
