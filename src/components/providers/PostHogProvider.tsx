"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

    if (!key) return;

    posthog.init(key, {
      api_host:             host,
      capture_pageview:     false,  // manual pageview tracking below
      capture_pageleave:    true,
      persistence:          "localStorage",
      respect_dnt:          true,
    });

    /* Track initial pageview */
    posthog.capture("$pageview");

    /* Track subsequent client-side navigations */
    const handleNav = () => posthog.capture("$pageview");
    window.addEventListener("popstate", handleNav);
    return () => window.removeEventListener("popstate", handleNav);
  }, []);

  return <>{children}</>;
}
