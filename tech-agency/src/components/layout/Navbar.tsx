"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Templates", href: "/templates" },
  { label: "Invest", href: "/invest" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={[
        "sticky top-0 z-30 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-[var(--border)] shadow-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-[var(--container-px)] h-16">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-extrabold text-[var(--fg)] hover:text-[var(--primary)] transition-colors">
          Tech<span className="text-[var(--primary)]">Agency</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                "relative px-3 py-2 text-sm font-medium transition-colors group",
                pathname.startsWith(href)
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg)]/50 hover:text-[var(--fg)]",
              ].join(" ")}
            >
              {label}
              <span
                className={[
                  "absolute bottom-1 left-3 right-3 h-px bg-[var(--primary)] transition-transform duration-200 origin-left",
                  pathname.startsWith(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                ].join(" ")}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/quote"
            className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
          >
            Get a quote
          </Link>

          {/* Mobile burger */}
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden glass border-b border-[var(--border)] px-[var(--container-px)] py-4 space-y-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--fg)]/60 hover:bg-[var(--surface)] hover:text-[var(--fg)]",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="block text-center mt-3 h-10 leading-10 rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
          >
            Get a quote
          </Link>
        </div>
      )}
    </header>
  );
}
