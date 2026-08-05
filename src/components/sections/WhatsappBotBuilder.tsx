"use client";

import { useState } from "react";
import { IconPlus, IconTrash, IconBrandWhatsapp, IconSend, IconCheck, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import { type BotOption, type BotFlow, DEFAULT_BOT_FLOW, uid } from "@/types/whatsappBot";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail, validateName } from "@/lib/validate";

function resolveWelcome(flow: BotFlow): string {
  return flow.welcomeMessage.replace("{business}", flow.businessName || "our business");
}

/* ── Chat mockup ─────────────────────────────────────────────────────────── */

function ChatMock({ flow }: { flow: BotFlow }) {
  const [selected, setSelected] = useState<BotOption | null>(null);

  return (
    <div className="rounded-[28px] border-8 border-[#111827] bg-[#e5ddd5] w-full max-w-[300px] mx-auto overflow-hidden shadow-xl">
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><IconBrandWhatsapp size={16} /></div>
        <div>
          <p className="text-sm font-semibold leading-tight">{flow.businessName || "Your Business"}</p>
          <p className="text-[10px] text-white/70">online</p>
        </div>
      </div>

      <div className="p-3 space-y-2 min-h-[320px]">
        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] text-[13px] text-[#111827] shadow-sm">
          {resolveWelcome(flow)}
          <div className="mt-2 space-y-1">
            {flow.options.map((o, i) => (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="block w-full text-left text-[12px] text-[#075E54] font-medium hover:underline"
              >
                {i + 1}. {o.label}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <>
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none px-3 py-2 max-w-[70%] text-[13px] text-[#111827] shadow-sm">
                {flow.options.findIndex((o) => o.id === selected.id) + 1}
              </div>
            </div>
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] text-[13px] text-[#111827] shadow-sm">
              {selected.reply}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Builder ─────────────────────────────────────────────────────────────── */

export function WhatsappBotBuilder() {
  const [flow, setFlow] = useState<BotFlow>(DEFAULT_BOT_FLOW);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof BotFlow>(key: K, value: BotFlow[K]) => setFlow((prev) => ({ ...prev, [key]: value }));

  const addOption = () => setFlow((prev) => ({ ...prev, options: [...prev.options, { id: uid(), label: "", reply: "" }] }));
  const removeOption = (id: string) => setFlow((prev) => ({ ...prev, options: prev.options.filter((o) => o.id !== id) }));
  const updateOption = (id: string, patch: Partial<BotOption>) =>
    setFlow((prev) => ({ ...prev, options: prev.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));

  const submit = async () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    if (nameErr || emailErr) { setError(nameErr ?? emailErr); return; }
    if (!flow.businessName.trim()) { setError("Enter your business name in the flow above."); return; }

    setSubmitting(true);
    setError(null);
    try {
      captureToolLead({
        tool: "whatsapp-bot-builder",
        source: "quote-click",
        email,
        selections: { businessName: flow.businessName, welcomeMessage: resolveWelcome(flow), options: flow.options, contactName: name, contactPhone: phone },
        result: { optionCount: flow.options.length },
      });
      await new Promise((r) => setTimeout(r, 400));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
      {/* ── Builder form ─────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="card p-6">
          <p className="eyebrow mb-3">Your business</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Business name</label>
              <input
                value={flow.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Adaeze Studios"
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Welcome message</label>
              <textarea
                value={flow.welcomeMessage}
                onChange={(e) => set("welcomeMessage", e.target.value)}
                rows={2}
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
              />
              <p className="text-[11px] text-[var(--ink-faint)] mt-1">Use {"{business}"} to insert your business name.</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow mb-0">Menu options</p>
            <button onClick={addOption} className="btn-ghost h-8 px-3 text-xs"><IconPlus size={13} />Add option</button>
          </div>
          <div className="space-y-3">
            {flow.options.map((o, i) => (
              <div key={o.id} className="border border-[var(--border)] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--brand)]">Option {i + 1}</span>
                  <button onClick={() => removeOption(o.id)} className="text-[var(--ink-faint)] hover:text-[var(--bad)] transition-colors" aria-label="Remove option">
                    <IconTrash size={13} />
                  </button>
                </div>
                <input
                  value={o.label}
                  onChange={(e) => updateOption(o.id, { label: e.target.value })}
                  placeholder="Menu label (e.g. Our services)"
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 mb-2 focus:outline-none focus:border-[var(--brand)]"
                />
                <textarea
                  value={o.reply}
                  onChange={(e) => updateOption(o.id, { reply: e.target.value })}
                  placeholder="What the bot replies with"
                  rows={2}
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <p className="eyebrow mb-3">Fallback (unrecognised replies)</p>
          <textarea
            value={flow.fallbackMessage}
            onChange={(e) => set("fallbackMessage", e.target.value)}
            rows={2}
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
          />
        </div>

        <div className="card p-6">
          <p className="eyebrow mb-1">Send to our team to deploy</p>
          <p className="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
            This builder designs your flow — deploying it live on WhatsApp Business API needs Meta verification, which our team handles for you.
          </p>
          {sent ? (
            <div className="flex items-center gap-2 text-[var(--good)] text-sm"><IconCheck size={16} className="shrink-0" /><span>Sent! We&apos;ll follow up within 24 hours to get this live.</span></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number" className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]" />
              </div>
              {error && <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3"><IconAlertCircle size={14} className="shrink-0" /><span>{error}</span></div>}
              <button onClick={submit} disabled={submitting} className="btn-primary h-11 px-6 text-sm">
                {submitting ? <IconLoader2 size={16} className="animate-spin" /> : <IconSend size={16} />}
                {submitting ? "Sending…" : "Send flow to our team"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <p className="text-xs text-[var(--ink-faint)] text-center mb-4">Live preview — tap a menu option</p>
        <ChatMock flow={flow} />
      </div>
    </div>
  );
}
