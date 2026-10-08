import type { Metadata } from "next";
import { PageVectors } from "@/components/bg/PageVectors";

export const metadata: Metadata = {
  title: "Device Cleaner — Privacy Policy",
  description: "Privacy policy for the Device Cleaner Android and Windows app. No data collection, no internet permission, no tracking.",
};

const LAST_UPDATED = "22 August 2026";

export default function DeviceCleanerPrivacyPage() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[var(--page)]">
      <PageVectors variant="minimal" intensity={0.5} />
      <div className="relative z-10 mx-auto max-w-3xl px-[var(--container-px)] py-[var(--section-y)]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">Device Cleaner · Legal</span>
        <h1 className="mt-3 h-display mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--ink)]/40 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-custom space-y-10 text-[var(--ink)]/75 text-[15px] leading-[1.85]">
          <section>
            <p>
              Device Cleaner (&quot;the app&quot;) is developed by TechBuddy (&quot;we&quot;, &quot;us&quot;).
              This policy explains how the app handles information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">Summary</h2>
            <p>
              The app does not collect, store, transmit, or share any personal data. It has no internet
              access permission and contains no analytics, advertising, or tracking software of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">What the app accesses, and why</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--ink)]/65">
              <li><strong className="text-[var(--ink)]">Battery level and storage space</strong> — read from your device using standard system APIs, shown only on your screen, never recorded or sent anywhere.</li>
              <li><strong className="text-[var(--ink)]">Folders you choose</strong> — when you tap &quot;Choose Folder,&quot; the system&apos;s built-in file picker lets you grant access to one specific folder. The app only reads and modifies files inside that folder, only after you pick it, and only to perform the action you requested. Nothing you select ever leaves your device.</li>
              <li><strong className="text-[var(--ink)]">The app&apos;s own cache</strong> — the app reports the size of its own temporary storage on your device.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">What the app does not do</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside text-[var(--ink)]/65">
              <li>It does not request internet access and cannot transmit data to any server.</li>
              <li>It does not use analytics, crash reporting, advertising, or any third-party SDKs.</li>
              <li>It does not require an account, login, or any personal information.</li>
              <li>It does not access files outside the folder you explicitly grant it, and it never accesses another app&apos;s private data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">Data sharing</h2>
            <p>Because the app collects no data, there is nothing to share with third parties, sell, or use for advertising.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">Children&apos;s privacy</h2>
            <p>The app does not knowingly collect information from anyone, including children, because it does not collect information at all.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">Changes to this policy</h2>
            <p>If this policy changes, the updated version will be posted at this same URL with a revised &quot;Last updated&quot; date.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[var(--ink)] mb-3">Contact</h2>
            <p>Questions about this policy can be sent to: calebflaka6@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
