import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | undefined;

/** Lazy singleton — created on first real use, not at module load, so a
 *  build/prerender pass with no Sanity env vars configured doesn't crash. */
export function getSanityClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    throw new Error("Sanity is not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID.");
  }
  if (!client) {
    client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-06-01",
      useCdn: process.env.NODE_ENV === "production",
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return client;
}
