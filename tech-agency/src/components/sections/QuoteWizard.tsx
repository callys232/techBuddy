"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepWizard } from "@/components/ui/StepWizard";
import { TemplateCard } from "@/components/ui/TemplateCard";
import { ToastNotification, ToastContainer } from "@/components/ui/ToastNotification";
import { IconCheck } from "@tabler/icons-react";

const STEPS = [
  { label: "Pain Points" },
  { label: "Template" },
  { label: "Scope" },
  { label: "Contact" },
];

const PAIN_CHIPS = [
  "Slow site", "No app", "Security issues", "Need to scale",
  "New product", "E-commerce", "Fintech", "WhatsApp integration",
];

const TEMPLATES = [
  { name: "LaunchPad", type: "landing", price: "From ₦180k", features: ["Hero", "Pricing", "FAQ"], image: "/placeholder.png" },
  { name: "SaaSify", type: "saas", price: "From ₦350k", features: ["Auth", "Dashboard", "Billing"], image: "/placeholder.png" },
  { name: "MarketPro", type: "ecommerce", price: "From ₦400k", features: ["Catalog", "Cart", "Checkout"], image: "/placeholder.png" },
  { name: "AdminKit", type: "dashboard", price: "From ₦300k", features: ["Tables", "Charts", "Users"], image: "/placeholder.png" },
];

const FEATURES = ["CMS", "Auth", "Payments", "Admin panel", "API", "Multilingual", "Offline mode"];

interface FormData {
  pains: string[];
  template: string;
  budget: number;
  timeline: string;
  features: string[];
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  source: string;
  contactMethod: string;
}

export function QuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState<FormData>({
    pains: [],
    template: "",
    budget: 1000000,
    timeline: "1-3 months",
    features: [],
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    source: "",
    contactMethod: "whatsapp",
  });

  const togglePain = (chip: string) =>
    setForm((f) => ({
      ...f,
      pains: f.pains.includes(chip)
        ? f.pains.filter((c) => c !== chip)
        : [...f.pains, chip],
    }));

  const toggleFeature = (feat: string) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(feat)
        ? f.features.filter((c) => c !== feat)
        : [...f.features, feat],
    }));

  const budgetDisplay = (v: number) =>
    v >= 50_000_000
      ? "₦50M+"
      : `₦${(v / 1_000_000).toFixed(1)}M`;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/quote/confirm");
    } catch {
      setToast({ type: "error", message: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="glass rounded-2xl border border-[var(--border)] p-8">
        <StepWizard steps={STEPS} currentStep={step} onStepChange={setStep}>
          {/* Step 0 — Pain Points */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-2">
                  What&apos;s your main challenge?
                </h2>
                <p className="text-sm text-[var(--fg)]/50">Select all that apply.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PAIN_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => togglePain(chip)}
                    className={[
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-all active:scale-95",
                      form.pains.includes(chip)
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50",
                    ].join(" ")}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                placeholder="Or describe it in your own words..."
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
              />
            </div>
          )}

          {/* Step 1 — Template */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--fg)] mb-2">
                  Start with a template?
                </h2>
                <p className="text-sm text-[var(--fg)]/50">Or go fully custom.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEMPLATES.map((t) => (
                  <div key={t.name} className="relative">
                    {form.template === t.name && (
                      <span className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]">
                        <IconCheck size={13} className="text-[var(--bg)]" />
                      </span>
                    )}
                    <TemplateCard {...t} onSelect={() => setForm((f) => ({ ...f, template: t.name }))} />
                  </div>
                ))}
                <button
                  onClick={() => setForm((f) => ({ ...f, template: "custom" }))}
                  className={[
                    "flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed p-8 transition-all",
                    form.template === "custom"
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50",
                  ].join(" ")}
                >
                  <p className="font-display font-bold text-[var(--fg)]">I want something custom</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Scope */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="font-display text-2xl font-bold text-[var(--fg)]">Scope & Budget</h2>

              {/* Budget slider */}
              <div>
                <label className="text-sm font-semibold text-[var(--fg)] block mb-3">
                  Budget: <span className="text-[var(--primary)]">{budgetDisplay(form.budget)}</span>
                </label>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={500000}
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--fg)]/30 mt-1">
                  <span>₦500k</span><span>₦50M+</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-sm font-semibold text-[var(--fg)] block mb-3">Timeline</label>
                <div className="flex flex-wrap gap-2">
                  {["ASAP", "1-3 months", "3-6 months", "No rush"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, timeline: t }))}
                      className={[
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                        form.timeline === t
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="text-sm font-semibold text-[var(--fg)] block mb-3">Features needed</label>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((feat) => (
                    <button
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={[
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                        form.features.includes(feat)
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50",
                      ].join(" ")}
                    >
                      {feat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Contact */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-[var(--fg)]">Almost done — who are we talking to?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name *"
                  className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  type="email"
                  placeholder="Email *"
                  className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                <input
                  value={form.whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="WhatsApp number *"
                  className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                <input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Company / project name"
                  className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
              </div>
              <select
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] focus:border-[var(--primary)] focus:outline-none transition-colors"
              >
                <option value="">How did you hear about us?</option>
                <option value="google">Google</option>
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="other">Other</option>
              </select>
              <div>
                <label className="text-sm font-semibold text-[var(--fg)] block mb-3">Preferred contact</label>
                <div className="flex gap-2">
                  {["email", "whatsapp", "call"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setForm((f) => ({ ...f, contactMethod: m }))}
                      className={[
                        "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-all",
                        form.contactMethod === m
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--fg)]/60 hover:border-[var(--primary)]/50",
                      ].join(" ")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </StepWizard>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="h-10 rounded-full border border-[var(--border)] px-5 text-sm font-semibold text-[var(--fg)] disabled:opacity-30 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="h-10 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.email || !form.whatsapp}
              className="h-10 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit Quote"}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <ToastContainer>
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </ToastContainer>
      )}
    </>
  );
}
