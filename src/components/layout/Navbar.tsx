"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";
import Link from "next/link";
import { CatalystTechLogo } from "@/components/ui/Logo";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconCode,
  IconBriefcase,
  IconLayoutGrid,
  IconNews,
  IconServer,
  IconUsers,
  IconTrendingUp,
  IconMail,
  IconBrandWhatsapp,
  IconMenu2,
  IconX,
  IconSparkles,
  IconChevronRight,
  IconTools,
  IconTag,
} from "@tabler/icons-react";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/mock/navigation";

/* ── Nav metadata (UI-layer, not in mock) ───────────────────────────────────── */

const NAV_ICONS: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  "/services": IconCode,
  "/pricing": IconTag,
  "/portfolio": IconBriefcase,
  "/tools": IconTools,
  "/templates": IconLayoutGrid,
  "/blog": IconNews,
  "/news": IconNews,
  "/devops": IconServer,
  "/talent": IconUsers,
  "/invest": IconTrendingUp,
  "/contact": IconMail,
};

const NAV_DESC: Record<string, string> = {
  "/services": "Web, mobile, DevOps, AI & more",
  "/pricing": "Transparent Naira pricing, no hidden fees",
  "/portfolio": "Products we've shipped",
  "/tools": "Resume maker, estimator, stack picker & audit",
  "/news": "Tech news from Africa & around the world",
  "/templates": "Launch-ready starters",
  "/blog": "Insights for builders",
  "/devops": "Pipelines & infrastructure",
  "/talent": "Join our talent network",
  "/invest": "Equity & revenue share",
  "/contact": "Book a call · 24 hr reply",
};

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

/* ── Component ──────────────────────────────────────────────────────────────── */

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  /* Close mobile menu on route change — deferred to avoid sync setState in effect */
  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  /* Scroll: glass + hide-on-down / show-on-up */
  useEffect(() => {
    const handler = () => {
      const curr = window.scrollY;
      setScrolled(curr > 12);
      setVisible(curr < lastScrollY.current || curr < 80);
      lastScrollY.current = curr;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-40 navbar-slide",
        visible ? "navbar-visible" : "navbar-hidden",
        scrolled || menuOpen
          ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "bg-transparent",
      ].join(" ")}
    >
      {/* ── Main bar ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-[var(--container-px)]">
        {/* Logo */}
        <Link href="/" aria-label="TechBuddy home" className="shrink-0">
          <CatalystTechLogo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-0.5"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative flex items-center gap-1.5 rounded-lg px-3.5 py-2",
                  "font-heading text-[13px] font-medium transition-colors duration-150",
                  active
                    ? "text-[var(--primary)] bg-[var(--primary)]/8"
                    : "text-[var(--fg)]/50 hover:text-[var(--fg)] hover:bg-[var(--surface)]/40",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "nav-indicator absolute bottom-1 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full bg-[var(--primary)]",
                    active ? "w-[18px]" : "w-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Get a quote CTA */}
          <Link
            href="/quote"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--primary)] pl-4 pr-4 font-heading text-[13px] font-bold text-[var(--bg)] btn-glow hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <IconSparkles size={13} className="opacity-80" />
            Get a quote
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)] transition-colors"
          >
            {menuOpen ? <IconX size={17} /> : <IconMenu2 size={17} />}
          </button>
        </div>
      </div>

      {/* Gradient bottom separator */}
      <div className="gradient-line" />

      {/* ── Mobile menu ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] px-[var(--container-px)] pb-6 pt-3"
          >
            {/* Nav links */}
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ label, href }) => {
                const Icon = NAV_ICONS[href];
                const desc = NAV_DESC[href];
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-150",
                      active
                        ? "bg-[var(--primary)]/8 text-[var(--primary)]"
                        : "text-[var(--fg)]/65 hover:bg-[var(--surface)] hover:text-[var(--fg)]",
                    ].join(" ")}
                  >
                    {Icon && (
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          active
                            ? "bg-[var(--primary)]/15"
                            : "bg-[var(--surface)]",
                        ].join(" ")}
                      >
                        <Icon size={17} />
                      </span>
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="block font-heading text-[14px] font-semibold leading-snug">
                        {label}
                      </span>
                      {desc && (
                        <span className="block font-body text-[11.5px] text-[var(--fg)]/38 mt-0.5">
                          {desc}
                        </span>
                      )}
                    </span>
                    <IconChevronRight
                      size={14}
                      className="shrink-0 opacity-25"
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] font-heading text-[13px] font-semibold text-[var(--fg)]/65 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
              >
                <IconBrandWhatsapp size={16} />
                WhatsApp
              </a>
              <Link
                href="/quote"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-heading text-[13px] font-bold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                <IconSparkles size={14} />
                Get a quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
