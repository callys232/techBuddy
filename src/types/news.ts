export type NewsCategory = "Africa" | "Global" | "Fintech" | "AI" | "Crypto" | "General";

export interface NormalizedArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceName: string;
  publishedAt: string; // ISO 8601
  imageUrl?: string;
  category: NewsCategory;
}

export interface NewsApiResponse {
  articles: NormalizedArticle[];
  fetchedAt: string;
}
