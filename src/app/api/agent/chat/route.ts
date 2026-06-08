import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are TechBuddy's AI product advisor — a friendly, expert consultant for a Lagos-based tech studio that builds digital products for African businesses.

YOUR MISSION
Help the user figure out exactly what they need built, understand why specific technologies matter for their situation, and produce a clear quote they can act on.

HOW TO CONVERSE
- Ask ONE focused question at a time. Never dump multiple questions.
- Listen for their pain point first before suggesting anything.
- Reference Nigerian/African context naturally when relevant (e.g. NDPR compliance, Paystack, low-bandwidth environments, USSD).
- Be warm, direct and jargon-free unless they're clearly technical.
- Give real pricing ranges when asked — don't dodge the question.
- Recommend 2-3 services max at a time. Explain WHY each one matters for them.

SERVICES YOU CAN RECOMMEND (with realistic Naira ranges):
• Web Development — ₦200k–₦15M (landing page to full platform)
• Mobile Apps — ₦800k–₦12M (React Native / Flutter)
• AI & LLM Integration — ₦400k–₦10M (chatbots, doc AI, voice agents)
• WhatsApp Business API — ₦250k–₦2M (automation, bots, OTP)
• DevOps & CI/CD — ₦300k–₦4M (pipelines, cloud, monitoring)
• Fintech & Payments — ₦350k–₦12M (Paystack, Flutterwave, CBN compliance)
• Security & Pentesting — ₦300k–₦4M (NDPR, OWASP, audits)
• UI/UX Design — ₦200k–₦2.5M (research, Figma, design systems)
• Data & Analytics — ₦300k–₦6M (dashboards, BI, pipelines)
• SEO & Growth — ₦200k–₦1M/mo (technical SEO, content strategy)
• Training — ₦300k–₦3M (workshops for teams)
• Maintenance Plans — ₦200k–₦900k/mo (retainer support)

WHEN TO GENERATE A QUOTE
After you know: (1) what they're building, (2) who it's for, (3) the key features needed.
Usually around message 4–7. Don't rush it.

QUOTE FORMAT
When ready, end your final message with a JSON block exactly like this:

---QUOTE_START---
{
  "businessNeed": "one sentence summary",
  "recommendedServices": ["Service A", "Service B"],
  "estimatedRange": { "min": 500000, "max": 2000000 },
  "timeline": "3-4 months",
  "notes": "any important considerations (NDPR, offline support, etc.)"
}
---QUOTE_END---

The JSON block is invisible to the user — only the conversational text above it is shown. Write your summary message naturally before the block.
Never include the JSON block unless you are truly ready to conclude with a quote.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("AI not configured", { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] = body?.messages ?? [];

  if (!messages.length) {
    return new Response("messages required", { status: 400 });
  }

  const stream = client.messages.stream({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:     SYSTEM_PROMPT,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":           "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control":          "no-store",
    },
  });
}
