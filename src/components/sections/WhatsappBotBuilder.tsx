"use client";

import { useState, useEffect } from "react";
import {
  IconPlus,
  IconTrash,
  IconBrandWhatsapp,
  IconSend,
  IconCheck,
  IconLoader2,
  IconAlertCircle,
  IconCopy,
  IconDownload,
  IconCode,
  IconDeviceMobile,
  IconBell,
  IconBellOff,
  IconCrown,
  IconLock,
  IconDeviceGamepad2,
  IconSparkles,
} from "@tabler/icons-react";
import {
  type BotOption,
  type BotFlow,
  DEFAULT_BOT_FLOW,
  BOT_TEMPLATES,
  type BotTemplate,
  uid,
} from "@/types/whatsappBot";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail, validateName } from "@/lib/validate";
import { UpgradeModal, type UpgradeFeatureCopy } from "@/components/ui/UpgradeModal";
import { authFetch } from "@/lib/authFetch";

const GAME_UPGRADE_COPY: UpgradeFeatureCopy = {
  title: "Unlock WhatsApp Viral Game Engines & Production Code",
  description:
    "Deploy interactive WhatsApp games with automated scoreboards, streak tracking, and high-retention player mechanics.",
  benefits: [
    "Full production Express & Meta WhatsApp Cloud API game webhook source code",
    "Includes Wordle emoji grid (🟩🟨⬛), Cyber Quest RPG, & Airtime Scratch-Card engines",
    "Automated instant Admin Notifications for winners and high-score achievements",
    "Full access to all 20+ TechBuddy premium tools & business generators",
  ],
};

function resolveWelcome(flow: BotFlow): string {
  return flow.welcomeMessage.replace("{business}", flow.businessName || "our business");
}

/* ── Chat mockup ─────────────────────────────────────────────────────────── */

function ChatMock({ flow }: { flow: BotFlow }) {
  const [selected, setSelected] = useState<BotOption | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [flow]);

  return (
    <div className="rounded-[28px] border-8 border-[#111827] bg-[#e5ddd5] w-full max-w-[300px] mx-auto overflow-hidden shadow-xl">
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <IconBrandWhatsapp size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">{flow.businessName || "Your Business"}</p>
          <p className="text-[10px] text-white/70">online</p>
        </div>
      </div>

      <div className="p-3 space-y-2 min-h-[320px]">
        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] text-[13px] text-[#111827] shadow-sm whitespace-pre-line">
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
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] text-[13px] text-[#111827] shadow-sm whitespace-pre-line">
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
  const [activeTemplateId, setActiveTemplateId] = useState<string>("standard-business");
  const [flow, setFlow] = useState<BotFlow>(DEFAULT_BOT_FLOW);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Template Filter: "all" | "free-games" | "paid-games"
  const [categoryFilter, setCategoryFilter] = useState<"all" | "free-games" | "paid-games">("all");

  // Premium status & Upgrade modal
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Export states
  const [copiedAppText, setCopiedAppText] = useState(false);

  // Check subscription status on load
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/api/subscription/status");
        if (res.ok) {
          const json = await res.json();
          if (json.active) setIsSubscribed(true);
        }
      } catch {
        // Not logged in or unauthenticated
      }
    })();
  }, []);

  const activeTemplate = BOT_TEMPLATES.find((t) => t.id === activeTemplateId) || BOT_TEMPLATES[0];

  const handleSelectTemplate = (template: BotTemplate) => {
    setActiveTemplateId(template.id);
    setFlow(template.flow);
  };

  const set = <K extends keyof BotFlow>(key: K, value: BotFlow[K]) =>
    setFlow((prev) => ({ ...prev, [key]: value }));

  const addOption = () =>
    setFlow((prev) => ({ ...prev, options: [...prev.options, { id: uid(), label: "", reply: "" }] }));
  const removeOption = (id: string) =>
    setFlow((prev) => ({ ...prev, options: prev.options.filter((o) => o.id !== id) }));
  const updateOption = (id: string, patch: Partial<BotOption>) =>
    setFlow((prev) => ({ ...prev, options: prev.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));

  // Format text for WhatsApp Business App
  const generateWhatsAppBusinessText = () => {
    const welcome = resolveWelcome(flow);
    const optionsText = flow.options.map((o, i) => `${i + 1}️⃣ *${o.label}*\n${o.reply}`).join("\n\n");
    const notifStatus = flow.notificationsEnabled ? "Enabled (Default)" : "Disabled";
    return `*${flow.businessName || "Welcome"}*\n\n${welcome}\n\n${optionsText}\n\n*Fallback:* ${flow.fallbackMessage}\n\n*Notifications:* ${notifStatus}\n\n— Generated by TechBuddy (techbuddy.ng)`;
  };

  const copyForWhatsAppApp = async () => {
    try {
      await navigator.clipboard.writeText(generateWhatsAppBusinessText());
      setCopiedAppText(true);
      setTimeout(() => setCopiedAppText(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const generateNodeJsCode = () => {
    return `// WhatsApp Cloud API Webhook Starter for ${flow.businessName || "My Business"}
// Generated by TechBuddy (https://techbuddy.ng)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_META_ACCESS_TOKEN';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_verification_token';

const FLOW = ${JSON.stringify(flow, null, 2)};

// Meta Webhook Verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    return res.send(req.query['hub.challenge']);
  }
  res.sendStatus(403);
});

// Message Ingestion
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];
    if (message && message.type === 'text') {
      const from = message.from;
      const text = message.text.body.trim().toLowerCase();
      
      let replyText = FLOW.fallbackMessage;
      
      // Check menu index
      const choice = parseInt(text, 10);
      if (!isNaN(choice) && choice >= 1 && choice <= FLOW.options.length) {
        replyText = FLOW.options[choice - 1].reply;

        // Instant notification dispatched to business admin (Enabled by Default unless turned off)
        if (FLOW.notificationsEnabled) {
          console.log(\`[NOTIFICATION ACTIVE] Customer \${from} selected Option \${choice}: "\${FLOW.options[choice - 1].label}"\`);
          // Note: When deployed via TechBuddy, an automated WhatsApp alert is sent to your admin number.
        }
      } else if (text === 'hi' || text === 'hello' || text === 'menu') {
        const menuList = FLOW.options.map((o, i) => \`\${i + 1}. \${o.label}\`).join('\\n');
        replyText = \`\${FLOW.welcomeMessage.replace('{business}', FLOW.businessName)}\\n\\n\${menuList}\`;

        if (FLOW.notificationsEnabled) {
          console.log(\`[NOTIFICATION ACTIVE] New conversation initiated by customer \${from}\`);
        }
      }
      
      // Send Reply via WhatsApp Cloud API
      try {
        await axios.post(
          \`https://graph.facebook.com/v19.0/\${PHONE_NUMBER_ID}/messages\`,
          { messaging_product: 'whatsapp', to: from, text: { body: replyText } },
          { headers: { Authorization: \`Bearer \${TOKEN}\` } }
        );
      } catch (err) {
        console.error('Error sending WhatsApp message:', err.response?.data || err.message);
      }
    }
    return res.sendStatus(200);
  }
  res.sendStatus(404);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`WhatsApp Bot listening on port \${PORT}\`));
`;
  };

  const requireAccess = (action: () => void) => {
    // If the template is a Paid Game layer and user is NOT subscribed, gate with UpgradeModal
    if (activeTemplate.isPaid && !isSubscribed) {
      setUserEmail(email || "guest@techbuddy.ng");
      setShowUpgradeModal(true);
    } else {
      action();
    }
  };

  const downloadJSON = () => {
    requireAccess(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
      const downloadAnchor = document.createElement("a");
      const filename = `${(flow.businessName || "whatsapp-bot").toLowerCase().replace(/[^a-z0-9]/g, "-")}-flow.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  const downloadNodeJsBot = () => {
    requireAccess(() => {
      const code = generateNodeJsCode();
      const dataStr = "data:text/javascript;charset=utf-8," + encodeURIComponent(code);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "whatsapp-bot-server.js");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

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
        selections: {
          templateId: activeTemplate.id,
          businessName: flow.businessName,
          welcomeMessage: resolveWelcome(flow),
          options: flow.options,
          contactName: name,
          contactPhone: phone,
        },
        result: { optionCount: flow.options.length, isGamePreset: activeTemplate.category !== "Business" },
      });
      await new Promise((r) => setTimeout(r, 400));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTemplates = BOT_TEMPLATES.filter((t) => {
    if (categoryFilter === "free-games") return t.id === "trivia-challenge" || t.id === "lucky-dice";
    if (categoryFilter === "paid-games") return t.isPaid;
    return true;
  });

  return (
    <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 items-start">
      {/* ── Builder form ─────────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* ── Game Presets & Template Selector ────────────────────────────── */}
        <div className="card p-6 border-2 border-[var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand)]/15 text-[var(--brand)]">
                <IconDeviceGamepad2 size={16} />
              </span>
              <p className="font-heading font-bold text-sm text-[var(--ink)]">
                Choose Bot Style &amp; Game Presets
              </p>
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[var(--surface-soft)] p-1 rounded-lg border border-[var(--border)] text-xs">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  categoryFilter === "all"
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                All (6)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("free-games")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  categoryFilter === "free-games"
                    ? "bg-[var(--surface)] text-[var(--good)] shadow-sm"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Free Games (2)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("paid-games")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  categoryFilter === "paid-games"
                    ? "bg-[var(--surface)] text-amber-500 shadow-sm"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                Paid Games (3) 👑
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--ink-muted)] mb-4 leading-relaxed">
            Select a viral game or standard business menu. <strong className="text-[var(--ink)]">Trivia Challenge</strong> and <strong className="text-[var(--ink)]">Lucky Dice</strong> are 100% Free templates. Advanced games (Wordle, Cyber Quest, Airtime Scratch) are Paid Layers.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {filteredTemplates.map((t) => {
              const isSelected = activeTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--brand)] bg-[var(--brand)]/5 ring-2 ring-[var(--brand)]/20"
                      : "border-[var(--border)] bg-[var(--page)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.icon}</span>
                        <h4 className="font-heading font-semibold text-xs text-[var(--ink)]">
                          {t.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                          t.isPaid
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        }`}
                      >
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Banner if Paid Game is Active */}
          {activeTemplate.isPaid && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <IconCrown size={18} className="text-amber-500 shrink-0" />
                <span className="text-[var(--ink)]">
                  <strong>Paid Game Layer Active:</strong> Test in the live simulator freely. Exporting production webhook code requires TechBuddy Premium ($5/mo or ₦2,500/mo).
                </span>
              </div>
              {!isSubscribed && (
                <button
                  type="button"
                  onClick={() => {
                    setUserEmail(email || "guest@techbuddy.ng");
                    setShowUpgradeModal(true);
                  }}
                  className="shrink-0 btn-primary h-7 px-2.5 text-[11px] bg-gradient-to-r from-amber-500 to-amber-600 border-0 text-white shadow-sm flex items-center gap-1"
                >
                  <IconSparkles size={12} />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Your Business / Flow Details ─────────────────────────────────── */}
        <div className="card p-6">
          <p className="eyebrow mb-3">Your Bot Details</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Bot / Business Name</label>
              <input
                value={flow.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Adaeze Studios"
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Welcome Message</label>
              <textarea
                value={flow.welcomeMessage}
                onChange={(e) => set("welcomeMessage", e.target.value)}
                rows={3}
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
              />
              <p className="text-[11px] text-[var(--ink-faint)] mt-1">Use {"{business}"} to insert your bot/business name.</p>
            </div>
          </div>
        </div>

        {/* ── Interactive Menu / Game Options ─────────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow mb-0">Menu &amp; Game Interaction Choices</p>
            <button onClick={addOption} className="btn-ghost h-8 px-3 text-xs"><IconPlus size={13} />Add option</button>
          </div>
          <div className="space-y-3">
            {flow.options.map((o, i) => (
              <div key={o.id} className="border border-[var(--border)] rounded-lg p-3 bg-[var(--surface-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--brand)]">Option {i + 1}</span>
                  <button onClick={() => removeOption(o.id)} className="text-[var(--ink-faint)] hover:text-[var(--bad)] transition-colors" aria-label="Remove option">
                    <IconTrash size={13} />
                  </button>
                </div>
                <input
                  value={o.label}
                  onChange={(e) => updateOption(o.id, { label: e.target.value })}
                  placeholder="Choice Label (e.g. Roll 1 Die or Option 1)"
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 mb-2 focus:outline-none focus:border-[var(--brand)]"
                />
                <textarea
                  value={o.reply}
                  onChange={(e) => updateOption(o.id, { reply: e.target.value })}
                  placeholder="What the bot replies with (supports emojis & results)"
                  rows={2}
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Fallback ────────────────────────────────────────────────────── */}
        <div className="card p-6">
          <p className="eyebrow mb-3">Fallback (unrecognised replies)</p>
          <textarea
            value={flow.fallbackMessage}
            onChange={(e) => set("fallbackMessage", e.target.value)}
            rows={2}
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
          />
        </div>

        {/* ── Notification Settings (Active by Default) ──────────────────── */}
        <div className="card p-6 border-l-4 border-l-[var(--brand)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                flow.notificationsEnabled
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-[var(--surface-soft)] text-[var(--ink-faint)] border border-[var(--border)]"
              }`}>
                {flow.notificationsEnabled ? <IconBell size={18} /> : <IconBellOff size={18} />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-[var(--ink)]">
                    Admin Notifications
                  </h3>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                    flow.notificationsEnabled
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-[var(--border)] text-[var(--ink-muted)]"
                  }`}>
                    {flow.notificationsEnabled ? "Active by Default" : "Turned Off"}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed">
                  Every bot receives real-time customer and winner interaction alerts by default unless manually turned off.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={flow.notificationsEnabled}
              onClick={() => set("notificationsEnabled", !flow.notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                flow.notificationsEnabled ? "bg-[#25D366]" : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  flow.notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {flow.notificationsEnabled && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] grid sm:grid-cols-2 gap-3 text-xs text-[var(--ink-muted)]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow.notificationChannels?.whatsapp ?? true}
                  onChange={(e) =>
                    set("notificationChannels", {
                      whatsapp: e.target.checked,
                      email: flow.notificationChannels?.email ?? true,
                    })
                  }
                  className="rounded border-[var(--border)] text-[#25D366] focus:ring-[#25D366]"
                />
                <span>WhatsApp Admin Alert (Default: ON)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow.notificationChannels?.email ?? true}
                  onChange={(e) =>
                    set("notificationChannels", {
                      whatsapp: flow.notificationChannels?.whatsapp ?? true,
                      email: e.target.checked,
                    })
                  }
                  className="rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
                />
                <span>Email Summary Alert (Default: ON)</span>
              </label>
            </div>
          )}
        </div>

        {/* ── Instant Export & Self-Serve Actions ─────────────────────────── */}
        <div className="card p-6 bg-gradient-to-br from-[var(--surface)] to-[var(--page)] border-2 border-[var(--brand)]/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)] font-mono text-xs font-bold">✓</span>
              <p className="font-heading font-semibold text-sm text-[var(--ink)]">Export &amp; Run Your Bot Flow</p>
            </div>
            {activeTemplate.isPaid && !isSubscribed && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <IconLock size={12} />
                <span>Paid Game Layer</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--ink-muted)] mb-4 leading-relaxed">
            Choose how you want to deploy: copy the formatted text directly into your free WhatsApp Business App, download JSON, or get ready-to-run Node.js webhook code.
          </p>

          <div className="grid sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={copyForWhatsAppApp}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:border-[#25D366] hover:text-[#25D366] transition-all active:scale-95 shadow-sm"
            >
              {copiedAppText ? <IconCheck size={14} className="text-emerald-500" /> : <IconDeviceMobile size={14} />}
              <span>{copiedAppText ? "Copied!" : "WhatsApp App Text"}</span>
            </button>

            <button
              type="button"
              onClick={downloadJSON}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all active:scale-95 shadow-sm"
            >
              {activeTemplate.isPaid && !isSubscribed ? <IconLock size={14} className="text-amber-500" /> : <IconDownload size={14} />}
              <span>Download JSON</span>
            </button>

            <button
              type="button"
              onClick={downloadNodeJsBot}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all active:scale-95 shadow-sm"
            >
              {activeTemplate.isPaid && !isSubscribed ? <IconLock size={14} className="text-amber-500" /> : <IconCode size={14} />}
              <span>Node.js Server Code</span>
            </button>
          </div>
        </div>

        {/* ── Official Meta Cloud Deployment (Agency Service) ─────────────── */}
        <div className="card p-6">
          <p className="eyebrow mb-1">Want TechBuddy to deploy on Meta Cloud API for you?</p>
          <p className="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
            Need official green badge verification, multi-agent inbox, and enterprise scaling? Send your flow to our engineering team and we will configure the Meta WhatsApp Cloud API infrastructure for you.
          </p>
          {sent ? (
            <div className="flex items-center gap-2 text-[var(--good)] text-sm">
              <IconCheck size={16} className="shrink-0" />
              <span>Sent! We&apos;ll follow up within 24 hours to get this live on Meta Cloud API.</span>
            </div>
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
                {submitting ? "Sending…" : "Deploy with TechBuddy Team"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <p className="text-xs text-[var(--ink-faint)] text-center mb-4">
          Live WhatsApp game &amp; bot preview — tap any option to play
        </p>
        <ChatMock flow={flow} />
      </div>

      {/* ── Upgrade Modal ─────────────────────────────────────────────────── */}
      {showUpgradeModal && (
        <UpgradeModal
          email={userEmail}
          feature={GAME_UPGRADE_COPY}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
}
