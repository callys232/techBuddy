import type { Metadata } from "next";
import { WhatsappBotBuilder } from "@/components/sections/WhatsappBotBuilder";
import { ShareTool } from "@/components/ui/ShareTool";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "WhatsApp Bot Flow Builder — Design Your Auto-Reply Menu Free",
  description:
    "Design your WhatsApp auto-reply flow — welcome message, menu options and replies — with a live chat preview. Send it to our team to deploy on WhatsApp Business API.",
  keywords: [
    "whatsapp bot builder", "whatsapp auto reply",
    "whatsapp business api", "whatsapp chatbot flow",
  ],
  openGraph: {
    images: [OG_IMAGE],
    title: "WhatsApp Bot Flow Builder — Design It Free | TechBuddy",
    description: "Build your auto-reply menu with a live chat preview. We deploy it on WhatsApp Business API.",
  },
};

export default function WhatsappBotBuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-6xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            WhatsApp Bot Flow Builder
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Design your auto-reply menu — welcome message, options and replies — with a live preview. We deploy it live on WhatsApp Business API.
          </p>
          <WhatsappBotBuilder />
          <ShareTool toolName="WhatsApp Bot Builder" className="mt-12" />
        </div>
      </section>
    </div>
  );
}
