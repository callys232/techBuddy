import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/sign-in", "/sign-up"],
    },
    sitemap: "https://techbuddy.ng/sitemap.xml",
  };
}
