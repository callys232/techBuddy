"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconFileText,
  IconFolder,
  IconCertificate,
  IconSparkles,
  IconPlus,
  IconTrash,
  IconX,
  IconDownload,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconAlertCircle,
  IconLoader2,
  IconCheck,
  IconLock,
  IconCrown,
  IconBrandPaypal,
  IconBrandStripe,
  IconCurrencyBitcoin,
  IconCreditCard,
  IconStarFilled,
} from "@tabler/icons-react";
import { getSupabase } from "@/lib/supabase/client";
import {
  type ResumeData,
  type ResumeTemplate,
  RESUME_TEMPLATES,
  DEFAULT_RESUME_DATA,
  uid,
} from "@/types/resume";
import {
  ClassicPreview,
  ModernPreview,
  MinimalPreview,
  ExecutivePreview,
  TechnicalPreview,
} from "@/components/resume/previews";

const PREVIEWS: Record<ResumeTemplate, (props: { data: ResumeData }) => React.ReactElement> = {
  classic: ClassicPreview,
  modern: ModernPreview,
  minimal: MinimalPreview,
  executive: ExecutivePreview,
  technical: TechnicalPreview,
};

type Tab = "personal" | "experience" | "projects" | "education" | "certifications" | "skills" | "extras" | "summary";

/* ─────────────────────────────────────────────────────────────────────────────
   Inline field primitives
───────────────────────────────────────────────────────────────────────────── */

function Field({
  label, value, onChange, placeholder, type = "text", icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--fg)]/60 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors py-2 px-3 ${icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--fg)]/60 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors py-2 px-3 resize-none"
      />
    </div>
  );
}

function EntryCard({ label, onRemove, children }: { label: string; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 space-y-3 relative">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-[var(--fg)]/50 uppercase tracking-wide">{label}</p>
        <button onClick={onRemove} className="text-[var(--fg)]/30 hover:text-rose-400 transition-colors" aria-label="Remove">
          <IconTrash size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-dashed border-[var(--border)] hover:border-[var(--primary)] text-[var(--fg)]/50 hover:text-[var(--primary)] rounded-lg py-3 text-sm transition-colors"
    >
      <IconPlus size={15} />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Auth Modal
───────────────────────────────────────────────────────────────────────────── */

function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) { setError("Please enter your name and email."); return; }
    setBusy(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { data: { full_name: name.trim() }, emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined },
      });
      if (signUpError) throw signUpError;
      await supabase.from("resume_members").upsert({ email: email.trim(), name: name.trim() }, { onConflict: "email" });
      setSent(true);
      setTimeout(onSuccess, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-card)] p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors" aria-label="Close"><IconX size={18} /></button>
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 flex items-center justify-center mx-auto mb-4"><IconCheck size={24} className="text-[var(--primary)]" /></div>
            <p className="font-heading font-semibold text-[var(--fg)] mb-2">Check your email</p>
            <p className="text-sm text-[var(--fg)]/50">We sent a magic link to <strong>{email}</strong>. Click it to verify and your PDF will download automatically.</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em] mb-2">Free to use</p>
              <h2 className="font-heading font-bold text-[var(--fg)] text-lg mb-1">Download requires a free account</h2>
              <p className="text-sm text-[var(--fg)]/50 leading-relaxed">Create your free account to download your resume as a PDF. No credit card needed.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Full name" value={name} onChange={setName} placeholder="Adaeze Okafor" icon={<IconUser size={14} />} />
              <Field label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" icon={<IconMail size={14} />} />
              {error && <div className="flex items-center gap-2 text-rose-400 text-xs"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
              <button type="submit" disabled={busy} className="w-full bg-[var(--primary)] hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconMail size={16} />}
                {busy ? "Creating account…" : "Create free account"}
              </button>
              <p className="text-center text-[11px] text-[var(--fg)]/35">We&apos;ll send a magic link — no password needed.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Upgrade Modal — real Paystack subscription checkout
───────────────────────────────────────────────────────────────────────────── */

type PaymentProvider = "paystack" | "stripe" | "paypal" | "crypto";

const PAYMENT_PROVIDERS: { id: PaymentProvider; label: string; price: string; endpoint: string; icon: React.ReactNode }[] = [
  { id: "paystack", label: "Card / Bank (Paystack)", price: "₦2,500/mo", endpoint: "/api/payments/subscribe", icon: <IconCreditCard size={16} /> },
  { id: "stripe", label: "Card (Stripe)", price: "$5/mo", endpoint: "/api/payments/stripe/checkout", icon: <IconBrandStripe size={16} /> },
  { id: "paypal", label: "PayPal", price: "$5/mo", endpoint: "/api/payments/paypal/checkout", icon: <IconBrandPaypal size={16} /> },
  { id: "crypto", label: "Crypto", price: "$5 / 1 month", endpoint: "/api/payments/crypto/checkout", icon: <IconCurrencyBitcoin size={16} /> },
];

const POINTS_REWARD_ID = "resume-premium-month";

function UpgradeModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [provider, setProvider] = useState<PaymentProvider>("paystack");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number | null>(null);
  const [pointsCost, setPointsCost] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/points/balance?email=${encodeURIComponent(email)}`);
        const json = await res.json();
        setPointsBalance(json.balance ?? 0);
        const reward = (json.rewards as { id: string; cost: number }[] | undefined)?.find((r) => r.id === POINTS_REWARD_ID);
        setPointsCost(reward?.cost ?? null);
      } catch {
        setPointsBalance(null);
      }
    })();
  }, [email]);

  const handleUpgrade = async () => {
    setBusy(true);
    setError(null);
    try {
      const endpoint = PAYMENT_PROVIDERS.find((p) => p.id === provider)!.endpoint;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not start checkout");
      window.location.href = json.authorizationUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    setError(null);
    try {
      const res = await fetch("/api/points/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, rewardId: POINTS_REWARD_ID }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not redeem points");
      setPointsBalance(json.balance);
      setRedeemed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRedeeming(false);
    }
  };

  const canRedeem = pointsBalance !== null && pointsCost !== null && pointsBalance >= pointsCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-card)] p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors" aria-label="Close"><IconX size={18} /></button>
        <div className="w-12 h-12 rounded-full bg-amber-400/15 flex items-center justify-center mb-4"><IconCrown size={22} className="text-amber-400" /></div>
        <h2 className="font-heading font-bold text-[var(--fg)] text-lg mb-1">Resume Premium</h2>
        <p className="text-sm text-[var(--fg)]/50 leading-relaxed mb-4">
          Unlock the Executive and Technical templates, plus AI-powered resume suggestions.
        </p>
        <ul className="space-y-2 mb-5">
          {["2 additional professional templates", "AI suggestions tailored to your resume", "Priority PDF generation"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-[var(--fg)]/70"><IconCheck size={14} className="text-emerald-400 shrink-0" />{f}</li>
          ))}
        </ul>

        {redeemed ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-3"><IconCheck size={16} className="shrink-0" /><span>1 month of Premium unlocked with points. Refresh to use it.</span></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PAYMENT_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors ${
                    provider === p.id ? "border-amber-400 bg-amber-400/10" : "border-[var(--border)] hover:border-[var(--fg)]/30"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--fg)]">{p.icon}{p.label}</span>
                  <span className="text-[11px] text-[var(--fg)]/45">{p.price}</span>
                </button>
              ))}
            </div>

            {error && <div className="flex items-center gap-2 text-rose-400 text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}

            <button
              onClick={handleUpgrade}
              disabled={busy}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-[#1a1200] font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {busy ? <IconLoader2 size={16} className="animate-spin" /> : <IconCrown size={16} />}
              {busy ? "Redirecting to checkout…" : `Upgrade — ${PAYMENT_PROVIDERS.find((p) => p.id === provider)!.price}`}
            </button>

            {pointsCost !== null && (
              <>
                <div className="flex items-center gap-2 my-4"><div className="h-px flex-1 bg-[var(--border)]" /><span className="text-[11px] text-[var(--fg)]/35">or</span><div className="h-px flex-1 bg-[var(--border)]" /></div>
                <button
                  onClick={handleRedeem}
                  disabled={!canRedeem || redeeming}
                  className="w-full border border-[var(--border)] disabled:opacity-50 text-[var(--fg)] font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 hover:border-[var(--fg)]/30"
                >
                  {redeeming ? <IconLoader2 size={16} className="animate-spin" /> : <IconStarFilled size={15} className="text-amber-400" />}
                  {redeeming ? "Redeeming…" : `Redeem ${pointsCost} points for 1 month`}
                </button>
                <p className="text-center text-[11px] text-[var(--fg)]/35 mt-1.5">
                  {pointsBalance !== null ? `You have ${pointsBalance} points` : "Loading your points…"}
                  {pointsBalance !== null && !canRedeem ? ` — need ${pointsCost - pointsBalance} more` : ""}
                </p>
              </>
            )}

            <p className="text-center text-[11px] text-[var(--fg)]/35 mt-3">Secure checkout. Cancel anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */

export function ResumeMaker() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [template, setTemplate] = useState<ResumeTemplate>("classic");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  /* Pick up an already-authed session (magic link redirect) and check subscription */
  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData } = await getSupabase().auth.getSession();
        const email = sessionData.session?.user.email ?? null;
        setUserEmail(email);
        if (email) {
          const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`);
          const json = await res.json();
          setSubscribed(!!json.active);
        }
      } catch {
        // not signed in yet — fine, gates re-check on download/upgrade actions
      }
    })();
  }, []);

  /* ── Setters ──────────────────────────────────────────────────────────── */

  const setField = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setPersonal = useCallback(
    (key: keyof Omit<ResumeData, "experience" | "education" | "skills" | "summary" | "projects" | "certifications" | "languages" | "awards">) =>
      (value: string) => setData((prev) => ({ ...prev, [key]: value })),
    []
  );

  /* Generic list CRUD, reused across experience/education/projects/certifications/languages/awards */
  function useListSection<K extends "experience" | "education" | "projects" | "certifications" | "languages" | "awards">(key: K) {
    type Entry = ResumeData[K][number];
    const add = (blank: Omit<Entry, "id">) =>
      setData((prev) => ({ ...prev, [key]: [...(prev[key] as Entry[]), { id: uid(), ...blank } as Entry] }));
    const remove = (id: string) =>
      setData((prev) => ({ ...prev, [key]: (prev[key] as Entry[]).filter((e) => (e as { id: string }).id !== id) }));
    const update = (id: string, patch: Partial<Entry>) =>
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] as Entry[]).map((e) => ((e as { id: string }).id === id ? { ...e, ...patch } : e)),
      }));
    return { add, remove, update };
  }

  const experienceOps = useListSection("experience");
  const educationOps = useListSection("education");
  const projectOps = useListSection("projects");
  const certOps = useListSection("certifications");
  const langOps = useListSection("languages");
  const awardOps = useListSection("awards");

  /* ── Skills ───────────────────────────────────────────────────────────── */

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill || data.skills.includes(skill)) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillInput("");
  };
  const removeSkill = (skill: string) => setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  const onSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); }
    if (e.key === "Backspace" && skillInput === "" && data.skills.length > 0) removeSkill(data.skills[data.skills.length - 1]);
  };

  /* ── Template selection — gate premium ───────────────────────────────── */

  const selectTemplate = (t: ResumeTemplate) => {
    const meta = RESUME_TEMPLATES.find((m) => m.id === t);
    if (meta?.premium && !subscribed) {
      if (!userEmail) { setShowAuthModal(true); return; }
      setShowUpgradeModal(true);
      return;
    }
    setTemplate(t);
  };

  /* ── AI suggestions ───────────────────────────────────────────────────── */

  const runAiSuggestions = async () => {
    if (!userEmail) { setShowAuthModal(true); return; }
    if (!subscribed) { setShowUpgradeModal(true); return; }
    setSuggestLoading(true);
    setSuggestError(null);
    try {
      const res = await fetch("/api/resume/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, resumeData: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate suggestions");
      setSuggestions(json.suggestions);
    } catch (err: unknown) {
      setSuggestError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSuggestLoading(false);
    }
  };

  /* ── Download ─────────────────────────────────────────────────────────── */

  const handleDownload = async () => {
    setDownloadError(null);
    try {
      const { data: sessionData } = await getSupabase().auth.getSession();
      const email = sessionData.session?.user.email ?? null;
      if (!email) { setShowAuthModal(true); return; }
      setUserEmail(email);
    } catch (err: unknown) {
      setDownloadError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      return;
    }
    await triggerDownload();
  };

  const triggerDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch("/api/resume/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: data, template, email: userEmail }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        if (res.status === 403) { setShowUpgradeModal(true); return; }
        throw new Error((json as { error?: string }).error ?? "PDF generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name.replace(/\s+/g, "_") || "resume"}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setDownloadError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  /* ── Tabs config ──────────────────────────────────────────────────────── */

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal", icon: <IconUser size={15} /> },
    { id: "experience", label: "Experience", icon: <IconBriefcase size={15} /> },
    { id: "projects", label: "Projects", icon: <IconFolder size={15} /> },
    { id: "education", label: "Education", icon: <IconSchool size={15} /> },
    { id: "certifications", label: "Certs", icon: <IconCertificate size={15} /> },
    { id: "skills", label: "Skills", icon: <IconCode size={15} /> },
    { id: "extras", label: "Extras", icon: <IconSparkles size={15} /> },
    { id: "summary", label: "Summary", icon: <IconFileText size={15} /> },
  ];

  const Preview = PREVIEWS[template];

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={async () => {
          setShowAuthModal(false);
          const { data: sessionData } = await getSupabase().auth.getSession();
          setUserEmail(sessionData.session?.user.email ?? null);
          triggerDownload();
        }} />
      )}
      {showUpgradeModal && userEmail && <UpgradeModal email={userEmail} onClose={() => setShowUpgradeModal(false)} />}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Editor panel ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-2/5 flex flex-col gap-0">
          <div className="flex overflow-x-auto gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-t-[var(--radius-card)] p-1.5 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "bg-[var(--primary)] text-white" : "text-[var(--fg)]/60 hover:text-[var(--fg)] hover:bg-[var(--border)]"
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--surface)] border-x border-[var(--border)] p-5 space-y-4 min-h-[480px]">
            {activeTab === "personal" && (
              <div className="space-y-3">
                <Field label="Full name" value={data.name} onChange={setPersonal("name")} placeholder="Adaeze Okafor" icon={<IconUser size={14} />} />
                <Field label="Job title / Role" value={data.title} onChange={setPersonal("title")} placeholder="Product Designer" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" value={data.email} onChange={setPersonal("email")} placeholder="you@email.com" type="email" icon={<IconMail size={14} />} />
                  <Field label="Phone" value={data.phone} onChange={setPersonal("phone")} placeholder="+234 800 000 0000" icon={<IconPhone size={14} />} />
                </div>
                <Field label="Location" value={data.location} onChange={setPersonal("location")} placeholder="Lagos, Nigeria" icon={<IconMapPin size={14} />} />
                <Field label="LinkedIn" value={data.linkedin} onChange={setPersonal("linkedin")} placeholder="linkedin.com/in/yourname" icon={<IconBrandLinkedin size={14} />} />
                <Field label="GitHub" value={data.github} onChange={setPersonal("github")} placeholder="github.com/yourname" icon={<IconBrandGithub size={14} />} />
                <Field label="Website / Portfolio" value={data.website} onChange={setPersonal("website")} placeholder="yoursite.com" icon={<IconWorld size={14} />} />
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-5">
                {data.experience.map((exp, idx) => (
                  <EntryCard key={exp.id} label={`Job ${idx + 1}`} onRemove={() => experienceOps.remove(exp.id)}>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Company" value={exp.company} onChange={(v) => experienceOps.update(exp.id, { company: v })} placeholder="Kuda Bank" />
                      <Field label="Role" value={exp.role} onChange={(v) => experienceOps.update(exp.id, { role: v })} placeholder="Senior Designer" />
                    </div>
                    <Field label="Period" value={exp.period} onChange={(v) => experienceOps.update(exp.id, { period: v })} placeholder="2022 – Present" />
                    <TextArea label="Description" value={exp.description} onChange={(v) => experienceOps.update(exp.id, { description: v })} placeholder="Key achievements and responsibilities…" rows={3} />
                  </EntryCard>
                ))}
                <AddButton label="Add job" onClick={() => experienceOps.add({ company: "", role: "", period: "", description: "" })} />
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-5">
                {data.projects.map((p, idx) => (
                  <EntryCard key={p.id} label={`Project ${idx + 1}`} onRemove={() => projectOps.remove(p.id)}>
                    <Field label="Project name" value={p.name} onChange={(v) => projectOps.update(p.id, { name: v })} placeholder="Design System for Kuda Mobile" />
                    <Field label="Link (optional)" value={p.link} onChange={(v) => projectOps.update(p.id, { link: v })} placeholder="yoursite.com/project" />
                    <TextArea label="Description" value={p.description} onChange={(v) => projectOps.update(p.id, { description: v })} placeholder="What you built and the outcome…" rows={3} />
                  </EntryCard>
                ))}
                <AddButton label="Add project" onClick={() => projectOps.add({ name: "", description: "", link: "" })} />
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-5">
                {data.education.map((edu, idx) => (
                  <EntryCard key={edu.id} label={`Entry ${idx + 1}`} onRemove={() => educationOps.remove(edu.id)}>
                    <Field label="Institution" value={edu.institution} onChange={(v) => educationOps.update(edu.id, { institution: v })} placeholder="University of Lagos" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Degree" value={edu.degree} onChange={(v) => educationOps.update(edu.id, { degree: v })} placeholder="B.Sc Computer Science" />
                      <Field label="Year" value={edu.year} onChange={(v) => educationOps.update(edu.id, { year: v })} placeholder="2020" />
                    </div>
                    <TextArea label="Additional details" value={edu.description} onChange={(v) => educationOps.update(edu.id, { description: v })} placeholder="Achievements, awards, relevant coursework…" rows={2} />
                  </EntryCard>
                ))}
                <AddButton label="Add education" onClick={() => educationOps.add({ institution: "", degree: "", year: "", description: "" })} />
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-5">
                {data.certifications.map((c, idx) => (
                  <EntryCard key={c.id} label={`Certification ${idx + 1}`} onRemove={() => certOps.remove(c.id)}>
                    <Field label="Certification name" value={c.name} onChange={(v) => certOps.update(c.id, { name: v })} placeholder="Google UX Design Professional Certificate" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Issuer" value={c.issuer} onChange={(v) => certOps.update(c.id, { issuer: v })} placeholder="Google / Coursera" />
                      <Field label="Year" value={c.year} onChange={(v) => certOps.update(c.id, { year: v })} placeholder="2021" />
                    </div>
                  </EntryCard>
                ))}
                <AddButton label="Add certification" onClick={() => certOps.add({ name: "", issuer: "", year: "" })} />
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--fg)]/60 mb-1.5">
                    Skills<span className="ml-2 text-[var(--fg)]/30 font-normal">Press Enter or comma to add</span>
                  </label>
                  <div className="min-h-[48px] flex flex-wrap gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 cursor-text focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)]/30 transition-colors" onClick={() => skillInputRef.current?.focus()}>
                    {data.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-[var(--primary)]/15 text-[var(--primary)] text-xs px-2.5 py-1 rounded-full">
                        {skill}
                        <button onClick={(e) => { e.stopPropagation(); removeSkill(skill); }} className="text-[var(--primary)]/60 hover:text-[var(--primary)] ml-0.5" aria-label={`Remove ${skill}`}><IconX size={11} /></button>
                      </span>
                    ))}
                    <input
                      ref={skillInputRef} type="text" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)} onKeyDown={onSkillKeyDown}
                      onBlur={() => skillInput.trim() && addSkill(skillInput)}
                      placeholder={data.skills.length === 0 ? "Type a skill and press Enter…" : ""}
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 outline-none"
                    />
                  </div>
                </div>
                {data.skills.length > 0 && <p className="text-xs text-[var(--fg)]/40">{data.skills.length} skill{data.skills.length !== 1 ? "s" : ""} added</p>}
              </div>
            )}

            {activeTab === "extras" && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[var(--fg)]/60 uppercase tracking-wide mb-3">Languages</p>
                  <div className="space-y-3">
                    {data.languages.map((l) => (
                      <EntryCard key={l.id} label="Language" onRemove={() => langOps.remove(l.id)}>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Language" value={l.name} onChange={(v) => langOps.update(l.id, { name: v })} placeholder="English" />
                          <Field label="Level" value={l.level} onChange={(v) => langOps.update(l.id, { level: v })} placeholder="Native / Fluent / Conversational" />
                        </div>
                      </EntryCard>
                    ))}
                    <AddButton label="Add language" onClick={() => langOps.add({ name: "", level: "" })} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--fg)]/60 uppercase tracking-wide mb-3">Awards</p>
                  <div className="space-y-3">
                    {data.awards.map((a) => (
                      <EntryCard key={a.id} label="Award" onRemove={() => awardOps.remove(a.id)}>
                        <Field label="Award title" value={a.title} onChange={(v) => awardOps.update(a.id, { title: v })} placeholder="Best Fintech UX" />
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Issuer" value={a.issuer} onChange={(v) => awardOps.update(a.id, { issuer: v })} placeholder="Nigeria Tech Awards" />
                          <Field label="Year" value={a.year} onChange={(v) => awardOps.update(a.id, { year: v })} placeholder="2023" />
                        </div>
                      </EntryCard>
                    ))}
                    <AddButton label="Add award" onClick={() => awardOps.add({ title: "", issuer: "", year: "" })} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-3">
                <TextArea label="Professional summary" value={data.summary} onChange={(v) => setField("summary", v)} placeholder="A 2–4 sentence overview of your background, expertise, and what you bring to a role…" rows={7} />
                <p className="text-xs text-[var(--fg)]/40">{data.summary.length} characters · Aim for 200–400 for best results</p>

                {/* AI suggestions — Resume Premium feature */}
                <div className="border-t border-[var(--border)] pt-4">
                  <button
                    onClick={runAiSuggestions}
                    disabled={suggestLoading}
                    className="w-full flex items-center justify-center gap-2 border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 disabled:opacity-60 rounded-lg py-2.5 text-sm font-semibold transition-colors"
                  >
                    {suggestLoading ? <IconLoader2 size={15} className="animate-spin" /> : subscribed ? <IconSparkles size={15} /> : <IconLock size={13} />}
                    {suggestLoading ? "Reviewing your resume…" : "Get AI suggestions"}
                    {!subscribed && <span className="text-[10px] font-mono uppercase tracking-wide ml-1">Premium</span>}
                  </button>
                  {suggestError && <p className="text-xs text-rose-400 mt-2">{suggestError}</p>}
                  {suggestions && (
                    <ul className="mt-3 space-y-2">
                      {suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--fg)]/70 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3">
                          <IconSparkles size={12} className="text-amber-400 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[var(--surface)] border border-t-0 border-[var(--border)] rounded-b-[var(--radius-card)] p-4">
            {downloadError && <div className="flex items-center gap-2 text-rose-400 text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{downloadError}</span></div>}
            <button onClick={handleDownload} disabled={downloading} className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-sky-400 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
              {downloading ? "Generating PDF…" : "Download PDF"}
            </button>
            <p className="text-center text-[11px] text-[var(--fg)]/30 mt-2">Free · No watermarks · No signup required to edit</p>
          </div>
        </div>

        {/* ── Preview panel ────────────────────────────────────────────── */}
        <div className="w-full lg:w-3/5 flex flex-col gap-3 sticky top-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--fg)]/50 font-medium shrink-0">Template:</span>
            <div className="flex gap-1.5 flex-wrap">
              {RESUME_TEMPLATES.map((t) => {
                const locked = t.premium && !subscribed;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      template === t.id ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)]/60 hover:text-[var(--fg)]"
                    }`}
                  >
                    {locked && <IconLock size={10} />}
                    {t.label}
                    {t.premium && <span className="text-[9px] font-mono uppercase opacity-70">Pro</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-card)] overflow-hidden shadow-lg">
            <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <span className="text-xs text-[var(--fg)]/30 font-mono">resume-preview · {template}</span>
            </div>
            <div className="overflow-auto max-h-[800px]">
              <Preview data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
