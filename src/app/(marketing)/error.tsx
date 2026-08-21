"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-[var(--container-px)] text-center">
      <p className="font-mono text-[var(--brand)] text-xs uppercase tracking-[0.3em] mb-4">
        Something went wrong
      </p>
      <h2 className="font-display text-4xl font-extrabold text-[var(--ink)] mb-4">
        Page failed to load
      </h2>
      <p className="text-[var(--ink)]/50 max-w-sm mb-10 leading-relaxed">
        An unexpected error occurred on this page. Try refreshing or contact us if the issue persists.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="btn-primary h-12 px-8"
        >
          Try again
        </button>
        <Link
          href="/"
          className="btn-ghost h-12 px-8"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
