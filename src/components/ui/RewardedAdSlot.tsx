"use client";

import { useEffect, useRef } from "react";

const SCRIPT_URL = process.env.NEXT_PUBLIC_AD_SCRIPT_URL;
const ZONE_ID = process.env.NEXT_PUBLIC_AD_ZONE_ID;

/** True once a real ad network is configured — lets callers switch their fallback UI on/off. */
export const AD_NETWORK_CONFIGURED = Boolean(SCRIPT_URL);

/**
 * Renders a real ad creative during the watch-ad reward flow. Currently
 * unconfigured — WatchAdModal pays out points for a 15s countdown with no ad
 * ever shown, which is a pure cost with no offsetting revenue.
 *
 * Works with any network using the standard <script src> + container
 * `<div data-zone>` embed pattern (Adsterra, PropellerAds, ExoClick, and most
 * rewarded-video networks all embed this way). To activate: sign up with a
 * network that offers rewarded/in-page video ads, then drop the script URL
 * and zone/publisher ID they give you into NEXT_PUBLIC_AD_SCRIPT_URL and
 * NEXT_PUBLIC_AD_ZONE_ID. Renders nothing when unconfigured, so the existing
 * countdown-only flow keeps working exactly as it does today.
 */
export function RewardedAdSlot({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SCRIPT_URL || !containerRef.current) return;
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    containerRef.current.appendChild(script);
    return () => { script.remove(); };
  }, []);

  if (!SCRIPT_URL) return null;

  return <div ref={containerRef} data-zone={ZONE_ID} className={className} />;
}
