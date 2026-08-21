import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isEmailSubscribed } from "@/lib/subscription";
import { isUnlocked } from "@/lib/store";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getVerifiedEmail } from "@/lib/auth";
import type { ResumeData } from "@/types/resume";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are a professional resume reviewer. Given a candidate's resume data as JSON, return 4-6 concrete, specific improvement suggestions — never generic advice like "add more detail" or "use action verbs."

Rules:
- Reference the actual content you were given (a specific job title, project, or bullet point).
- Prioritise: missing metrics/numbers in experience bullets, weak or vague summary, thin skills section relative to the role, missing sections that would strengthen this specific resume (projects, certifications) if empty.
- Each suggestion is one sentence, direct, actionable.
- Return ONLY a JSON array of strings, nothing else — no markdown fences, no preamble.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI suggestions not configured" }, { status: 503 });
  }

  const email = await getVerifiedEmail(req);
  if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const resumeData = body?.resumeData as ResumeData | undefined;

  if (!resumeData) {
    return NextResponse.json({ error: "resumeData is required" }, { status: 400 });
  }

  const hasAccess = (await isEmailSubscribed(email)) || (await isUnlocked(email, "resume-premium-templates"));
  if (!hasAccess) {
    return NextResponse.json({ error: "AI suggestions are a Resume Premium feature" }, { status: 403 });
  }

  const allowed = await checkRateLimit("resume-suggest", getClientIp(req), 10);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests — try again in a minute." }, { status: 429 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(resumeData) }],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "[]";
    const cleaned = text.trim().replace(/^```json\s*|```$/g, "");
    const suggestions: string[] = JSON.parse(cleaned);

    return NextResponse.json({ suggestions });
  } catch (err: unknown) {
    const messageText = err instanceof Error ? err.message : "Failed to generate suggestions";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }
}
