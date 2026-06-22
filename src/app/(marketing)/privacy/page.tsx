import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TechAgency collects, stores, and protects your personal data in compliance with the Nigeria Data Protection Act 2023.",
};

const LAST_UPDATED = "1 June 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        {/* Header */}
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--fg)] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--fg)]/40 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-custom space-y-10 text-[var(--fg)]/75 text-[15px] leading-[1.85]">
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">1. Who we are</h2>
            <p>
              TechAgency Africa ("we", "our", "us") is a digital product studio registered in Nigeria. We operate the website at techagency.africa and related subdomains. Our contact address is: hello@techagency.africa.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">2. What data we collect</h2>
            <p>We collect the following categories of personal data when you use our website or engage our services:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--fg)]/65">
              <li><strong className="text-[var(--fg)]">Contact data</strong> — name, email address, phone number, WhatsApp number</li>
              <li><strong className="text-[var(--fg)]">Project data</strong> — your business description, project requirements, budget range, and timeline preferences submitted via our quote form</li>
              <li><strong className="text-[var(--fg)]">Communication data</strong> — messages you send via our contact form or email</li>
              <li><strong className="text-[var(--fg)]">Usage data</strong> — pages visited, time on site, device type, approximate location (city/country), and referral source, collected via analytics cookies</li>
              <li><strong className="text-[var(--fg)]">Newsletter data</strong> — email address and content preferences if you subscribe to our newsletter</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">3. How we use your data</h2>
            <p>We use your data only for the purposes described at the time of collection:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--fg)]/65">
              <li>To respond to your project enquiry and prepare a quote</li>
              <li>To send you transactional emails related to your project or account</li>
              <li>To send our newsletter (only if you explicitly subscribed)</li>
              <li>To improve our website and services using aggregated, anonymised analytics</li>
              <li>To comply with our legal obligations under the Nigeria Data Protection Act 2023 (NDPA)</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to third parties. We do not use your data for automated decision-making or profiling.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">4. Legal basis for processing</h2>
            <p>Under the NDPA 2023, we process your data on the following lawful bases:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--fg)]/65">
              <li><strong className="text-[var(--fg)]">Contract</strong> — processing necessary to fulfil a service agreement with you</li>
              <li><strong className="text-[var(--fg)]">Consent</strong> — newsletter subscriptions and non-essential analytics cookies (you may withdraw consent at any time)</li>
              <li><strong className="text-[var(--fg)]">Legitimate interests</strong> — responding to project enquiries, improving our services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">5. Data storage and security</h2>
            <p>
              Your data is stored in Supabase (PostgreSQL) infrastructure hosted within a region compliant with NDPA data residency guidance. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authorised team members only, protected by role-based access controls and two-factor authentication.
            </p>
            <p className="mt-3">
              We retain your enquiry and project data for three years from the end of our engagement, after which it is deleted. Newsletter subscriber data is retained until you unsubscribe. Analytics data is aggregated and anonymised within 26 months.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">6. Third-party service providers</h2>
            <p>We share data with the following processors under data processing agreements:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--fg)]/65">
              <li><strong className="text-[var(--fg)]">Supabase</strong> — database and authentication</li>
              <li><strong className="text-[var(--fg)]">Resend</strong> — transactional email delivery</li>
              <li><strong className="text-[var(--fg)]">Paystack</strong> — payment processing (for template purchases)</li>
              <li><strong className="text-[var(--fg)]">Vercel</strong> — website hosting and edge functions</li>
              <li><strong className="text-[var(--fg)]">PostHog</strong> — product analytics (self-hostable, GDPR/NDPA compliant)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">7. Your rights</h2>
            <p>Under the NDPA 2023, you have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--fg)]/65">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request erasure of your data ("right to be forgotten")</li>
              <li>Withdraw consent at any time (for consent-based processing)</li>
              <li>Object to processing based on legitimate interests</li>
              <li>Lodge a complaint with NITDA (Nigeria&apos;s data protection authority)</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <strong className="text-[var(--fg)]">privacy@techagency.africa</strong>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. We will notify subscribers by email of material changes at least 14 days before they take effect. The "last updated" date at the top of this page always reflects the current version.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">9. Contact</h2>
            <p>
              Data Controller: TechAgency Africa · hello@techagency.africa · Lagos, Nigeria<br />
              Data Protection Officer: privacy@techagency.africa
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
