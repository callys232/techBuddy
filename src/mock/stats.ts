/**
 * Single source of truth for every stat that appears in more than one place
 * across the site (Hero, WhyWebsiteSection, StatsBar, About, Talent, etc).
 * Import from here instead of hardcoding a number twice — that's how the
 * same claim drifts into two different values on two pages. This file
 * replaces a previous version of itself that had already drifted: StatsBar
 * showed "120 projects / 99.9% uptime / 14 countries / 98% satisfaction"
 * while Hero and WhyWebsiteSection showed a completely different set.
 *
 * Every stat is tagged `verified`. Unverified stats render as an em dash via
 * `displayStat()` rather than an invented number — an empty stat beats a
 * fabricated one, and this site currently has no sourcing behind any of
 * these, so they are all `verified: false` until real data backs them.
 */

export interface Stat {
  id: string;
  /** The number/range as displayed, e.g. "35+", "8 wks", "94%" */
  value: string;
  label: string;
  verified: boolean;
  /** Required once verified: what grounds the number (e.g. "Internal delivery log, Jan 2026") */
  source?: string;
}

export const STATS: Record<string, Stat> = {
  productsShipped:     { id: "productsShipped",     value: "35+",    label: "products shipped",       verified: false },
  timeToMvp:           { id: "timeToMvp",            value: "8 wks",  label: "idea → live MVP",        verified: false },
  clientReEngagement:  { id: "clientReEngagement",   value: "94%",    label: "client re-engagement",   verified: false },
  engineersInNetwork:  { id: "engineersInNetwork",   value: "120+",   label: "engineers in network",   verified: false },
  avgPlacementTime:    { id: "avgPlacementTime",     value: "5 days", label: "avg. placement time",    verified: false },
  foundedYear:         { id: "foundedYear",          value: "2020",   label: "founded in Lagos",       verified: false },
  uptimeGuaranteed:    { id: "uptimeGuaranteed",     value: "99.9%",  label: "uptime guaranteed",      verified: false },
  countriesServed:     { id: "countriesServed",      value: "3",      label: "continents served",      verified: false },
  clientSatisfaction:  { id: "clientSatisfaction",   value: "98%",    label: "client satisfaction",    verified: false },
};

/** Renders the verified value, or an em dash if the claim isn't sourced yet. */
export function displayStat(id: keyof typeof STATS): string {
  const stat = STATS[id];
  return stat.verified ? stat.value : "—";
}
