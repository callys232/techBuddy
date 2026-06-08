"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const DEPARTMENTS = [
  { value: "sales", label: "Sales" },
  { value: "technical", label: "Technical" },
  { value: "partnerships", label: "Partnerships" },
  { value: "support", label: "Support" },
  { value: "press", label: "Press" },
];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", department: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", department: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--primary)]/40 bg-[var(--primary)]/5 p-8 text-center">
        <p className="font-display text-xl font-bold text-[var(--fg)] mb-2">Message sent!</p>
        <p className="text-sm text-[var(--fg)]/60 mb-5">We&apos;ll reply within 24 hours.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={set("name")}
          type="text"
          placeholder="Your name"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
        />
        <input
          required
          value={form.email}
          onChange={set("email")}
          type="email"
          placeholder="your@email.com"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors"
        />
      </div>

      <select
        required
        value={form.department}
        onChange={set("department")}
        aria-label="Department"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] focus:border-[var(--primary)] focus:outline-none transition-colors"
      >
        <option value="">Department</option>
        {DEPARTMENTS.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>

      <textarea
        required
        value={form.message}
        onChange={set("message")}
        rows={5}
        placeholder="Tell us about your project..."
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
      />

      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 rounded-full bg-[var(--primary)] font-semibold text-[var(--bg)] hover:opacity-90 hover:shadow-[var(--shadow-glow-teal)] transition-all active:scale-95 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
