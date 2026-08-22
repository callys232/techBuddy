"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserLocation } from "@/lib/geo";
import { convertFromNGN, formatCurrency, type FxRates } from "@/lib/currency";

interface CurrencyContextValue {
  currency: string;
  isNigeria: boolean;
  /** "≈ $125", or null when the visitor is in Nigeria / currency is unknown — nothing to show. */
  approx: (ngn: number) => string | null;
  approxRange: (minNgn: number, maxNgn: number) => string | null;
}

const DEFAULT_LOCATION: UserLocation = { countryCode: null, countryName: null, currency: "NGN", isNigeria: false };
const DEFAULT_RATES: FxRates = { ngnPerUnit: {} };

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/**
 * Fetches geo + FX rates client-side (from /api/geo) instead of in a server
 * layout, so `headers()`/live-fetch usage never forces the whole site into
 * dynamic rendering — marketing pages stay statically generated. Renders
 * nothing extra until the fetch resolves; approx()/approxRange() default to
 * null (no conversion shown) in the meantime.
 */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [rates, setRates] = useState<FxRates>(DEFAULT_RATES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setLocation(data.location);
        setRates(data.rates);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const { currency, isNigeria } = location;

  const value = useMemo<CurrencyContextValue>(() => {
    function approx(ngn: number): string | null {
      if (isNigeria || currency === "NGN") return null;
      const converted = convertFromNGN(ngn, currency, rates);
      return converted == null ? null : `≈ ${formatCurrency(converted, currency)}`;
    }

    function approxRange(minNgn: number, maxNgn: number): string | null {
      if (isNigeria || currency === "NGN") return null;
      const min = convertFromNGN(minNgn, currency, rates);
      const max = convertFromNGN(maxNgn, currency, rates);
      if (min == null || max == null) return null;
      return `≈ ${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
    }

    return { currency, isNigeria, approx, approxRange };
  }, [currency, isNigeria, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
