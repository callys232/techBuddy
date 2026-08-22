/** NGN per 1 unit of the key currency. Used only if the live fetch below fails. */
const NGN_FALLBACK_RATES: Record<string, number> = {
  USD: 1650, GBP: 2080, EUR: 1780, CAD: 1190, AUD: 1080, NZD: 990,
  GHS: 110, KES: 12.8, ZAR: 92, EGP: 33, INR: 19.7, AED: 449, SAR: 440,
};

export interface FxRates {
  /** NGN per 1 unit of the key currency, e.g. ngnPerUnit.USD = 1650 means 1 USD = 1650 NGN */
  ngnPerUnit: Record<string, number>;
}

/** Server-side only — fetches live NGN exchange rates with a 6h Next.js cache, falling back to static rates on error. */
export async function getExchangeRates(): Promise<FxRates> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/NGN", {
      next: { revalidate: 21600 },
    });
    if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`);
    const json = await res.json();
    if (json.result !== "success" || !json.rates) throw new Error("Unexpected FX response shape");

    const ngnPerUnit: Record<string, number> = {};
    for (const [code, rate] of Object.entries(json.rates as Record<string, number>)) {
      if (typeof rate === "number" && rate > 0) ngnPerUnit[code] = 1 / rate;
    }
    return { ngnPerUnit };
  } catch {
    return { ngnPerUnit: NGN_FALLBACK_RATES };
  }
}

export function convertFromNGN(ngn: number, targetCurrency: string, rates: FxRates): number | null {
  if (targetCurrency === "NGN") return ngn;
  const perUnit = rates.ngnPerUnit[targetCurrency];
  if (!perUnit) return null;
  return ngn / perUnit;
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}
