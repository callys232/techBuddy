import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are a naming consultant for African startups and small businesses. Given a short description of a business idea and a style preference, generate 12 distinct name ideas.

Rules:
- Names should be short (1-3 words), easy to say, easy to spell, and not already extremely common generic terms.
- Each name gets a one-sentence tagline explaining why it fits.
- Match the requested style (modern/playful/professional/local) but keep every name plausible as a real registered business.
- Avoid names that are trademarks of well-known existing companies.
- Return ONLY a JSON array of objects: [{"name": "...", "tagline": "..."}], nothing else — no markdown fences, no preamble.`;

interface NameIdea {
  name: string;
  tagline: string;
}

/** DNS-over-HTTPS lookup — NXDOMAIN (status 3) is a reasonable signal a domain
 *  is unregistered. Not a whois check, so we always label this as a heuristic. */
async function checkDomain(domain: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.Status === 3; // NXDOMAIN → likely available
  } catch {
    return null; // unknown — surfaced as "couldn't check"
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Name generation is not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const description = body?.description as string | undefined;
  const style = (body?.style as string) ?? "modern";

  if (!description?.trim()) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  const allowed = await checkRateLimit("name-generator", getClientIp(req), 5);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Business idea: ${description}\nStyle: ${style}` }],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "[]";
    const cleaned = text.trim().replace(/^```json\s*|```$/g, "");
    const ideas: NameIdea[] = JSON.parse(cleaned);

    const withDomains = await Promise.all(
      ideas.slice(0, 12).map(async (idea) => {
        const slug = slugify(idea.name);
        const [com, ng, io] = await Promise.all([
          checkDomain(`${slug}.com`),
          checkDomain(`${slug}.ng`),
          checkDomain(`${slug}.io`),
        ]);
        return { ...idea, domains: { com, ng, io } };
      })
    );

    return NextResponse.json({ ideas: withDomains });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not generate names";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
