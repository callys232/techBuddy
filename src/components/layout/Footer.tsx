import Link from "next/link";
import {
  IconBrandX,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandFacebook,
} from "@tabler/icons-react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/mock/navigation";
import { CatalystTechLogo } from "@/components/ui/Logo";
import type { ComponentType } from "react";

const SOCIAL_ICON_MAP: Record<string, ComponentType<{ size: number }>> = {
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
};

const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "hello@techagency.africa";

export function Footer() {
  return (
    <footer className="bg-[var(--surface)]">
      <div className="gradient-line" />
      <div className="shell py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="TechBuddy home">
              <CatalystTechLogo size="lg" />
            </Link>
            <p className="mt-4 text-sm text-[var(--ink)]/50 max-w-xs leading-relaxed">
              End-to-end digital products for ambitious businesses — built in Africa, engineered to global standards.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ iconName, href, label }) => {
                const Icon = SOCIAL_ICON_MAP[iconName];
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-[var(--ink)]/40 hover:text-[var(--brand)] transition-colors"
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
              <h3 className="font-display text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--ink)]/50 hover:text-[var(--ink)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8">
          <div className="gradient-line mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[var(--ink)]/30">
              © {new Date().getFullYear()} TechBuddy. All rights reserved. Built in Africa, for the world.
            </p>
            <p className="text-[11px] text-[var(--ink)]/30">Lagos, Nigeria · Global remote team · {TEAM_EMAIL}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
