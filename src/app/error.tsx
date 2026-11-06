"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconAlertTriangle, IconRefresh, IconArrowLeft, IconBrandWhatsapp } from "@tabler/icons-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347070994391";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const waHelpUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hi TechBuddy, I encountered an issue on your website."
  )}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-[var(--container-px)] text-center py-20 bg-[var(--page)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] mb-6 shadow-sm border border-[var(--brand)]/20">
        <IconAlertTriangle size={32} />
      </div>

      <p className="font-mono text-[var(--brand)] text-xs uppercase tracking-[0.25em] mb-3">
        System Notice
      </p>

      <h1 className="h-display mb-4 text-3xl sm:text-4xl">
        Something unexpected happened
      </h1>

      <p className="text-[var(--ink-muted)] max-w-md mb-8 leading-relaxed text-sm">
        We encountered a momentary glitch. Our automated monitoring has logged this, but you can retry or reach out if you were in the middle of something important.
      </p>

      {error?.digest && (
        <p className="font-mono text-[11px] text-[var(--ink-faint)] mb-8 bg-[var(--surface)] px-3 py-1 rounded-md border border-[var(--border)]">
          Error Reference: {error.digest}
        </p>
      )}

      <div className="flex flex-wrap gap-3 justify-center items-center">
        <button
          onClick={reset}
          className="btn-primary h-11 px-6 text-sm inline-flex items-center gap-2"
        >
          <IconRefresh size={16} />
          Try again
        </button>

        <Link
          href="/"
          className="btn-ghost h-11 px-6 text-sm inline-flex items-center gap-2"
        >
          <IconArrowLeft size={16} />
          Return Home
        </Link>

        <a
          href={waHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/5 px-5 font-heading font-semibold text-xs text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all active:scale-95"
        >
          <IconBrandWhatsapp size={16} />
          Contact Support on WhatsApp
        </a>
      </div>
    </div>
  );
}
