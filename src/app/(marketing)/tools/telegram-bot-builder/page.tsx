import type { Metadata } from "next";
import { TelegramBotBuilder } from "@/components/sections/TelegramBotBuilder";
import { ShareTool } from "@/components/ui/ShareTool";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Telegram Bot Flow Builder — Design & Export Telegram Bots | TechBuddy",
  description:
    "Design and test your Telegram bot flow with slash commands, interactive inline keyboards, and automated notifications. Export production-grade Node.js and Python webhook code.",
  keywords: [
    "telegram bot builder",
    "telegram bot creator",
    "telegraf bot generator",
    "telegram inline keyboard",
    "telegram bot python",
    "telegram business automation",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "Telegram Bot Flow Builder — Premium Tool | TechBuddy",
    description:
      "Interactive Telegram bot designer with live phone mockup, slash commands, inline buttons, and production server code generation.",
  },
};

export default function TelegramBotBuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="eyebrow mb-0">Premium Tool</span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Paid Service · ₦2,500/mo or $5/mo
            </span>
          </div>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            Telegram Bot Flow Builder
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Design interactive Telegram bots with slash commands, inline keyboard buttons, live phone preview, and instant admin alerts. Export full production server code with TechBuddy Premium.
          </p>
          <TelegramBotBuilder />
          <ShareTool toolName="Telegram Bot Builder" className="mt-12" />
        </div>
      </section>
    </div>
  );
}

