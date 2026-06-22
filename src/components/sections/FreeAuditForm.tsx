"use client";

import { useState } from "react";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { validateEmail, validateName, validateUrl } from "@/lib/validate";
import { CategoryPicker, type Category } from "@/components/ui/CategoryPicker";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

const AUDIT_TYPES = [
  { id: "performance", label: "Performance",         hint: "Speed, Core Web Vitals, bundle size"    },
  { id: "security",    label: "Security",            hint: "Headers, vulnerabilities, HTTPS"        },
  { id: "seo",         label: "SEO",                 hint: "Meta tags, sitemap, indexability"       },
  { id: "code",        label: "Code quality",        hint: "Architecture, tech debt, patterns"      },
  { id: "ux",          label: "UX & Accessibility",  hint: "Usability, WCAG, mobile experience"     },
];

type Status = "idle" | "loading" | "success" | "error";

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
      <IconAlertCircle size={11} className="shrink-0" />{msg}
    </span>
  );
}

export function FreeAuditForm() {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [url,   setUrl]   = useState("");
  const [types,    setTypes]    = useState<string[]>(["performance", "security"]);
  const [category, setCategory] = useState<Category>("");
  const [status,   setStatus]   = useState<Status>("idle");
  const [serverErr, setServerErr] = useState("");

  /* Touched state per field */
  const [touched, setTouched] = useState({ name: false, email: false, url: false });
  const touch = (field: keyof typeof touched) => setTouched((t) => ({ ...t, [field]: true }));

  const nameErr  = touched.name  ? validateName(name)   : null;
  const emailErr = touched.email ? validateEmail(email) : null;
  const urlErr   = touched.url   ? validateUrl(url)     : null;

  const isValid  = !validateName(name) && !validateEmail(email) && !validateUrl(url) && types.length > 0;

  const toggle = (id: string) =>
    setTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const inputCls = (err: string | null, val: string, isTouched: boolean) => [
    "h-11 rounded-xl border px-4 text-sm text-[var(--fg)] bg-[var(--surface)]",
    "placeholder:text-[var(--fg)]/25 focus:outline-none focus:ring-1 transition-colors w-full",
    isTouched && err
      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/20"
      : isTouched && val && !err
      ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
      : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/30",
  ].join(" ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /* Touch all fields to reveal errors */
    setTouched({ name: true, email: true, url: true });
    if (!isValid) return;
    if (types.length === 0) { setServerErr("Select at least one audit type."); return; }

    setStatus("loading");
    setServerErr("");
    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, url, auditTypes: types, category }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submit failed");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setServerErr(err instanceof Error ? err.message : "Something went wrong. Please try again or WhatsApp us.");
    }
  };

  if (status === "success") {
    return (
      <div className="glass rounded-[var(--radius-card)] border border-[var(--primary)]/30 p-10 text-center max-w-md mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-5">
          <IconCheck size={28} className="text-[var(--primary)]" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-[var(--fg)] mb-2">Audit Request Received!</h2>
        <p className="text-[var(--fg)]/50 text-sm leading-relaxed mb-1">
          We&apos;ll manually audit <span className="text-[var(--primary)] font-mono break-all">{url}</span> and send
          your report to <strong>{email}</strong> within 48 hours.
        </p>
        <p className="text-xs text-[var(--fg)]/30 mb-6">Questions before then? WhatsApp us directly.</p>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I just submitted a free audit request for ${url}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl mx-auto space-y-5">

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--fg)]/60 mb-1" htmlFor="audit-name">
            Your name <span className="text-[var(--primary)]">*</span>
          </label>
          <input
            id="audit-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (touched.name) {} }}
            onBlur={() => touch("name")}
            placeholder="Chidi Okafor"
            className={inputCls(nameErr, name, touched.name)}
          />
          <FieldError msg={nameErr} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--fg)]/60 mb-1" htmlFor="audit-email">
            Email address <span className="text-[var(--primary)]">*</span>
          </label>
          <input
            id="audit-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (touched.email) {} }}
            onBlur={() => touch("email")}
            placeholder="chidi@company.ng"
            className={inputCls(emailErr, email, touched.email)}
          />
          <FieldError msg={emailErr} />
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="block text-xs font-semibold text-[var(--fg)]/60 mb-1" htmlFor="audit-url">
          Website or app URL <span className="text-[var(--primary)]">*</span>
        </label>
        <input
          id="audit-url"
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); if (touched.url) {} }}
          onBlur={() => touch("url")}
          placeholder="https://yourapp.com"
          className={`${inputCls(urlErr, url, touched.url)} font-mono`}
        />
        <FieldError msg={urlErr} />
      </div>

      {/* Audit types */}
      <div>
        <p className="text-xs font-semibold text-[var(--fg)]/60 mb-3">
          What should we audit? <span className="text-[var(--primary)]">*</span>
        </p>
        <div className="flex flex-col gap-2">
          {AUDIT_TYPES.map((t) => (
            <label
              key={t.id}
              className={[
                "flex items-center gap-4 rounded-xl border px-4 py-3 cursor-pointer transition-all",
                types.includes(t.id)
                  ? "border-[var(--primary)]/60 bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--primary)]/30",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={types.includes(t.id)}
                onChange={() => toggle(t.id)}
                className="accent-[var(--primary)] h-4 w-4 shrink-0"
              />
              <span className="flex-1">
                <span className="block text-sm font-medium text-[var(--fg)]">{t.label}</span>
                <span className="block text-xs text-[var(--fg)]/40">{t.hint}</span>
              </span>
              {types.includes(t.id) && (
                <span className="text-[var(--primary)] text-xs font-mono">✓</span>
              )}
            </label>
          ))}
        </div>
        {types.length === 0 && (
          <span className="flex items-center gap-1 text-[11px] text-rose-400 mt-2">
            <IconAlertCircle size={11} />Select at least one audit type
          </span>
        )}
      </div>

      {/* Category */}
      <CategoryPicker value={category} onChange={setCategory} />

      {/* Server error */}
      {serverErr && (
        <div className="flex items-start gap-2 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-3">
          <IconAlertCircle size={15} className="shrink-0 mt-0.5" />
          {serverErr}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 rounded-full bg-[var(--primary)] font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-sky)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting…" : "Request free audit →"}
      </button>

      <p className="text-center text-xs text-[var(--fg)]/25">
        No sign-up required. Report delivered within 48 hours.
      </p>
    </form>
  );
}
