"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconWorld, IconX } from "@tabler/icons-react";
import type { UserLocation } from "@/lib/geo";

const DISMISS_KEY = "ta_currency_banner_dismissed";

export function CurrencyBanner({ location }: { location: UserLocation }) {
  const [dismissed, setDismissed] = useState(true); // start hidden — avoids SSR flash before localStorage check

  useEffect(() => {
    if (!location.countryCode || location.isNigeria) return;
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, [location.countryCode, location.isNigeria]);

  if (!location.countryCode || location.isNigeria || dismissed) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="card-quiet flex items-center gap-3 px-4 py-3 mb-8 max-w-2xl">
      <span className="icon-square shrink-0">
        <IconWorld size={18} />
      </span>
      <p className="flex-1 text-left text-sm text-[var(--ink)]/70 leading-snug">
        Looks like you&apos;re browsing from <strong className="text-[var(--ink)]">{location.countryName}</strong> — prices below are in Naira, but we quote in{" "}
        <strong className="text-[var(--brand)]">{location.currency}</strong> for international clients.{" "}
        <Link href="/quote" className="font-semibold text-[var(--brand)] hover:underline whitespace-nowrap">
          Get a quote in {location.currency} →
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-[var(--ink)]/30 hover:text-[var(--ink)] transition-colors"
      >
        <IconX size={15} />
      </button>
    </div>
  );
}
