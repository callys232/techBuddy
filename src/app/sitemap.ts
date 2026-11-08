import type { MetadataRoute } from "next";
import { ALL_POSTS } from "@/mock/blog";
import { ALL_SERVICE_SLUGS } from "@/mock/services";

const BASE = "https://techbuddy.ng";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const routes: Array<{ path: string; freq: Freq; priority: number }> = [
  { path: "",                          freq: "weekly",  priority: 1.0 },
  { path: "/services",                 freq: "monthly", priority: 0.9 },
  { path: "/pricing",                  freq: "monthly", priority: 0.9 },
  { path: "/portfolio",                freq: "weekly",  priority: 0.9 },
  { path: "/templates",                freq: "monthly", priority: 0.8 },
  { path: "/blog",                     freq: "weekly",  priority: 0.8 },
  { path: "/news",                     freq: "daily",   priority: 0.7 },
  { path: "/devops",                   freq: "monthly", priority: 0.8 },
  { path: "/about",                    freq: "monthly", priority: 0.7 },
  { path: "/talent",                   freq: "weekly",  priority: 0.7 },
  { path: "/invest",                   freq: "monthly", priority: 0.7 },
  { path: "/invest/apply",             freq: "monthly", priority: 0.5 },
  { path: "/contact",                  freq: "yearly",  priority: 0.6 },
  { path: "/quote",                    freq: "monthly", priority: 0.6 },

  // Free tools — high-intent acquisition pages
  { path: "/tools",                    freq: "monthly", priority: 0.8 },
  { path: "/tools/resume-maker",       freq: "monthly", priority: 0.8 },
  { path: "/tools/sport-predictor",    freq: "weekly",  priority: 0.7 },
  { path: "/tools/free-audit",         freq: "monthly", priority: 0.7 },
  { path: "/tools/cost-estimator",     freq: "monthly", priority: 0.6 },
  { path: "/tools/mvp-scope",          freq: "monthly", priority: 0.6 },
  { path: "/tools/stack-picker",       freq: "monthly", priority: 0.6 },
  { path: "/tools/timeline-estimator", freq: "monthly", priority: 0.6 },
  { path: "/tools/build-vs-buy",       freq: "monthly", priority: 0.6 },
  { path: "/tools/ndpr-checker",       freq: "monthly", priority: 0.6 },
  { path: "/tools/pmf-score",          freq: "monthly", priority: 0.6 },
  { path: "/tools/qr-code-generator",       freq: "monthly", priority: 0.7 },
  { path: "/tools/invoice-generator",       freq: "monthly", priority: 0.7 },
  { path: "/tools/name-generator",          freq: "monthly", priority: 0.7 },
  { path: "/tools/cover-letter-generator",  freq: "monthly", priority: 0.7 },
  { path: "/tools/business-plan-generator", freq: "monthly", priority: 0.6 },
  { path: "/tools/premium-audit",           freq: "monthly", priority: 0.6 },
  { path: "/tools/whatsapp-bot-builder",    freq: "monthly", priority: 0.6 },
  { path: "/tools/telegram-bot-builder",    freq: "monthly", priority: 0.6 },

  // Legal
  { path: "/privacy",                  freq: "yearly",  priority: 0.3 },
  { path: "/terms",                    freq: "yearly",  priority: 0.3 },
  { path: "/cookies",                  freq: "yearly",  priority: 0.3 },
  { path: "/ndpr",                     freq: "yearly",  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = routes.map(({ path, freq, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  const serviceEntries = ALL_SERVICE_SLUGS.map((slug) => ({
    url: `${BASE}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as Freq,
    priority: 0.6,
  }));

  const blogEntries = ALL_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as Freq,
    priority: 0.5,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
