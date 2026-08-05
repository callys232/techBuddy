"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { IconDownload, IconLink, IconWifi, IconMail, IconPhone, IconAddressBook, IconAlignLeft, IconBrandWhatsapp } from "@tabler/icons-react";

type QrType = "url" | "text" | "wifi" | "email" | "phone" | "whatsapp" | "vcard";

const TYPES: { id: QrType; label: string; icon: React.ReactNode }[] = [
  { id: "url",      label: "Link",     icon: <IconLink size={15} /> },
  { id: "whatsapp", label: "WhatsApp", icon: <IconBrandWhatsapp size={15} /> },
  { id: "wifi",     label: "WiFi",     icon: <IconWifi size={15} /> },
  { id: "vcard",    label: "Contact",  icon: <IconAddressBook size={15} /> },
  { id: "email",    label: "Email",    icon: <IconMail size={15} /> },
  { id: "phone",    label: "Phone",    icon: <IconPhone size={15} /> },
  { id: "text",     label: "Text",     icon: <IconAlignLeft size={15} /> },
];

function buildPayload(type: QrType, f: Record<string, string>): string {
  switch (type) {
    case "url":
      return f.url?.trim() || "";
    case "text":
      return f.text?.trim() || "";
    case "whatsapp": {
      const digits = (f.phone || "").replace(/[^\d]/g, "");
      return digits ? `https://wa.me/${digits}${f.message ? `?text=${encodeURIComponent(f.message)}` : ""}` : "";
    }
    case "wifi":
      return f.ssid ? `WIFI:T:${f.security || "WPA"};S:${f.ssid};P:${f.password || ""};;` : "";
    case "email":
      return f.email ? `mailto:${f.email}${f.subject ? `?subject=${encodeURIComponent(f.subject)}` : ""}` : "";
    case "phone":
      return f.phone ? `tel:${f.phone.replace(/[^\d+]/g, "")}` : "";
    case "vcard":
      return f.name
        ? `BEGIN:VCARD\nVERSION:3.0\nN:${f.name}\nFN:${f.name}\nORG:${f.org || ""}\nTEL:${f.phone || ""}\nEMAIL:${f.email || ""}\nEND:VCARD`
        : "";
    default:
      return "";
  }
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30 transition-colors py-2 px-3"
      />
    </div>
  );
}

export function QrCodeGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [color, setColor] = useState("#1E3A8A");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [empty, setEmpty] = useState(true);

  const setField = (k: string, v: string) => setFields((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    const payload = buildPayload(type, fields);
    setEmpty(!payload);
    if (!canvasRef.current) return;
    if (!payload) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 288,
      margin: 2,
      color: { dark: color, light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    }).catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, fields, color]);

  const download = async (format: "png" | "svg") => {
    const payload = buildPayload(type, fields);
    if (!payload) return;
    if (format === "png" && canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
    } else {
      const svg = await QRCode.toString(payload, { type: "svg", margin: 2, color: { dark: color, light: "#FFFFFF" } });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.svg";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <p className="eyebrow mb-3">What are you encoding?</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setType(t.id); setFields({}); }}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-[11px] font-medium transition-colors ${
                type === t.id ? "border-[var(--brand)] bg-[var(--brand)]/8 text-[var(--brand)]" : "border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--brand)]/30"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {type === "url" && <Field label="URL" value={fields.url ?? ""} onChange={(v) => setField("url", v)} placeholder="https://techbuddy.ng" />}
          {type === "text" && (
            <div>
              <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Text</label>
              <textarea
                value={fields.text ?? ""}
                onChange={(e) => setField("text", e.target.value)}
                rows={4}
                className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          )}
          {type === "whatsapp" && (
            <>
              <Field label="WhatsApp number (with country code)" value={fields.phone ?? ""} onChange={(v) => setField("phone", v)} placeholder="2348012345678" />
              <Field label="Pre-filled message (optional)" value={fields.message ?? ""} onChange={(v) => setField("message", v)} placeholder="Hi! I'd like to know more…" />
            </>
          )}
          {type === "wifi" && (
            <>
              <Field label="Network name (SSID)" value={fields.ssid ?? ""} onChange={(v) => setField("ssid", v)} />
              <Field label="Password" value={fields.password ?? ""} onChange={(v) => setField("password", v)} />
              <div>
                <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Security</label>
                <select
                  value={fields.security ?? "WPA"}
                  onChange={(e) => setField("security", e.target.value)}
                  className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </>
          )}
          {type === "email" && (
            <>
              <Field label="Email address" value={fields.email ?? ""} onChange={(v) => setField("email", v)} type="email" />
              <Field label="Subject (optional)" value={fields.subject ?? ""} onChange={(v) => setField("subject", v)} />
            </>
          )}
          {type === "phone" && <Field label="Phone number" value={fields.phone ?? ""} onChange={(v) => setField("phone", v)} placeholder="+234…" />}
          {type === "vcard" && (
            <>
              <Field label="Full name" value={fields.name ?? ""} onChange={(v) => setField("name", v)} />
              <Field label="Organisation" value={fields.org ?? ""} onChange={(v) => setField("org", v)} />
              <Field label="Phone" value={fields.phone ?? ""} onChange={(v) => setField("phone", v)} />
              <Field label="Email" value={fields.email ?? ""} onChange={(v) => setField("email", v)} type="email" />
            </>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Colour</label>
          <div className="flex items-center gap-2">
            {["#1E3A8A", "#111827", "#059669", "#DC2626", "#7C3AED"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-7 w-7 rounded-full border-2 transition-transform ${color === c ? "border-[var(--ink)] scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-7 rounded-full border border-[var(--border)] cursor-pointer" />
          </div>
        </div>
      </div>

      {/* ── Preview ──────────────────────────────────────────────────────── */}
      <div className="card p-8 flex flex-col items-center lg:sticky lg:top-24">
        <div className="rounded-xl border border-[var(--border)] p-4 bg-white mb-6">
          <canvas ref={canvasRef} width={288} height={288} className={empty ? "opacity-20" : ""} />
        </div>
        {empty && <p className="text-sm text-[var(--ink-faint)] mb-4 text-center">Fill in the details to generate your QR code</p>}
        <div className="flex gap-2 w-full">
          <button onClick={() => download("png")} disabled={empty} className="btn-primary flex-1 h-11 text-sm disabled:opacity-40">
            <IconDownload size={15} />PNG
          </button>
          <button onClick={() => download("svg")} disabled={empty} className="btn-ghost flex-1 h-11 text-sm disabled:opacity-40">
            <IconDownload size={15} />SVG
          </button>
        </div>
      </div>
    </div>
  );
}
