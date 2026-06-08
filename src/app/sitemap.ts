import type { MetadataRoute } from "next";

const BASE = "https://techbuddy.ng";

const routes: Array<{ path: string; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "",              freq: "weekly",  priority: 1.0 },
  { path: "/services",     freq: "monthly", priority: 0.9 },
  { path: "/portfolio",    freq: "weekly",  priority: 0.9 },
  { path: "/templates",    freq: "monthly", priority: 0.8 },
  { path: "/blog",         freq: "weekly",  priority: 0.8 },
  { path: "/devops",       freq: "monthly", priority: 0.8 },
  { path: "/talent",       freq: "weekly",  priority: 0.7 },
  { path: "/invest",       freq: "monthly", priority: 0.7 },
  { path: "/contact",      freq: "yearly",  priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map(({ path, freq, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
