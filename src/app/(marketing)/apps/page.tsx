import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  IconBrandAndroid,
  IconBrandWindows,
  IconShieldCheck,
  IconAlertTriangle,
  IconLock,
  IconGauge,
  IconCopy,
  IconChartBar,
  IconFolders,
  IconDownload,
} from "@tabler/icons-react";
import { PageVectors } from "@/components/bg/PageVectors";
import { RevealSection } from "@/components/ui/ScrollReveal";
import { AppIconStage } from "@/components/ui/AppIconStage";
import { APPS, type AppFeatureIcon } from "@/mock/apps";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Free Apps — Android & Windows Downloads",
  description:
    "Free desktop and mobile apps built by TechBuddy — starting with Device Cleaner, a privacy-first storage utility with no ads, no tracking, and no internet permission.",
  keywords: ["device cleaner app", "free android app", "free windows app", "duplicate file finder"],
  openGraph: {
    images: [OG_IMAGE],
    title: "Free Apps by TechBuddy — Android & Windows",
    description: "Privacy-first utility apps, free to download. No ads, no tracking.",
  },
};

const FEATURE_ICONS: Record<AppFeatureIcon, ComponentType<{ size?: number; className?: string }>> = {
  gauge: IconGauge,
  copy: IconCopy,
  "chart-bar": IconChartBar,
  folders: IconFolders,
};

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-[var(--page)]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[var(--section-y)] pb-14 text-center">
        <PageVectors variant="center" intensity={0.4} />
        <div className="relative z-10 mx-auto max-w-xl px-[var(--container-px)]">
          <p className="eyebrow justify-center mb-6">Free apps</p>
          <h1 className="h-display mb-4">
            Apps We&apos;ve <span className="text-[var(--brand)]">Built &amp; Ship</span>
          </h1>
          <p className="text-[var(--ink-muted)] text-lg leading-relaxed">
            Free, privacy-first mobile apps. No ads, no tracking, no account —
            install directly on your phone in under a minute.
          </p>
        </div>
      </section>

      {APPS.map((app) => (
        <div key={app.slug}>

          {/* ── App hero — centered, mobile as the primary CTA ─────────────── */}
          <RevealSection>
          <section className="pb-14">
            <div className="mx-auto max-w-md px-[var(--container-px)] text-center">

              {/* Interactive icon stage — soft GSAP-pulsed glow, Motion tilt, three.js orb (desktop) */}
              <AppIconStage src={app.icon} alt={`${app.name} icon`} />

              <h2 className="font-heading text-2xl font-extrabold text-[var(--ink)] mb-2">{app.name}</h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">{app.tagline}</p>

              {/* Primary CTA — Android, full-width, the app is mobile-first */}
              <a
                href={app.android.downloadHref}
                download
                className="btn-primary h-14 w-full text-base gap-3 mb-2.5"
              >
                <IconBrandAndroid size={22} />
                Download for Android
              </a>
              <p className="text-xs text-[var(--ink-faint)] mb-5">APK · {app.android.fileSizeLabel} · direct install</p>

              {app.android.playStoreHref && (
                <a href={app.android.playStoreHref} target="_blank" rel="noopener noreferrer"
                   className="inline-block text-sm font-semibold text-[var(--brand)] hover:underline mb-5">
                  Also on Google Play →
                </a>
              )}

              {/* Secondary — Windows, quieter */}
              <a
                href={app.windows.downloadHref}
                download
                className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ink-muted)] hover:text-[var(--brand)] transition-colors mb-8"
              >
                <IconBrandWindows size={16} className="text-[var(--brand)]" />
                Also available for Windows (.exe, {app.windows.fileSizeLabel})
                <IconDownload size={13} className="opacity-50" />
              </a>

              {/* Honest friction disclosure */}
              <div className="flex items-start gap-2.5 rounded-2xl bg-[var(--warn)]/8 border border-[var(--warn)]/25 px-4 py-3.5 mb-6 text-left">
                <IconAlertTriangle size={15} className="text-[var(--warn)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--ink)]/70 leading-relaxed">
                  Not yet on the Play Store, so Android will warn about installing from an unknown
                  source — tap &quot;Install anyway.&quot; The Windows build isn&apos;t code-signed
                  yet either, so SmartScreen may flag it — click &quot;More info&quot; → &quot;Run anyway.&quot;
                  Both are expected for a new, independently distributed app.
                </p>
              </div>

              {/* Privacy strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--ink-muted)]">
                <span className="flex items-center gap-1.5"><IconShieldCheck size={14} className="text-[var(--brand)]" />No ads or tracking</span>
                <span className="flex items-center gap-1.5"><IconLock size={14} className="text-[var(--brand)]" />No account required</span>
                <Link href={app.privacyHref} className="font-semibold text-[var(--brand)] hover:underline">
                  Privacy policy →
                </Link>
              </div>
            </div>
          </section>
          </RevealSection>

          {/* ── Screenshots — phone-framed, horizontal scroll on mobile ────── */}
          <RevealSection delay={0.05}>
          <section className="pb-16 bg-[var(--surface)] py-14">
            <div className="mx-auto max-w-6xl px-[var(--container-px)]">
              <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
                {app.screenshots.map((s) => (
                  <div key={s.src} className="shrink-0 w-[180px] sm:w-full snap-center">
                    <div className="rounded-[26px] border-[6px] border-[var(--ink)]/85 bg-[var(--ink)]/85 shadow-xl overflow-hidden">
                      <Image src={s.src} alt={s.alt} width={400} height={860} className="w-full h-auto rounded-[20px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </RevealSection>

          {/* ── Features — blue icon badges ─────────────────────────────────── */}
          <RevealSection delay={0.05}>
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-[var(--container-px)]">
              <p className="eyebrow mb-5 justify-center sm:justify-start">What it does</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {app.features.map((f) => {
                  const Icon = FEATURE_ICONS[f.icon];
                  return (
                    <div
                      key={f.title}
                      className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 flex gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[var(--brand)]/30"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)]">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="font-heading font-bold text-[var(--ink)] mb-1">{f.title}</p>
                        <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
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
