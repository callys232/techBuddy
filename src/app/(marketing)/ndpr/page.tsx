import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NDPR Compliance Statement",
  description: "TechAgency's compliance with the Nigeria Data Protection Regulation (NDPR) and Nigeria Data Protection Act 2023.",
};

const LAST_UPDATED = "1 June 2026";

export default function NdprPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Legal · Compliance</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--fg)] mb-2">NDPR Compliance Statement</h1>
        <p className="text-sm text-[var(--fg)]/40 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-[var(--fg)]/75 text-[15px] leading-[1.85]">

          <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-5">
            <p className="text-sm text-[var(--fg)]/80">
              This statement covers TechAgency Africa&apos;s compliance with the <strong className="text-[var(--fg)]">Nigeria Data Protection Regulation 2019 (NDPR)</strong> and the <strong className="text-[var(--fg)]">Nigeria Data Protection Act 2023 (NDPA)</strong>, which together form the primary data protection framework for Nigeria. We also build NDPR/NDPA compliance into every product we ship for clients.
            </p>
          </div>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Our compliance measures</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Lawful basis for every data point",
                  body: "We document the lawful basis (consent, contract, or legitimate interest) for every category of personal data we process. We do not collect data we cannot justify.",
                },
                {
                  title: "Consent management",
                  body: "Where we rely on consent, it is freely given, specific, informed, and unambiguous. We record consent timestamps and policy versions. Consent can be withdrawn at any time via email to privacy@techagency.africa.",
                },
                {
                  title: "Data minimisation",
                  body: "We collect only the minimum data required to deliver our services. Personal data is not shared between systems unnecessarily.",
                },
                {
                  title: "Encryption at rest and in transit",
                  body: "All personal data is encrypted at rest (AES-256) and transmitted exclusively over TLS 1.3. We do not store plaintext passwords or card numbers.",
                },
                {
                  title: "Data residency",
                  body: "Primary data storage is within infrastructure that complies with NDPA guidance on data residency for Nigerian citizens' personal data.",
                },
                {
                  title: "Access controls",
                  body: "Personal data is accessible only to team members who require it for their role. All access is protected by two-factor authentication and logged.",
                },
                {
                  title: "Breach notification",
                  body: "In the event of a data breach, we are committed to notifying NITDA within 72 hours and affected data subjects within 7 days, as required by the NDPA.",
                },
                {
                  title: "Third-party processor agreements",
                  body: "All third-party services that process personal data on our behalf have signed Data Processing Agreements (DPAs) or provide equivalent compliance commitments.",
                },
                {
                  title: "Data retention and deletion",
                  body: "We maintain a data retention schedule. Personal data is deleted when the retention period expires or upon request from the data subject.",
                },
                {
                  title: "Annual audit",
                  body: "We conduct an annual internal audit of our data processing activities and update our records of processing activities (ROPA) accordingly.",
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15">
                    <span className="block h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-[var(--fg)] mb-0.5">{title}</p>
                    <p className="text-sm text-[var(--fg)]/60 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">NDPR compliance in client projects</h2>
            <p>
              Every product we build for clients includes NDPR/NDPA compliance as a default, not an optional add-on. This includes: privacy policy templates, consent capture flows, data deletion workflows, cookie consent banners, and secure data handling practices. We will advise clients on their specific compliance obligations during the discovery phase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Your data subject rights</h2>
            <p>Under the NDPA 2023, you have the right to access, correct, delete, and port your personal data. See our full <Link href="/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link> for details on how to exercise these rights.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Complaints</h2>
            <p>
              If you believe we have not handled your data in accordance with the NDPA, please contact us first at <strong className="text-[var(--fg)]">privacy@techagency.africa</strong>. You also have the right to lodge a complaint directly with the Nigeria Data Protection Commission (NDPC) at <strong className="text-[var(--fg)]">ndpc.gov.ng</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">Contact</h2>
            <p>
              Data Protection Officer: <strong className="text-[var(--fg)]">privacy@techagency.africa</strong><br />
              TechAgency Africa · Lagos, Nigeria
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
