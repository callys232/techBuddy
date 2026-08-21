import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/dashboard", "/store", "/templates/success", "/quote/confirm"],
    },
    sitemap: "https://techbuddy.ng/sitemap.xml",
  };
}
