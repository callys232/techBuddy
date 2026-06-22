import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies TechAgency uses, why, and how to control them.",
};

const LAST_UPDATED = "1 June 2026";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--fg)] mb-2">Cookie Policy</h1>
        <p className="text-sm text-[var(--fg)]/40 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-[var(--fg)]/75 text-[15px] leading-[1.85]">

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They allow websites to remember your preferences and understand how you use the site. We also use similar technologies including local storage and session storage.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Cookies we use</h2>

            <div className="space-y-5 mt-4">
              {[
                {
                  type: "Strictly necessary",
                  consent: "No consent required",
                  color: "emerald",
                  items: [
                    { name: "theme", purpose: "Stores your dark/light mode preference", duration: "1 year" },
                    { name: "NEXT_LOCALE", purpose: "Stores your language preference", duration: "Session" },
                  ],
                },
                {
                  type: "Analytics",
                  consent: "Consent required",
                  color: "amber",
                  items: [
                    { name: "ph_*", purpose: "PostHog analytics — tracks page views, sessions, and feature usage in aggregate", duration: "1 year" },
                  ],
                },
                {
                  type: "Functional",
                  consent: "No consent required",
                  color: "sky",
                  items: [
                    { name: "quote_draft", purpose: "Saves your in-progress quote form so you don't lose it", duration: "7 days" },
                  ],
                },
              ].map(({ type, consent, color, items }) => (
                <div key={type} className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)]">
                    <p className="font-heading font-semibold text-[var(--fg)] text-sm">{type}</p>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.15em] text-${color}-400`}>
                      {consent}
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {items.map(({ name, purpose, duration }) => (
                      <div key={name} className="grid grid-cols-3 gap-4 px-4 py-3 text-xs">
                        <span className="font-mono text-[var(--primary)]">{name}</span>
                        <span className="text-[var(--fg)]/60 col-span-1">{purpose}</span>
                        <span className="text-[var(--fg)]/40 text-right">{duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Managing cookies</h2>
            <p>
              You can control and delete cookies through your browser settings. Note that disabling strictly necessary cookies may affect the functionality of our website.
            </p>
            <p className="mt-3">To opt out of analytics tracking, you can:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-[var(--fg)]/65">
              <li>Use your browser&apos;s "Do Not Track" setting (we honour this signal)</li>
              <li>Install a browser ad blocker that blocks analytics scripts</li>
              <li>Email <strong className="text-[var(--fg)]">privacy@techagency.africa</strong> to request removal of your analytics data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Third-party cookies</h2>
            <p>
              We do not allow third-party advertising networks to place cookies on our website. The only third-party analytics tool we use is PostHog, which we operate in a privacy-preserving configuration. See our <Link href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link> for full details of third-party processors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Contact</h2>
            <p>
              Questions about our cookie use? Email <strong className="text-[var(--fg)]">privacy@techagency.africa</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
