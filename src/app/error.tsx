"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body className="min-h-screen bg-[#060E1C] flex flex-col items-center justify-center px-6 text-center font-sans">
        <p className="font-mono text-[#38BDF8] text-xs uppercase tracking-[0.3em] mb-4">
          Unexpected Error
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Something broke
        </h1>
        <p className="text-white/50 max-w-sm mb-10 leading-relaxed">
          An unexpected error occurred. Our team has been notified. Try again or reach out if it persists.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#38BDF8] px-8 font-semibold text-[#060E1C] hover:opacity-90 transition-opacity active:scale-95"
          >
            Try again
          </button>
          <a
            href="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 px-8 font-semibold text-white hover:border-[#38BDF8] hover:text-[#38BDF8] transition-all active:scale-95"
          >
            Contact Support
          </a>
        </div>
      </body>
    </html>
  );
}
