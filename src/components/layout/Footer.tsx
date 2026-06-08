import Link from "next/link";
import {
  IconBrandX,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/mock/navigation";
import type { ComponentType } from "react";

const SOCIAL_ICON_MAP: Record<string, ComponentType<{ size: number }>> = {
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
  instagram: IconBrandInstagram,
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-[var(--container-px)] py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-2xl font-extrabold text-[var(--fg)]">
              Tech<span className="text-[var(--primary)]">Agency</span>
            </Link>
            <p className="mt-4 text-sm text-[var(--fg)]/50 max-w-xs leading-relaxed">
              End-to-end digital products for serious African businesses. NDPR compliant. Built for local conditions.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ iconName, href, label }) => {
                const Icon = SOCIAL_ICON_MAP[iconName];
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-[var(--fg)]/40 hover:text-[var(--primary)] transition-colors"
                  >
                    <Icon size={19} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display text-sm font-bold text-[var(--fg)] mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--fg)]/50 hover:text-[var(--fg)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
          <p className="text-xs text-[var(--fg)]/30">
            © {new Date().getFullYear()} TechAgency. All rights reserved. Built for Africa.
          </p>
          <p className="text-xs text-[var(--fg)]/30">Lagos, Nigeria · hello@techagency.africa</p>
        </div>
      </div>
    </footer>
  );
}
