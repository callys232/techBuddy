import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of TechAgency's website, tools, and professional services.",
};

const LAST_UPDATED = "1 June 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-[var(--fg)] mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--fg)]/40 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-[var(--fg)]/75 text-[15px] leading-[1.85]">
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">1. Acceptance of terms</h2>
            <p>
              By accessing techagency.africa or engaging TechAgency Africa for services, you agree to these Terms of Service. If you are accepting on behalf of a company or other legal entity, you represent that you have authority to bind that entity. These terms are governed by the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">2. Services</h2>
            <p>
              TechAgency provides digital product development services including web and mobile application development, DevOps infrastructure, UI/UX design, AI integration, and related professional services ("Services"). The specific scope, timeline, deliverables, and pricing for each engagement are set out in a separate Statement of Work (SoW) or Service Agreement.
            </p>
            <p className="mt-3">
              Use of our free tools (cost estimator, stack picker, free audit) is subject to these Terms. These tools provide estimates only and do not constitute a binding quote.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">3. Payment terms</h2>
            <p>
              Unless otherwise agreed in writing, our payment terms are: 50% advance payment before work begins, 25% at the midpoint milestone, and 25% on final delivery. Advance payments are non-refundable once a sprint has commenced.
            </p>
            <p className="mt-3">
              Template purchases made through the website are processed via Paystack and are non-refundable once the template has been delivered or a GitHub repository access has been granted.
            </p>
            <p className="mt-3">
              Late payments (beyond 14 days of invoice date) may attract a 2% monthly interest charge. We reserve the right to suspend work on active projects where invoices are overdue by more than 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">4. Intellectual property</h2>
            <p>
              Upon receipt of full payment, all custom code and assets created specifically for your project transfer to you as the client. This excludes: (a) open-source components used under their respective licences, (b) TechAgency's proprietary frameworks, boilerplates, and tooling which we license to you for use in your project but retain ownership of, and (c) third-party templates or assets licensed separately.
            </p>
            <p className="mt-3">
              TechAgency retains the right to display the project in our portfolio and marketing materials unless you request confidentiality in writing before project commencement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">5. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any non-public information disclosed during the engagement. This obligation survives termination of the agreement for two years. TechAgency will sign an NDA upon request before any project discovery session.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">6. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by Nigerian law, TechAgency&apos;s total liability for any claim arising out of these Terms or any service engagement shall not exceed the total fees paid by you in the three months preceding the claim. TechAgency shall not be liable for indirect, incidental, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">7. Website use</h2>
            <p>
              You may use our website for lawful purposes only. You must not: transmit any malicious code, attempt to gain unauthorised access to our systems, scrape our content in bulk, or use our tools to build a competing service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">8. Dispute resolution</h2>
            <p>
              Disputes shall first be addressed by good-faith negotiation between the parties. If unresolved within 30 days, disputes shall be referred to mediation under the Lagos Multi-Door Courthouse (LMDC) rules. Litigation as a first step is expressly waived by both parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">9. Changes to these terms</h2>
            <p>
              We may update these Terms at any time. Continued use of our website or services after changes are published constitutes acceptance of the revised Terms. Active client engagements are governed by the Terms in effect at the date of the SoW unless both parties agree to updated Terms in writing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--fg)] mb-3">10. Contact</h2>
            <p>
              TechAgency Africa · hello@techagency.africa · Lagos, Nigeria<br />
              For legal notices: legal@techagency.africa
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
