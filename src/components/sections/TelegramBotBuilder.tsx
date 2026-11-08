"use client";

import { useState, useEffect } from "react";
import {
  IconPlus,
  IconTrash,
  IconSend,
  IconCheck,
  IconLoader2,
  IconAlertCircle,
  IconCopy,
  IconDownload,
  IconCode,
  IconCrown,
  IconLock,
  IconBrandTelegram,
  IconDeviceMobile,
  IconBell,
  IconBellOff,
  IconTerminal2,
  IconSparkles,
} from "@tabler/icons-react";
import {
  type TelegramCommand,
  type TelegramInlineButton,
  type TelegramBotFlow,
  DEFAULT_TG_BOT_FLOW,
  uid,
} from "@/types/telegramBot";
import { captureToolLead } from "@/lib/captureToolLead";
import { validateEmail, validateName } from "@/lib/validate";
import { UpgradeModal, type UpgradeFeatureCopy } from "@/components/ui/UpgradeModal";
import { authFetch } from "@/lib/authFetch";

const PREMIUM_COPY: UpgradeFeatureCopy = {
  title: "Unlock Telegram Bot Engine & Production Webhooks",
  description:
    "Export production-grade Telegram bots with webhook handlers, inline keyboard dispatchers, and automated admin alerts.",
  benefits: [
    "Full Node.js (Telegraf) & Python (python-telegram-bot) server source code",
    "Real-time Admin Notifications (Telegram & Email alerts default active)",
    "Meta & Telegram API webhook verification & SSL deployment ready",
    "Full access to all 20+ TechBuddy premium tools & code generators",
  ],
};

function resolveWelcome(flow: TelegramBotFlow): string {
  return flow.welcomeMessage.replace("{botName}", flow.botName || "our assistant");
}

/* ── Interactive Telegram Simulator ───────────────────────────────────────── */

function TelegramChatMock({
  flow,
  onTriggerCommand,
  onTriggerButton,
}: {
  flow: TelegramBotFlow;
  onTriggerCommand: (cmd: TelegramCommand) => void;
  onTriggerButton: (btn: TelegramInlineButton) => void;
}) {
  const [messages, setMessages] = useState<
    { id: string; sender: "bot" | "user"; text: string; time: string }[]
  >([
    {
      id: "init-1",
      sender: "bot",
      text: resolveWelcome(flow),
      time: "12:00",
    },
  ]);

  const handleCommandClick = (cmd: TelegramCommand) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "user", text: cmd.command, time },
      { id: uid(), sender: "bot", text: cmd.reply, time },
    ]);
    onTriggerCommand(cmd);
  };

  const handleButtonClick = (btn: TelegramInlineButton) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "user", text: btn.label, time },
      { id: uid(), sender: "bot", text: btn.reply, time },
    ]);
    onTriggerButton(btn);
  };

  return (
    <div className="rounded-[32px] border-8 border-[#0f172a] bg-[#0e1621] w-full max-w-[320px] mx-auto overflow-hidden shadow-2xl text-white font-sans flex flex-col h-[560px]">
      {/* Telegram App Bar */}
      <div className="bg-[#17212b] px-4 py-3 flex items-center justify-between border-b border-[#232e3c] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#229ED9] to-[#54c0f8] flex items-center justify-center text-white shadow-sm">
            <IconBrandTelegram size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold leading-tight text-white">{flow.botName || "Telegram Bot"}</p>
              <span className="text-[9px] bg-[#229ED9]/20 text-[#54c0f8] px-1.5 py-0.2 rounded font-mono">bot</span>
            </div>
            <p className="text-[10px] text-[#708499]">{flow.botUsername || "@bot"}</p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Bot active" />
      </div>

      {/* Messages Scroll Area */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto text-[13px] leading-relaxed scrollbar-thin">
        {/* Date pill */}
        <div className="text-center">
          <span className="bg-[#182533]/80 text-[#798e9f] text-[10px] px-2.5 py-0.5 rounded-full font-mono">
            Today
          </span>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-[#2b5278] text-white rounded-br-none"
                  : "bg-[#182533] text-[#e4ecf2] border border-[#232e3c] rounded-bl-none"
              }`}
            >
              <p>{m.text}</p>
              <span className="block text-[9px] text-[#6c7883] text-right mt-1 font-mono">
                {m.time} {m.sender === "user" && "✓✓"}
              </span>
            </div>
          </div>
        ))}

        {/* Inline Keyboard Preview */}
        {flow.inlineButtons.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] text-[#708499] font-mono px-1">INLINE KEYBOARD</p>
            <div className="grid gap-1.5">
              {flow.inlineButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  type="button"
                  className="w-full bg-[#242f3d] hover:bg-[#2e3b4d] text-[#54c0f8] text-xs font-medium py-2 px-3 rounded-xl border border-[#2d3a4b] transition-colors text-center active:scale-98"
                >
                  {btn.label || "Button"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Command Bar Footer */}
      <div className="bg-[#17212b] p-2 border-t border-[#232e3c] shrink-0">
        <p className="text-[10px] text-[#708499] mb-1.5 px-1 font-mono">COMMAND MENU</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {flow.commands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleCommandClick(cmd)}
              type="button"
              className="shrink-0 bg-[#242f3d] hover:bg-[#2b5278] text-white text-[11px] px-2.5 py-1 rounded-lg border border-[#2d3a4b] transition-all"
            >
              {cmd.command}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Telegram Bot Builder Component ──────────────────────────────────── */

export function TelegramBotBuilder() {
  const [flow, setFlow] = useState<TelegramBotFlow>(DEFAULT_TG_BOT_FLOW);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Premium status & Upgrade modal
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Export states
  const [copiedCommands, setCopiedCommands] = useState(false);

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
        // Not logged in or no active subscription
      }
    })();
  }, []);

  const set = <K extends keyof TelegramBotFlow>(key: K, value: TelegramBotFlow[K]) =>
    setFlow((prev) => ({ ...prev, [key]: value }));

  // Commands management
  const addCommand = () =>
    setFlow((prev) => ({
      ...prev,
      commands: [...prev.commands, { id: uid(), command: `/cmd${prev.commands.length + 1}`, description: "Custom command", reply: "Reply message here." }],
    }));

  const removeCommand = (id: string) =>
    setFlow((prev) => ({ ...prev, commands: prev.commands.filter((c) => c.id !== id) }));

  const updateCommand = (id: string, patch: Partial<TelegramCommand>) =>
    setFlow((prev) => ({
      ...prev,
      commands: prev.commands.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  // Inline buttons management
  const addButton = () =>
    setFlow((prev) => ({
      ...prev,
      inlineButtons: [
        ...prev.inlineButtons,
        { id: uid(), label: "New Button", callbackData: `cb_${uid()}`, reply: "You clicked the button!" },
      ],
    }));

  const removeButton = (id: string) =>
    setFlow((prev) => ({ ...prev, inlineButtons: prev.inlineButtons.filter((b) => b.id !== id) }));

  const updateButton = (id: string, patch: Partial<TelegramInlineButton>) =>
    setFlow((prev) => ({
      ...prev,
      inlineButtons: prev.inlineButtons.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));

  // Copy BotFather /setcommands string
  const copyBotFatherCommands = async () => {
    const lines = flow.commands
      .map((c) => `${c.command.replace("/", "").toLowerCase()} - ${c.description || "Action"}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopiedCommands(true);
      setTimeout(() => setCopiedCommands(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Code Generators (Gated Premium Features) ───────────────────────────── */

  const generateNodeJsCode = () => {
    return `// Production Telegram Bot Server for ${flow.botName || "My Telegram Bot"}
// Generated with TechBuddy Telegram Bot Engine (https://techbuddy.ng)
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN || '${flow.botToken || "YOUR_TELEGRAM_BOT_TOKEN"}';
const bot = new Telegraf(BOT_TOKEN);

const NOTIFICATIONS_ENABLED = ${flow.notificationsEnabled};
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';

// Notification dispatcher (Active by default)
async function sendAdminNotification(ctx, action) {
  if (!NOTIFICATIONS_ENABLED || !ADMIN_CHAT_ID) return;
  try {
    const user = ctx.from ? \`@\${ctx.from.username || ctx.from.first_name} (ID: \${ctx.from.id})\` : 'Anonymous';
    await ctx.telegram.sendMessage(ADMIN_CHAT_ID, \`🔔 [ALERT] User \${user} triggered: \${action}\`);
  } catch (err) {
    console.error('Notification error:', err.message);
  }
}

// Inline Keyboard Layout
const inlineKeyboard = Markup.inlineKeyboard([
${flow.inlineButtons
  .map(
    (b) => `  [Markup.button.callback(${JSON.stringify(b.label)}, ${JSON.stringify(b.callbackData)})],`
  )
  .join("\n")}
]);

// Welcome /start command
bot.start(async (ctx) => {
  await sendAdminNotification(ctx, '/start command');
  return ctx.replyWithMarkdown(${JSON.stringify(resolveWelcome(flow))}, inlineKeyboard);
});

// Slash Commands
${flow.commands
  .map((c) => {
    const cmdName = c.command.replace("/", "").trim().toLowerCase();
    return `bot.command('${cmdName}', async (ctx) => {
  await sendAdminNotification(ctx, '/${cmdName}');
  return ctx.replyWithMarkdown(${JSON.stringify(c.reply)});
});`;
  })
  .join("\n\n")}

// Inline Button Callback Queries
${flow.inlineButtons
  .map((b) => {
    return `bot.action('${b.callbackData}', async (ctx) => {
  await ctx.answerCbQuery();
  await sendAdminNotification(ctx, 'button: ${b.label}');
  return ctx.replyWithMarkdown(${JSON.stringify(b.reply)});
});`;
  })
  .join("\n\n")}

// Fallback Handler
bot.on('message', async (ctx) => {
  return ctx.reply(${JSON.stringify(flow.fallbackMessage)});
});

// Launch Bot (Polling or Webhook)
bot.launch().then(() => {
  console.log('🤖 Telegram Bot is running live!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
`;
  };

  const generatePythonCode = () => {
    return `# Production Telegram Bot Server (Python) for ${flow.botName || "My Telegram Bot"}
# Generated with TechBuddy Telegram Bot Engine (https://techbuddy.ng)
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes

BOT_TOKEN = "${flow.botToken || "YOUR_TELEGRAM_BOT_TOKEN"}"
NOTIFICATIONS_ENABLED = ${flow.notificationsEnabled ? "True" : "False"}

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
${flow.inlineButtons
  .map(
    (b) => `        [InlineKeyboardButton("${b.label}", callback_data="${b.callbackData}")],`
  )
  .join("\n")}
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    if NOTIFICATIONS_ENABLED:
        logging.info(f"[NOTIFICATION] /start initiated by {update.effective_user.username}")
    await update.message.reply_text("${resolveWelcome(flow).replace(/\n/g, "\\n")}", reply_markup=reply_markup)

${flow.commands
  .map((c) => {
    const cmdName = c.command.replace("/", "").trim().toLowerCase();
    return `async def cmd_${cmdName}(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if NOTIFICATIONS_ENABLED:
        logging.info(f"[NOTIFICATION] /${cmdName} triggered by {update.effective_user.username}")
    await update.message.reply_text("""${c.reply}""")`;
  })
  .join("\n\n")}

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    ${flow.inlineButtons
      .map(
        (b) => `if data == "${b.callbackData}":
        await query.message.reply_text("""${b.reply}""")`
      )
      .join("\n    el")}

if __name__ == '__main__':
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
${flow.commands
  .map((c) => {
    const cmdName = c.command.replace("/", "").trim().toLowerCase();
    return `    app.add_handler(CommandHandler("${cmdName}", cmd_${cmdName}))`;
  })
  .join("\n")}
    app.add_handler(CallbackQueryHandler(button_callback))
    print("🤖 Python Telegram Bot is running...")
    app.run_polling()
`;
  };

  // Require Premium or Launch UpgradeModal
  const requirePremiumAction = (action: () => void) => {
    if (isSubscribed) {
      action();
    } else {
      setUserEmail(email || "guest@techbuddy.ng");
      setShowUpgradeModal(true);
    }
  };

  const downloadNodeJs = () => {
    requirePremiumAction(() => {
      const code = generateNodeJsCode();
      const dataStr = "data:text/javascript;charset=utf-8," + encodeURIComponent(code);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "telegram-bot-server.js");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  const downloadPython = () => {
    requirePremiumAction(() => {
      const code = generatePythonCode();
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(code);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "telegram_bot.py");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  const downloadJSON = () => {
    requirePremiumAction(() => {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "telegram-bot-flow.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  // Lead Submission / Managed Deployment
  const submitManagedDeployment = async () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    if (nameErr || emailErr) {
      setError(nameErr ?? emailErr);
      return;
    }
    if (!flow.botName.trim()) {
      setError("Please provide a Bot Name.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      captureToolLead({
        tool: "telegram-bot-builder",
        source: "quote-click",
        email,
        selections: {
          botName: flow.botName,
          botUsername: flow.botUsername,
          welcomeMessage: resolveWelcome(flow),
          commands: flow.commands,
          inlineButtons: flow.inlineButtons,
          contactName: name,
          contactPhone: phone,
        },
        result: { commandCount: flow.commands.length, buttonCount: flow.inlineButtons.length },
      });
      await new Promise((r) => setTimeout(r, 450));
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 items-start">
      {/* ── Builder Controls ──────────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Premium Banner */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-[var(--brand)]/10 to-transparent border border-amber-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <IconCrown size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-[var(--ink)]">
                  TechBuddy Premium Service
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
                  Paid Tool
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                Design freely &amp; test live. Exporting production Node.js &amp; Python webhook code requires Premium.
              </p>
            </div>
          </div>
          {!isSubscribed && (
            <button
              onClick={() => {
                setUserEmail(email || "guest@techbuddy.ng");
                setShowUpgradeModal(true);
              }}
              type="button"
              className="shrink-0 btn-primary h-9 px-3.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md flex items-center gap-1.5"
            >
              <IconSparkles size={14} />
              <span>Upgrade ($5 / ₦2,500)</span>
            </button>
          )}
        </div>

        {/* ── Bot Identity ────────────────────────────────────────────────── */}
        <div className="card p-6">
          <p className="eyebrow mb-3">1. Bot Profile &amp; Identity</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Bot Name</label>
              <input
                value={flow.botName}
                onChange={(e) => set("botName", e.target.value)}
                placeholder="TechBuddy Assistant"
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Telegram @username</label>
              <input
                value={flow.botUsername}
                onChange={(e) => set("botUsername", e.target.value)}
                placeholder="@techbuddy_assistant_bot"
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Welcome Message (/start)</label>
            <textarea
              value={flow.welcomeMessage}
              onChange={(e) => set("welcomeMessage", e.target.value)}
              rows={3}
              className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
            />
            <p className="text-[11px] text-[var(--ink-faint)] mt-1">Use {"{botName}"} to dynamically insert the bot title.</p>
          </div>
        </div>

        {/* ── Slash Commands ──────────────────────────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow mb-0">2. Slash Commands (Bot Menu)</p>
            <button onClick={addCommand} type="button" className="btn-ghost h-8 px-3 text-xs">
              <IconPlus size={13} /> Add Command
            </button>
          </div>
          <div className="space-y-3">
            {flow.commands.map((c) => (
              <div key={c.id} className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[var(--brand)]">{c.command || "/command"}</span>
                    <span className="text-[11px] text-[var(--ink-faint)]">· {c.description}</span>
                  </div>
                  <button
                    onClick={() => removeCommand(c.id)}
                    type="button"
                    className="text-[var(--ink-faint)] hover:text-[var(--bad)] transition-colors"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-2">
                  <input
                    value={c.command}
                    onChange={(e) => updateCommand(c.id, { command: e.target.value })}
                    placeholder="/command"
                    className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5 font-mono"
                  />
                  <input
                    value={c.description}
                    onChange={(e) => updateCommand(c.id, { description: e.target.value })}
                    placeholder="Short description for menu"
                    className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5"
                  />
                </div>
                <textarea
                  value={c.reply}
                  onChange={(e) => updateCommand(c.id, { reply: e.target.value })}
                  placeholder="Bot reply text (supports Markdown: *bold*, _italic_)"
                  rows={2}
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Inline Keyboard Buttons ─────────────────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow mb-0">3. Telegram Inline Keyboard Buttons</p>
            <button onClick={addButton} type="button" className="btn-ghost h-8 px-3 text-xs">
              <IconPlus size={13} /> Add Button
            </button>
          </div>
          <div className="space-y-3">
            {flow.inlineButtons.map((b) => (
              <div key={b.id} className="border border-[var(--border)] rounded-xl p-3 bg-[var(--surface-soft)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#229ED9]">{b.label || "Button Label"}</span>
                  <button
                    onClick={() => removeButton(b.id)}
                    type="button"
                    className="text-[var(--ink-faint)] hover:text-[var(--bad)] transition-colors"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-2">
                  <input
                    value={b.label}
                    onChange={(e) => updateButton(b.id, { label: e.target.value })}
                    placeholder="Button Label (e.g. ⚡ Request Quote)"
                    className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5"
                  />
                  <input
                    value={b.callbackData}
                    onChange={(e) => updateButton(b.id, { callbackData: e.target.value })}
                    placeholder="Callback data key (e.g. cb_quote)"
                    className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5 font-mono"
                  />
                </div>
                <textarea
                  value={b.reply}
                  onChange={(e) => updateButton(b.id, { reply: e.target.value })}
                  placeholder="What the bot replies when this button is tapped"
                  rows={2}
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink)] py-1.5 px-2.5 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Notification Settings (Active by Default) ──────────────────── */}
        <div className="card p-6 border-l-4 border-l-[#229ED9]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  flow.notificationsEnabled
                    ? "bg-[#229ED9]/15 text-[#229ED9] border border-[#229ED9]/30"
                    : "bg-[var(--surface-soft)] text-[var(--ink-faint)] border border-[var(--border)]"
                }`}
              >
                {flow.notificationsEnabled ? <IconBell size={18} /> : <IconBellOff size={18} />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-[var(--ink)]">
                    Admin Notifications
                  </h3>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                      flow.notificationsEnabled
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-[var(--border)] text-[var(--ink-muted)]"
                    }`}
                  >
                    {flow.notificationsEnabled ? "Active by Default" : "Turned Off"}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-0.5 leading-relaxed">
                  Every bot interaction automatically sends real-time alerts to the admin chat ID or email unless toggled off.
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
                flow.notificationsEnabled ? "bg-[#229ED9]" : "bg-[var(--border)]"
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
                  checked={flow.notificationChannels?.telegram ?? true}
                  onChange={(e) =>
                    set("notificationChannels", {
                      telegram: e.target.checked,
                      email: flow.notificationChannels?.email ?? true,
                    })
                  }
                  className="rounded border-[var(--border)] text-[#229ED9] focus:ring-[#229ED9]"
                />
                <span>Telegram Admin Channel Alert (Default: ON)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow.notificationChannels?.email ?? true}
                  onChange={(e) =>
                    set("notificationChannels", {
                      telegram: flow.notificationChannels?.telegram ?? true,
                      email: e.target.checked,
                    })
                  }
                  className="rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
                />
                <span>Email Summary Webhook (Default: ON)</span>
              </label>
            </div>
          )}
        </div>

        {/* ── Paid Code Exporter & Gated Engine ────────────────────────────── */}
        <div className="card p-6 bg-gradient-to-br from-[var(--surface)] to-[var(--page)] border-2 border-[#229ED9]/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#229ED9]/15 text-[#229ED9]">
                <IconCode size={14} />
              </span>
              <h3 className="font-heading font-semibold text-sm text-[var(--ink)]">
                Production Code Exporter
              </h3>
            </div>
            {!isSubscribed && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <IconLock size={12} />
                <span>Premium Service</span>
              </span>
            )}
          </div>

          <p className="text-xs text-[var(--ink-muted)] mb-5 leading-relaxed">
            Get instant production-ready code with complete Telegram Bot API webhooks, inline keyboard handlers, and active admin notifications.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            {/* BotFather Commands (Free) */}
            <button
              type="button"
              onClick={copyBotFatherCommands}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:border-[#229ED9] hover:text-[#229ED9] transition-all active:scale-95 shadow-sm"
            >
              {copiedCommands ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
              <span>{copiedCommands ? "Copied!" : "BotFather Menu (Free)"}</span>
            </button>

            {/* Node.js Telegraf Code (Paid) */}
            <button
              type="button"
              onClick={downloadNodeJs}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#229ED9]/40 bg-[#229ED9]/10 px-3 py-2.5 text-xs font-semibold text-[#229ED9] hover:bg-[#229ED9]/20 transition-all active:scale-95 shadow-sm"
            >
              {!isSubscribed ? <IconLock size={14} className="text-amber-500" /> : <IconDownload size={14} />}
              <span>Node.js Webhook Server</span>
            </button>

            {/* Python Telegram Code (Paid) */}
            <button
              type="button"
              onClick={downloadPython}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all active:scale-95 shadow-sm"
            >
              {!isSubscribed ? <IconLock size={14} className="text-amber-500" /> : <IconTerminal2 size={14} />}
              <span>Python Bot Script</span>
            </button>
          </div>

          {!isSubscribed && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[var(--ink-muted)]">
                Subscribe to TechBuddy Premium to download full server code &amp; deploy unlimited bots.
              </span>
              <button
                type="button"
                onClick={() => {
                  setUserEmail(email || "guest@techbuddy.ng");
                  setShowUpgradeModal(true);
                }}
                className="text-[#229ED9] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Unlock Full Access</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Managed Hosting & Engineering Deployment ────────────────────── */}
        <div className="card p-6">
          <p className="eyebrow mb-1">Want 24/7 Managed Cloud Hosting &amp; Custom Integration?</p>
          <p className="text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
            Need us to host your Telegram Bot on AWS/Docker with 99.9% uptime, database storage, and CRM webhooks? Submit your flow to our engineering team.
          </p>

          {sent ? (
            <div className="flex items-center gap-2 text-[var(--good)] text-sm">
              <IconCheck size={16} className="shrink-0" />
              <span>Received! A TechBuddy engineer will contact you within 15 minutes to initiate deployment.</span>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  type="email"
                  className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telegram @username or Phone"
                  className="bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-[var(--bad)] text-xs mb-3">
                  <IconAlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                onClick={submitManagedDeployment}
                disabled={submitting}
                className="btn-primary h-11 px-6 text-sm bg-[#229ED9] hover:bg-[#1f8ec4] text-white border-0"
              >
                {submitting ? <IconLoader2 size={16} className="animate-spin" /> : <IconSend size={16} />}
                <span>{submitting ? "Submitting…" : "Deploy Managed Bot with TechBuddy"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Interactive Telegram Simulator (Sticky) ──────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <p className="text-xs text-[var(--ink-faint)] text-center mb-3">
          Interactive Telegram simulator — tap commands or buttons
        </p>
        <TelegramChatMock
          flow={flow}
          onTriggerCommand={() => {}}
          onTriggerButton={() => {}}
        />
      </div>

      {/* ── Upgrade Modal ─────────────────────────────────────────────────── */}
      {showUpgradeModal && (
        <UpgradeModal
          email={userEmail}
          feature={PREMIUM_COPY}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  );
}

