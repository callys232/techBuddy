import type { Metadata } from "next";
import { TeamCard } from "@/components/ui/TeamCard";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a discovery call, send a message, or reach us on WhatsApp.",
};

const TEAM = [
  { name: "Caleb Flaka", role: "Founder & CEO", photo: "/placeholder.png", linkedin: "#", twitter: "#" },
  { name: "Tech Lead", role: "Head of Engineering", photo: "/placeholder.png", linkedin: "#", twitter: "#" },
  { name: "Design Lead", role: "Head of Design", photo: "/placeholder.png", linkedin: "#", twitter: "#" },
];

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
                {TEAM.map((member) => (
                  <TeamCard key={member.name} {...member} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-[var(--fg)]">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>
              <select className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] focus:border-[var(--primary)] focus:outline-none transition-colors">
                <option value="">Department</option>
                <option value="sales">Sales</option>
                <option value="technical">Technical</option>
                <option value="partnerships">Partnerships</option>
                <option value="support">Support</option>
                <option value="press">Press</option>
              </select>
              <textarea
                rows={5}
                placeholder="Tell us about your project..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[var(--primary)] font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95"
              >
                Send message
              </button>
            </form>

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
