"use client";

import Link from "next/link";
import { IconBrandWhatsapp, IconPencil } from "@tabler/icons-react";

interface FloatingCTAProps {
  whatsappNumber: string;
  quoteHref: string;
}

export function FloatingCTA({ whatsappNumber, quoteHref }: FloatingCTAProps) {
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=Hi%2C%20I%20found%20you%20on%20your%20website%20and%20I%27d%20like%20to%20discuss%20a%20project.`
    : "#";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Quick quote */}
      <Link
        href={quoteHref}
        className="flex items-center gap-2 rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] shadow-lg transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[var(--shadow-glow-teal)] active:scale-95"
      >
        <IconPencil size={16} />
        Quick quote
      </Link>

      {/* WhatsApp — pulse ring */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <IconBrandWhatsapp size={26} />
      </a>
    </div>
  );
}
