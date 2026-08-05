import type { Metadata } from "next";
import { QrCodeGenerator } from "@/components/sections/QrCodeGenerator";

export const metadata: Metadata = {
  title: "Free QR Code Generator — Links, WiFi, WhatsApp & vCards",
  description:
    "Generate a QR code for a link, WiFi network, WhatsApp chat, email, phone number or contact card. Customise the colour and download as PNG or SVG — free, instant, no sign-up.",
  keywords: [
    "free qr code generator", "qr code maker",
    "wifi qr code generator", "whatsapp qr code",
    "vcard qr code generator",
  ],
};

export default function QrCodeGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Free Tool</p>
          <h1 className="font-heading text-[var(--text-display)] font-extrabold text-[var(--ink)] leading-[1.05] mb-3 max-w-2xl">
            QR Code Generator
          </h1>
          <p className="text-[var(--ink-muted)] max-w-xl mb-10 leading-relaxed">
            Links, WiFi networks, WhatsApp chats, contact cards and more — generate a QR code instantly and download it as PNG or SVG.
          </p>
          <QrCodeGenerator />
        </div>
      </section>
    </div>
  );
}
