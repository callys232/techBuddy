import type { Metadata } from "next";
import { TeamCard } from "@/components/ui/TeamCard";
import { ContactForm } from "@/components/sections/ContactForm";
import { TEAM_MEMBERS } from "@/mock/team";

export const metadata: Metadata = {
  title: "Contact — Work With Nigeria's Leading Product Studio",
  description:
    "Book a 30-minute discovery call or send a message. Lagos-based, globally accessible. We reply within 24 hours. Talk to real engineers — no account managers.",
  keywords: [
    "contact tech agency Nigeria", "hire Nigerian developers",
    "Lagos software company contact", "book discovery call Africa",
  ],
  openGraph: {
    title: "Let's Build Together | Contact TechAgency Africa",
    description:
      "Lagos-based product studio. Book a call or drop a message — we reply within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <section className="px-[var(--container-px)] py-[var(--section-y)]">
        <h1 className="font-display text-[var(--text-display)] font-extrabold text-[var(--fg)] leading-none mb-16">
          Let&apos;s Build Together
        </h1>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — info + team */}
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-4">Contact Info</h2>
              <ul className="space-y-3 text-[var(--fg)]/70">
                <li>hello@techagency.africa</li>
                <li>Response within 24 hours</li>
                <li>Lagos, Nigeria · Remote-first</li>
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-6">Meet the Team</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEAM_MEMBERS.map((member) => (
                  <TeamCard key={member.name} {...member} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-[var(--fg)]">Send a Message</h2>
            <ContactForm />

            {/* Calendar embed placeholder */}
            <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <p className="font-display text-lg font-bold text-[var(--fg)] mb-2">
                Book a Discovery Call
              </p>
              <p className="text-sm text-[var(--fg)]/50 mb-4">
                30 minutes · Cal.com
              </p>
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--primary)] px-6 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--bg)] transition-all"
              >
                Pick a time
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
