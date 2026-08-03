import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { NormalizedArticle, NewsCategory } from "@/types/news";

export const revalidate = 1800;

const parser = new Parser({
  timeout: 8000,
  headers: { Accept: "application/rss+xml, application/xml, text/xml" },
});

interface FeedSource {
  url: string;
  name: string;
  defaultCategory: NewsCategory;
}

const FEEDS: FeedSource[] = [
  { url: "https://techcrunch.com/feed/", name: "TechCrunch", defaultCategory: "Global" },
  { url: "http://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Technology", defaultCategory: "Global" },
  { url: "https://thenextweb.com/feed/", name: "The Next Web", defaultCategory: "Global" },
  { url: "https://techpoint.africa/feed/", name: "Techpoint Africa", defaultCategory: "Africa" },
  { url: "https://disrupt-africa.com/feed/", name: "Disrupt Africa", defaultCategory: "Africa" },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", name: "CoinDesk", defaultCategory: "Crypto" },
  { url: "https://cointelegraph.com/rss", name: "CoinTelegraph", defaultCategory: "Crypto" },
  { url: "https://decrypt.co/feed", name: "Decrypt", defaultCategory: "Crypto" },
];

const FINTECH_KEYWORDS = ["fintech", "payment", "payments", "banking", "bank", "financial", "finance", "wallet", "transfer", "lending", "loan", "credit", "insurtech"];
const AI_KEYWORDS = ["artificial intelligence", "machine learning", "ai ", " ai,", "deep learning", "neural", "llm", "gpt", "chatgpt", "openai", "large language"];
const CRYPTO_KEYWORDS = ["crypto", "bitcoin", "btc", "ethereum", "eth ", "blockchain", "defi", "altcoin", "token", "web3", "nft", "stablecoin", "solana", "binance", "coinbase", "trading", "bull run", "bear market"];

function detectCategory(text: string, defaultCategory: NewsCategory): NewsCategory {
  const lower = text.toLowerCase();

  if (defaultCategory === "Crypto" || CRYPTO_KEYWORDS.some((kw) => lower.includes(kw))) return "Crypto";
  if (AI_KEYWORDS.some((kw) => lower.includes(kw))) return "AI";
  if (FINTECH_KEYWORDS.some((kw) => lower.includes(kw))) return "Fintech";
  return defaultCategory;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

function extractImageUrl(item: Parser.Item): string | undefined {
  // rss-parser exposes enclosure and content:encoded fields
  const enclosure = (item as Record<string, unknown>).enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image/")) {
    return enclosure.url;
  }

  const mediaContent = (item as Record<string, unknown>)["media:content"] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const mediaThumbnail = (item as Record<string, unknown>)["media:thumbnail"] as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

  // Try to extract from content
  const itemRecord = item as Record<string, unknown>;
  const content = (item.content ?? (itemRecord["content:encoded"] as string | undefined) ?? "");
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return undefined;
}

function buildId(url: string): string {
  return Buffer.from(url).toString("base64url").slice(0, 32);
}

async function fetchFeed(source: FeedSource): Promise<NormalizedArticle[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? []).slice(0, 20).map((item) => {
    const title = stripHtml(item.title ?? "Untitled");
    const summary = stripHtml(
      item.contentSnippet ?? item.summary ?? item.content ?? ""
    ).slice(0, 300);

    const url = item.link ?? item.guid ?? "";
    const publishedAt = item.isoDate ?? item.pubDate ?? new Date().toISOString();
    const imageUrl = extractImageUrl(item);

    const categoryText = `${title} ${summary}`.toLowerCase();
    const category = detectCategory(categoryText, source.defaultCategory);

    return {
      id: buildId(url),
      title,
      summary,
      url,
      source: source.url,
      sourceName: source.name,
      publishedAt,
      imageUrl,
      category,
    } satisfies NormalizedArticle;
  });
}

export async function GET() {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const articles: NormalizedArticle[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
    // Silently skip failed feeds
  }

  // Sort by publishedAt descending
  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const top45 = articles.slice(0, 45);

  return NextResponse.json({
    articles: top45,
    fetchedAt: new Date().toISOString(),
  });
}
