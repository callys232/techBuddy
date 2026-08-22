import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  IconBrandAndroid,
  IconBrandWindows,
  IconShieldCheck,
  IconAlertTriangle,
  IconLock,
} from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { APPS } from "@/mock/apps";

export const metadata: Metadata = {
  title: "Free Apps — Android & Windows Downloads",
  description:
    "Free desktop and mobile apps built by TechAgency — starting with Device Cleaner, a privacy-first storage utility with no ads, no tracking, and no internet permission.",
  keywords: ["device cleaner app", "free android app", "free windows app", "duplicate file finder"],
  openGraph: {
    title: "Free Apps by TechAgency — Android & Windows",
    description: "Privacy-first utility apps, free to download. No ads, no tracking.",
  },
};

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[var(--section-y)] pb-16 text-center">
        <PageVectors variant="center" intensity={0.38} />
        <div className="relative z-10 mx-auto max-w-2xl px-[var(--container-px)]">
          <p className="eyebrow justify-center mb-6">Free apps</p>
          <h1 className="h-display mb-4">
            Apps We&apos;ve <span className="text-[var(--brand)]">Built &amp; Ship</span>
          </h1>
          <p className="text-[var(--ink-muted)] text-lg leading-relaxed">
            Free utility apps for Android and Windows. No ads, no tracking, no account required —
            downloadable directly from here.
          </p>
        </div>
      </section>

      {APPS.map((app) => (
        <div key={app.slug}>

          {/* ── App hero + download ──────────────────────────────────────── */}
          <RevealSection>
          <section className="py-10">
            <div className="mx-auto max-w-5xl px-[var(--container-px)]">
              <div className="card p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-8">
                  <div className="h-16 w-16 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <Image src={app.icon} alt={`${app.name} icon`} width={64} height={64} className="h-full w-full" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-extrabold text-[var(--ink)]">{app.name}</h2>
                    <p className="text-sm text-[var(--ink-muted)] mt-1">{app.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--ink)]/70 leading-relaxed mb-8 max-w-2xl">
                  {app.description}
                </p>

                {/* Download buttons */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <a
                    href={app.android.downloadHref}
                    download
                    className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--brand)]/60 transition-colors"
                  >
                    <IconBrandAndroid size={28} className="text-emerald-500 shrink-0" />
                    <span className="flex-1">
                      <span className="block font-heading font-bold text-[var(--ink)]">Download for Android</span>
                      <span className="block text-xs text-[var(--ink-faint)] mt-0.5">APK · {app.android.fileSizeLabel} · direct install</span>
                    </span>
                  </a>
                  <a
                    href={app.windows.downloadHref}
                    download
                    className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--brand)]/60 transition-colors"
                  >
                    <IconBrandWindows size={26} className="text-sky-500 shrink-0" />
                    <span className="flex-1">
                      <span className="block font-heading font-bold text-[var(--ink)]">Download for Windows</span>
                      <span className="block text-xs text-[var(--ink-faint)] mt-0.5">.exe · {app.windows.fileSizeLabel} · direct install</span>
                    </span>
                  </a>
                </div>

                {app.android.playStoreHref && (
                  <a href={app.android.playStoreHref} target="_blank" rel="noopener noreferrer"
                     className="inline-block text-sm font-semibold text-[var(--brand)] hover:underline mb-6">
                    Also on Google Play →
                  </a>
                )}

                {/* Honest friction disclosure */}
                <div className="flex items-start gap-2.5 rounded-lg bg-[var(--warn)]/8 border border-[var(--warn)]/25 px-4 py-3 mb-6">
                  <IconAlertTriangle size={15} className="text-[var(--warn)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--ink)]/70 leading-relaxed">
                    Not yet on the Play Store, so Android will warn about installing from an unknown
                    source — tap &quot;Install anyway.&quot; The Windows build isn&apos;t code-signed
                    yet either, so SmartScreen may flag it — click &quot;More info&quot; → &quot;Run anyway.&quot;
                    Both are expected for a new, independently distributed app.
                  </p>
                </div>

                {/* Privacy strip */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--ink-muted)]">
                  <span className="flex items-center gap-1.5"><IconShieldCheck size={14} className="text-[var(--brand)]" />No ads or tracking</span>
                  <span className="flex items-center gap-1.5"><IconLock size={14} className="text-[var(--brand)]" />No account required</span>
                  <Link href={app.privacyHref} className="font-semibold text-[var(--brand)] hover:underline">
                    Read the privacy policy →
                  </Link>
                </div>
              </div>
            </div>
          </section>
          </RevealSection>

          {/* ── Screenshots ──────────────────────────────────────────────── */}
          <RevealSection delay={0.05}>
          <section className="py-10 bg-[var(--surface)]">
            <div className="mx-auto max-w-5xl px-[var(--container-px)]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {app.screenshots.map((s) => (
                  <div key={s.src} className="rounded-xl border border-[var(--border)] overflow-hidden">
                    <Image src={s.src} alt={s.alt} width={400} height={860} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </div>
          </section>
          </RevealSection>

          {/* ── Features ─────────────────────────────────────────────────── */}
          <RevealSection delay={0.05}>
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-[var(--container-px)]">
              <p className="eyebrow mb-5">What it does</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {app.features.map((f) => (
                  <div key={f.title} className="card-interactive p-5">
                    <p className="font-heading font-bold text-[var(--ink)] mb-1.5">{f.title}</p>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </RevealSection>

        </div>
      ))}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <RevealSection delay={0.05}>
      <section className="py-16 bg-[var(--surface)] text-center">
        <div className="mx-auto max-w-2xl px-[var(--container-px)]">
          <h2 className="h-section mb-4">Want an app like this built for you?</h2>
          <p className="text-[var(--ink-muted)] mb-8">
            We build native Android and Windows apps for other businesses too — from utilities to full products.
          </p>
          <Link href="/quote?service=Mobile%20Apps" className="btn-primary h-12 px-8">
            Get a free quote
          </Link>
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
