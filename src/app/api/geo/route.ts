import { NextResponse } from "next/server";
import { getUserLocation } from "@/lib/geo";
import { getExchangeRates } from "@/lib/currency";

export async function GET() {
  const [location, rates] = await Promise.all([getUserLocation(), getExchangeRates()]);
  return NextResponse.json({ location, rates });
}
