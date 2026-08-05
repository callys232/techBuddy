"use client";

import { useState } from "react";
import { IconPlus, IconTrash, IconDownload, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import {
  type InvoiceData,
  type InvoiceItem,
  CURRENCY_SYMBOLS,
  DEFAULT_INVOICE_DATA,
  invoiceTotals,
  uid,
} from "@/types/invoice";
import { captureToolLead } from "@/lib/captureToolLead";

function fmt(n: number, currency: InvoiceData["currency"]) {
  return `${CURRENCY_SYMBOLS[currency]}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const addItem = () =>
    setData((prev) => ({ ...prev, items: [...prev.items, { id: uid(), description: "", quantity: 1, unitPrice: 0 }] }));
  const removeItem = (id: string) =>
    setData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    setData((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  const { subtotal, tax, total } = invoiceTotals(data);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/invoice-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceData: data }),
      });
      if (!res.ok) throw new Error("Could not generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      captureToolLead({
        tool: "invoice-generator",
        source: "email-capture",
        email: data.toEmail || data.fromEmail || undefined,
        selections: { currency: data.currency, itemCount: data.items.length },
        result: { total: Math.round(total) },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="card p-6 space-y-6">
        <div>
          <p className="eyebrow mb-3">Invoice details</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Invoice #" value={data.invoiceNumber} onChange={(v) => set("invoiceNumber", v)} />
            <Field label="Issue date" value={data.issueDate} onChange={(v) => set("issueDate", v)} type="date" />
            <Field label="Due date" value={data.dueDate} onChange={(v) => set("dueDate", v)} type="date" />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => set("currency", e.target.value as InvoiceData["currency"])}
              className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
            >
              {Object.keys(CURRENCY_SYMBOLS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">From (your business)</p>
          <div className="space-y-3">
            <Field label="Business name" value={data.fromName} onChange={(v) => set("fromName", v)} placeholder="Adaeze Studios" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" value={data.fromEmail} onChange={(v) => set("fromEmail", v)} type="email" placeholder="hello@adaezestudios.com" />
              <Field label="Phone" value={data.fromPhone} onChange={(v) => set("fromPhone", v)} placeholder="+234…" />
            </div>
            <Field label="Address" value={data.fromAddress} onChange={(v) => set("fromAddress", v)} placeholder="12 Admiralty Way, Lekki, Lagos" />
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Bill to</p>
          <div className="space-y-3">
            <Field label="Client name" value={data.toName} onChange={(v) => set("toName", v)} placeholder="Client business name" />
            <Field label="Client email" value={data.toEmail} onChange={(v) => set("toEmail", v)} type="email" />
            <Field label="Client address" value={data.toAddress} onChange={(v) => set("toAddress", v)} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="eyebrow mb-0">Line items</p>
            <button onClick={addItem} className="btn-ghost h-8 px-3 text-xs"><IconPlus size={13} />Add item</button>
          </div>
          <div className="space-y-2">
            {data.items.map((item) => (
              <div key={item.id} className="flex gap-2 items-start">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  placeholder="Description"
                  className="flex-1 bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 focus:outline-none focus:border-[var(--brand)]"
                />
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                  className="w-16 bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-2 focus:outline-none focus:border-[var(--brand)]"
                />
                <input
                  type="number"
                  min={0}
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                  className="w-24 bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-2 focus:outline-none focus:border-[var(--brand)]"
                />
                <button onClick={() => removeItem(item.id)} className="h-9 w-9 shrink-0 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--bad)] transition-colors" aria-label="Remove item">
                  <IconTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tax rate (%)" value={String(data.taxRate)} onChange={(v) => set("taxRate", Number(v) || 0)} type="number" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Payment details (bank account, etc.)</label>
          <textarea
            value={data.bankDetails}
            onChange={(e) => set("bankDetails", e.target.value)}
            rows={2}
            placeholder="GTBank · 0123456789 · Adaeze Studios Ltd"
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Notes</label>
          <textarea
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={2}
            className="w-full bg-[var(--page)] border border-[var(--border)] rounded-lg text-sm text-[var(--ink)] py-2 px-3 resize-none focus:outline-none focus:border-[var(--brand)]"
          />
        </div>
      </div>

      {/* ── Live preview ─────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <div className="card p-8 bg-[var(--surface)]">
          <div className="flex items-start justify-between mb-8">
            <p className="font-heading font-bold text-lg text-[var(--brand)]">{data.fromName || "Your Business"}</p>
            <div className="text-right">
              <p className="font-heading font-extrabold text-xl text-[var(--ink)]">INVOICE</p>
              <p className="text-xs text-[var(--ink-muted)] mt-1">{data.invoiceNumber}</p>
              <p className="text-xs text-[var(--ink-muted)]">Due {data.dueDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">From</p>
              <p className="text-sm font-semibold text-[var(--ink)]">{data.fromName || "—"}</p>
              {data.fromEmail && <p className="text-xs text-[var(--ink-muted)]">{data.fromEmail}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">Bill to</p>
              <p className="text-sm font-semibold text-[var(--ink)]">{data.toName || "—"}</p>
              {data.toEmail && <p className="text-xs text-[var(--ink-muted)]">{data.toEmail}</p>}
            </div>
          </div>

          <div className="border-t-2 border-[var(--ink)] pt-2 mb-2">
            <div className="flex text-[10px] font-bold uppercase tracking-wider text-[var(--ink-faint)] pb-2 border-b border-[var(--border)]">
              <span className="flex-1">Description</span>
              <span className="w-16 text-right">Qty</span>
              <span className="w-20 text-right">Amount</span>
            </div>
            {data.items.map((item) => (
              <div key={item.id} className="flex text-sm py-2 border-b border-[var(--border)]/60">
                <span className="flex-1 text-[var(--ink)]">{item.description || "—"}</span>
                <span className="w-16 text-right text-[var(--ink-muted)]">{item.quantity}</span>
                <span className="w-20 text-right font-medium text-[var(--ink)]">{fmt(item.quantity * item.unitPrice, data.currency)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-1 mt-4 mb-6">
            <div className="flex justify-between w-40 text-sm text-[var(--ink-muted)]">
              <span>Subtotal</span><span>{fmt(subtotal, data.currency)}</span>
            </div>
            <div className="flex justify-between w-40 text-sm text-[var(--ink-muted)]">
              <span>Tax ({data.taxRate}%)</span><span>{fmt(tax, data.currency)}</span>
            </div>
            <div className="flex justify-between w-40 text-base font-bold text-[var(--brand)] pt-2 border-t border-[var(--ink)]">
              <span>Total</span><span>{fmt(total, data.currency)}</span>
            </div>
          </div>
        </div>

        {error && <div className="flex items-center gap-2 text-[var(--bad)] text-sm mt-3"><IconAlertCircle size={15} className="shrink-0" /><span>{error}</span></div>}

        <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full h-12 text-sm mt-4">
          {downloading ? <IconLoader2 size={16} className="animate-spin" /> : <IconDownload size={16} />}
          {downloading ? "Generating…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
