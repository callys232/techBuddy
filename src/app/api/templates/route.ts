import { NextResponse } from "next/server";
import { CATEGORY_PRICE_RANGE, type ExternalTemplate } from "@/mock/templates";

/**
 * Live template discovery engine — pulls trending, permissively-licensed
 * repos from the GitHub Search API (public, free, ToS-compliant). This
 * deliberately does NOT scrape ThemeForest/Envato: their Terms of Service
 * prohibit automated scraping, so those stay hand-curated in mock/templates.ts.
 */
export const revalidate = 21600; // 6 hours — GitHub search has a tight unauthenticated rate limit

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const PERMISSIVE_LICENSES = new Set(["mit", "apache-2.0", "bsd-3-clause", "bsd-2-clause", "isc"]);

interface CategoryQuery {
  type: string;
  query: string;
}

const CATEGORY_QUERIES: CategoryQuery[] = [
  { type: "landing",   query: "nextjs landing page template in:name,description,topics" },
  { type: "saas",      query: "nextjs saas starter template in:name,description,topics" },
  { type: "ecommerce", query: "nextjs ecommerce store template in:name,description,topics" },
  { type: "portfolio", query: "nextjs portfolio template in:name,description,topics" },
  { type: "blog",      query: "nextjs blog mdx template in:name,description,topics" },
  { type: "dashboard", query: "nextjs admin dashboard template in:name,description,topics" },
  { type: "mobile",    query: "react-native expo starter template in:name,description,topics" },
];

interface GithubRepo {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  license: { spdx_id: string } | null;
}

interface GithubSearchResponse {
  items?: GithubRepo[];
}

async function fetchCategory({ type, query }: CategoryQuery): Promise<ExternalTemplate[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=6`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "techbuddy-templates-engine",
      ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) throw new Error(`GitHub search ${res.status}`);

  const data: GithubSearchResponse = await res.json();
  const priceRange = CATEGORY_PRICE_RANGE[type] ?? { min: 300, max: 1000 };

  return (data.items ?? [])
    .filter((r) => !r.fork && r.stargazers_count >= 20)
    .filter((r) => !r.license || PERMISSIVE_LICENSES.has(r.license.spdx_id.toLowerCase()))
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      type,
      priceRange,
      features: [r.license?.spdx_id?.toUpperCase() ?? "Open source", `${r.stargazers_count.toLocaleString()} stars`],
      image: `https://opengraph.githubassets.com/1/${r.full_name}`,
      source: "github" as const,
      sourceLabel: "GitHub (Live)",
      sourceUrl: r.html_url,
      originalPrice: "Free",
      stars: r.stargazers_count,
    }));
}

export async function GET() {
  const results = await Promise.allSettled(CATEGORY_QUERIES.map(fetchCategory));

  const seen = new Set<string>();
  const templates: ExternalTemplate[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const t of result.value) {
      if (seen.has(t.sourceUrl)) continue;
      seen.add(t.sourceUrl);
      templates.push(t);
    }
  }

  templates.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));

  return NextResponse.json({
    templates: templates.slice(0, 24),
    fetchedAt: new Date().toISOString(),
  });
}
