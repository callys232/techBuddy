import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isEmailSubscribed } from "@/lib/subscription";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are a startup consultant who writes structured, investor-ready business plans for African founders. Given a business idea, industry, target market, stage, and funding ask, produce a structured plan.

Rules:
- Be concrete and specific to the idea given — never generic filler.
- Where you don't have enough information to state a real number, describe the approach instead of inventing a fake statistic.
- Each section is 2-4 sentences, direct, no fluff.
- Return ONLY a JSON object with these exact keys, nothing else — no markdown fences, no preamble:
{"executiveSummary": "...", "problem": "...", "solution": "...", "marketAnalysis": "...", "businessModel": "...", "goToMarket": "...", "financialSummary": "...", "team": "...", "ask": "..."}`;

interface BusinessPlanInput {
  idea: string;
  industry: string;
  targetMarket: string;
  stage: string;
  fundingAsk: string;
  team: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Business plan generation is not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const input = body?.input as BusinessPlanInput | undefined;

  if (!email || !input?.idea?.trim()) {
    return NextResponse.json({ error: "email and a business idea are required" }, { status: 400 });
  }

  const subscribed = await isEmailSubscribed(email);
  if (!subscribed) {
    return NextResponse.json({ error: "The AI Business Plan Generator is a TechBuddy Premium feature" }, { status: 403 });
  }

  const allowed = await checkRateLimit("business-plan", getClientIp(req), 10);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  const userPrompt = `Idea: ${input.idea}
Industry: ${input.industry || "Not specified"}
Target market: ${input.targetMarket || "Not specified"}
Stage: ${input.stage || "Not specified"}
Funding ask: ${input.fundingAsk || "Not raising / not specified"}
Team: ${input.team || "Not specified"}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "{}";
    const cleaned = text.trim().replace(/^```json\s*|```$/g, "");
    const plan = JSON.parse(cleaned);

    return NextResponse.json({ plan });
  } catch (err: unknown) {
    const messageText = err instanceof Error ? err.message : "Could not generate business plan";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }
}
