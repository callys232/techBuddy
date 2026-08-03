import { headers } from "next/headers";

export interface UserLocation {
  countryCode: string | null;
  countryName: string | null;
  currency: string;
  isNigeria: boolean;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "the United States", GB: "the United Kingdom", CA: "Canada", AU: "Australia",
  IE: "Ireland", NZ: "New Zealand", DE: "Germany", FR: "France", ES: "Spain",
  IT: "Italy", NL: "the Netherlands", PT: "Portugal", BE: "Belgium",
  GH: "Ghana", KE: "Kenya", ZA: "South Africa", EG: "Egypt", RW: "Rwanda",
  UG: "Uganda", TZ: "Tanzania", IN: "India", AE: "the UAE", SA: "Saudi Arabia",
};

const EUROZONE = new Set(["DE", "FR", "ES", "IT", "NL", "PT", "BE", "IE", "AT", "FI", "GR"]);

const COUNTRY_CURRENCY: Record<string, string> = {
  NG: "NGN", US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD",
  GH: "GHS", KE: "KES", ZA: "ZAR", EG: "EGP", IN: "INR",
  AE: "AED", SA: "SAR",
};

function countryCurrency(code: string): string {
  if (COUNTRY_CURRENCY[code]) return COUNTRY_CURRENCY[code];
  if (EUROZONE.has(code)) return "EUR";
  return "USD";
}

/** Reads Vercel's edge-injected geo headers. Returns nulls when unavailable (local dev, non-Vercel hosts). */
export async function getUserLocation(): Promise<UserLocation> {
  const h = await headers();
  const countryCode = h.get("x-vercel-ip-country");

  if (!countryCode) {
    return { countryCode: null, countryName: null, currency: "NGN", isNigeria: false };
  }

  return {
    countryCode,
    countryName: COUNTRY_NAMES[countryCode] ?? countryCode,
    currency: countryCurrency(countryCode),
    isNigeria: countryCode === "NG",
  };
}
