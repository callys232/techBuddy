import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are a professional cover letter writer. Given a candidate's name, the role/company they're applying to, and their key strengths/achievements, write a complete, ready-to-send cover letter.

Rules:
- 3-4 paragraphs: opening hook, relevant experience/achievements tied to the role, why this company specifically (if named), confident closing with a call to action.
- Use only the facts given — never invent specific employers, metrics, or credentials not provided.
- Professional but not stiff; no clichés like "I am writing to express my interest."
- Match the requested tone.
- Return ONLY the letter body text, no subject line, no markdown, no placeholder brackets left unfilled — if information is missing, write around it gracefully instead of leaving a blank.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Cover letter generation is not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const { name, role, company, strengths, tone } = body ?? {};

  if (!name?.trim() || !role?.trim() || !strengths?.trim()) {
    return NextResponse.json({ error: "name, role and strengths are required" }, { status: 400 });
  }

  const userPrompt = `Candidate name: ${name}
Applying for: ${role}${company ? ` at ${company}` : ""}
Key strengths / achievements: ${strengths}
Tone: ${tone ?? "professional"}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const letter = message.content[0]?.type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ letter });
  } catch (err: unknown) {
    const messageText = err instanceof Error ? err.message : "Could not generate cover letter";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }
}
