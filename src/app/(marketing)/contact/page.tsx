import type { Metadata } from "next";
import { TeamCard } from "@/components/ui/TeamCard";
import { ContactForm } from "@/components/sections/ContactForm";
import { TEAM_MEMBERS } from "@/mock/team";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Contact — Work With a Lagos-Born, Globally-Minded Product Studio",
  description:
    "Book a 30-minute discovery call or send a message. Lagos-based, globally accessible. We reply within 24 hours. Talk to real engineers — no account managers.",
  keywords: [
    "contact tech agency", "hire African developers",
    "Lagos software company contact", "book discovery call",
  ],
  openGraph: {
    title: "Let's Build Together | Contact TechAgency",
    description:
      "Lagos-born product studio, working worldwide. Book a call or drop a message — we reply within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <section className="relative overflow-hidden px-[var(--container-px)] py-[var(--section-y)]">
        <PageVectors variant="flow" intensity={0.35} />
        <div className="relative z-10">
        <h1 className="h-display mb-16">
          Let&apos;s Build Together
        </h1>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — info + team */}
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)] mb-4">Contact Info</h2>
              <ul className="space-y-3 text-[var(--ink)]/70">
                <li>hello@techagency.africa</li>
                <li>Response within 24 hours</li>
                <li>Lagos, Nigeria · Remote-first</li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)] mb-6">Meet the Team</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEAM_MEMBERS.map((member) => (
                  <TeamCard key={member.name} {...member} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-[var(--ink)]">Send a Message</h2>
            <ContactForm />

            {/* Calendar booking */}
            <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="font-display text-lg font-bold text-[var(--ink)] mb-1">
                Book a Discovery Call
              </p>
              <p className="text-sm text-[var(--ink)]/50 mb-1">30 minutes · Free · No sales pitch</p>
              <p className="text-xs text-[var(--ink)]/35 mb-5">
                Talk directly to an engineer. We&apos;ll scope your project and give you a realistic estimate on the call.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/techagencyafrica/discovery"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary h-10 px-6 text-sm"
                >
                  Pick a time
                </a>
                <a
                  href={`mailto:hello@techagency.africa?subject=Discovery call request`}
                  className="btn-ghost h-10 px-6 text-sm"
                >
                  Email instead
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
