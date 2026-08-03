"use client";

import { useState, useCallback, useRef } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconFileText,
  IconPlus,
  IconTrash,
  IconX,
  IconDownload,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandLinkedin,
  IconWorld,
  IconAlertCircle,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";
import { supabase } from "@/lib/supabase/client";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  year: string;
  description: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
}

type Tab = "personal" | "experience" | "education" | "skills" | "summary";
type Template = "classic" | "modern" | "minimal";

/* ─────────────────────────────────────────────────────────────────────────────
   Default resume data
───────────────────────────────────────────────────────────────────────────── */

const DEFAULT_DATA: ResumeData = {
  name: "Adaeze Okafor",
  title: "Product Designer",
  email: "adaeze@example.com",
  phone: "+234 802 000 0001",
  location: "Lagos, Nigeria",
  linkedin: "linkedin.com/in/adaeze-okafor",
  website: "adaeze.design",
  summary:
    "Product designer with 4 years of experience building digital products for African fintech companies. Passionate about accessible, user-centred design that works across low-bandwidth conditions.",
  experience: [
    {
      id: "exp-1",
      company: "Kuda Bank",
      role: "Senior Product Designer",
      period: "2022 – Present",
      description:
        "Led redesign of the core banking app used by 8M+ users. Reduced onboarding drop-off by 34% through iterative usability testing and prototyping. Collaborated with engineering and PM to ship 12 major features.",
    },
    {
      id: "exp-2",
      company: "Flutterwave",
      role: "Product Designer",
      period: "2020 – 2022",
      description:
        "Designed merchant dashboard and payment link flows serving 500K+ merchants across 34 African countries. Built and maintained the internal design system used across 6 product teams.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Lagos",
      degree: "B.Sc Computer Science",
      year: "2020",
      description: "First Class Honours. Final-year project on HCI and accessibility in low-bandwidth environments.",
    },
  ],
  skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Tailwind CSS", "Framer", "Accessibility"],
};

/* ─────────────────────────────────────────────────────────────────────────────
   Utility
───────────────────────────────────────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Classic
───────────────────────────────────────────────────────────────────────────── */

function ClassicPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 p-8 min-h-[700px] font-serif text-[13px] leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{data.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600 mt-0.5">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">Professional Summary</h2>
          <p className="text-gray-700 text-[12px]">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[13px]">{exp.role || "Role"}</p>
                  <p className="text-xs text-gray-500 shrink-0 ml-2">{exp.period}</p>
                </div>
                <p className="text-xs text-gray-600 italic mb-1">{exp.company}</p>
                {exp.description && (
                  <p className="text-[12px] text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[13px]">{edu.degree || "Degree"}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
                <p className="text-xs text-gray-600 italic">{edu.institution}</p>
                {edu.description && (
                  <p className="text-[12px] text-gray-700 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-[12px] text-gray-700">{data.skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Modern
───────────────────────────────────────────────────────────────────────────── */

function ModernPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 min-h-[700px] font-sans text-[12px] leading-relaxed flex">
      {/* Left sidebar */}
      <div className="w-[38%] bg-slate-800 text-white p-6 shrink-0">
        <div className="mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-400 flex items-center justify-center text-white text-xl font-bold mb-3">
            {(data.name || "?")[0]}
          </div>
          <h1 className="text-lg font-bold leading-tight">{data.name || "Your Name"}</h1>
          <p className="text-sky-300 text-xs mt-1">{data.title || "Your Title"}</p>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Contact</p>
          {data.email && (
            <p className="text-slate-300 text-[11px] break-all">{data.email}</p>
          )}
          {data.phone && <p className="text-slate-300 text-[11px]">{data.phone}</p>}
          {data.location && <p className="text-slate-300 text-[11px]">{data.location}</p>}
          {data.linkedin && <p className="text-slate-300 text-[11px] break-all">{data.linkedin}</p>}
          {data.website && <p className="text-slate-300 text-[11px]">{data.website}</p>}
        </div>

        {data.skills.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">
        {data.summary && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-1.5">Profile</h2>
            <p className="text-gray-700 text-[11px]">{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">Experience</h2>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-sky-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-[12px]">{exp.role || "Role"}</p>
                    <p className="text-[10px] text-gray-400 shrink-0 ml-2">{exp.period}</p>
                  </div>
                  <p className="text-sky-600 text-[11px] mb-1">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 text-[11px]">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">Education</h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-sky-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-[12px]">{edu.degree || "Degree"}</p>
                    <p className="text-[10px] text-gray-400">{edu.year}</p>
                  </div>
                  <p className="text-sky-600 text-[11px]">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-gray-600 text-[11px] mt-0.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Minimal
───────────────────────────────────────────────────────────────────────────── */

function MinimalPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 p-10 min-h-[700px] font-mono text-[12px] leading-relaxed">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal tracking-tight text-gray-900 mb-1">{data.name || "Your Name"}</h1>
        <p className="text-gray-400 text-sm">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-[11px] text-gray-400">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300 mb-3">— Summary</p>
          <p className="text-gray-600 max-w-prose text-[12px]">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300 mb-3">— Experience</p>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="font-normal text-gray-900">{exp.role || "Role"}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-600 text-[11px] mt-1.5">{exp.description}</p>
                  )}
                </div>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">{exp.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300 mb-3">— Education</p>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="text-gray-900">{edu.degree || "Degree"}</p>
                  <p className="text-gray-400 text-[11px]">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-gray-600 text-[11px] mt-1">{edu.description}</p>
                  )}
                </div>
                <p className="text-[10px] text-gray-300">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300 mb-3">— Skills</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            {data.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline field
───────────────────────────────────────────────────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--fg)]/60 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none">
            {icon}
          </span>
        )}
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

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
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

/* ─────────────────────────────────────────────────────────────────────────────
   Auth Modal
───────────────────────────────────────────────────────────────────────────── */

function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined,
        },
      });

      if (signUpError) throw signUpError;

      await supabase.from("resume_members").upsert(
        { email: email.trim(), name: name.trim() },
        { onConflict: "email" }
      );

      setSent(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-card)] p-6 w-full max-w-sm shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--fg)]/40 hover:text-[var(--fg)] transition-colors"
          aria-label="Close"
        >
          <IconX size={18} />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 flex items-center justify-center mx-auto mb-4">
              <IconCheck size={24} className="text-[var(--primary)]" />
            </div>
            <p className="font-heading font-semibold text-[var(--fg)] mb-2">Check your email</p>
            <p className="text-sm text-[var(--fg)]/50">
              We sent a magic link to <strong>{email}</strong>. Click it to verify and your PDF will download automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="font-mono text-[var(--primary)] text-[10px] uppercase tracking-[0.2em] mb-2">
                Free to use
              </p>
              <h2 className="font-heading font-bold text-[var(--fg)] text-lg mb-1">
                Download requires a free account
              </h2>
              <p className="text-sm text-[var(--fg)]/50 leading-relaxed">
                Create your free account to download your resume as a PDF. No credit card needed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Field
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="Adaeze Okafor"
                icon={<IconUser size={14} />}
              />
              <Field
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
                icon={<IconMail size={14} />}
              />

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <IconAlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[var(--primary)] hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {busy ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  <IconMail size={16} />
                )}
                {busy ? "Creating account…" : "Create free account"}
              </button>

              <p className="text-center text-[11px] text-[var(--fg)]/35">
                We&apos;ll send a magic link — no password needed.
              </p>
            </form>
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
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [template, setTemplate] = useState<Template>("classic");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);

  /* ── Setters ──────────────────────────────────────────────────────────── */

  const setField = useCallback(
    <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setPersonal = useCallback(
    (key: keyof Omit<ResumeData, "experience" | "education" | "skills" | "summary">) =>
      (value: string) =>
        setData((prev) => ({ ...prev, [key]: value })),
    []
  );

  /* ── Experience ───────────────────────────────────────────────────────── */

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: uid(), company: "", role: "", period: "", description: "" },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id: string, key: keyof ExperienceEntry, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [key]: value } : e
      ),
    }));
  };

  /* ── Education ────────────────────────────────────────────────────────── */

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: uid(), institution: "", degree: "", year: "", description: "" },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id: string, key: keyof EducationEntry, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, [key]: value } : e
      ),
    }));
  };

  /* ── Skills ───────────────────────────────────────────────────────────── */

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill || data.skills.includes(skill)) return;
    setData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const onSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === "Backspace" && skillInput === "" && data.skills.length > 0) {
      removeSkill(data.skills[data.skills.length - 1]);
    }
  };

  /* ── Download ─────────────────────────────────────────────────────────── */

  const handleDownload = async () => {
    setDownloadError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setShowAuthModal(true);
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
        body: JSON.stringify({ resumeData: data, template }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
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
    { id: "education", label: "Education", icon: <IconSchool size={15} /> },
    { id: "skills", label: "Skills", icon: <IconCode size={15} /> },
    { id: "summary", label: "Summary", icon: <IconFileText size={15} /> },
  ];

  const TEMPLATES: { id: Template; label: string }[] = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "minimal", label: "Minimal" },
  ];

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            triggerDownload();
          }}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Editor panel (2/5) ────────────────────────────────────────── */}
        <div className="w-full lg:w-2/5 flex flex-col gap-0">
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-t-[var(--radius-card)] p-1.5 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--fg)]/60 hover:text-[var(--fg)] hover:bg-[var(--border)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="bg-[var(--surface)] border-x border-[var(--border)] p-5 space-y-4 min-h-[480px]">
            {/* Personal */}
            {activeTab === "personal" && (
              <div className="space-y-3">
                <Field
                  label="Full name"
                  value={data.name}
                  onChange={setPersonal("name")}
                  placeholder="Adaeze Okafor"
                  icon={<IconUser size={14} />}
                />
                <Field
                  label="Job title / Role"
                  value={data.title}
                  onChange={setPersonal("title")}
                  placeholder="Product Designer"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Email"
                    value={data.email}
                    onChange={setPersonal("email")}
                    placeholder="you@email.com"
                    type="email"
                    icon={<IconMail size={14} />}
                  />
                  <Field
                    label="Phone"
                    value={data.phone}
                    onChange={setPersonal("phone")}
                    placeholder="+234 800 000 0000"
                    icon={<IconPhone size={14} />}
                  />
                </div>
                <Field
                  label="Location"
                  value={data.location}
                  onChange={setPersonal("location")}
                  placeholder="Lagos, Nigeria"
                  icon={<IconMapPin size={14} />}
                />
                <Field
                  label="LinkedIn"
                  value={data.linkedin}
                  onChange={setPersonal("linkedin")}
                  placeholder="linkedin.com/in/yourname"
                  icon={<IconBrandLinkedin size={14} />}
                />
                <Field
                  label="Website / Portfolio"
                  value={data.website}
                  onChange={setPersonal("website")}
                  placeholder="yoursite.com"
                  icon={<IconWorld size={14} />}
                />
              </div>
            )}

            {/* Experience */}
            {activeTab === "experience" && (
              <div className="space-y-5">
                {data.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[var(--fg)]/50 uppercase tracking-wide">
                        Job {idx + 1}
                      </p>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-[var(--fg)]/30 hover:text-rose-400 transition-colors"
                        aria-label="Remove job"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Company"
                        value={exp.company}
                        onChange={(v) => updateExperience(exp.id, "company", v)}
                        placeholder="Kuda Bank"
                      />
                      <Field
                        label="Role"
                        value={exp.role}
                        onChange={(v) => updateExperience(exp.id, "role", v)}
                        placeholder="Senior Designer"
                      />
                    </div>
                    <Field
                      label="Period"
                      value={exp.period}
                      onChange={(v) => updateExperience(exp.id, "period", v)}
                      placeholder="2022 – Present"
                    />
                    <TextArea
                      label="Description"
                      value={exp.description}
                      onChange={(v) => updateExperience(exp.id, "description", v)}
                      placeholder="Key achievements and responsibilities…"
                      rows={3}
                    />
                  </div>
                ))}

                <button
                  onClick={addExperience}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[var(--border)] hover:border-[var(--primary)] text-[var(--fg)]/50 hover:text-[var(--primary)] rounded-lg py-3 text-sm transition-colors"
                >
                  <IconPlus size={15} />
                  Add job
                </button>
              </div>
            )}

            {/* Education */}
            {activeTab === "education" && (
              <div className="space-y-5">
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-[var(--fg)]/50 uppercase tracking-wide">
                        Entry {idx + 1}
                      </p>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-[var(--fg)]/30 hover:text-rose-400 transition-colors"
                        aria-label="Remove education entry"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                    <Field
                      label="Institution"
                      value={edu.institution}
                      onChange={(v) => updateEducation(edu.id, "institution", v)}
                      placeholder="University of Lagos"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Degree"
                        value={edu.degree}
                        onChange={(v) => updateEducation(edu.id, "degree", v)}
                        placeholder="B.Sc Computer Science"
                      />
                      <Field
                        label="Year"
                        value={edu.year}
                        onChange={(v) => updateEducation(edu.id, "year", v)}
                        placeholder="2020"
                      />
                    </div>
                    <TextArea
                      label="Additional details"
                      value={edu.description}
                      onChange={(v) => updateEducation(edu.id, "description", v)}
                      placeholder="Achievements, awards, relevant coursework…"
                      rows={2}
                    />
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[var(--border)] hover:border-[var(--primary)] text-[var(--fg)]/50 hover:text-[var(--primary)] rounded-lg py-3 text-sm transition-colors"
                >
                  <IconPlus size={15} />
                  Add education
                </button>
              </div>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--fg)]/60 mb-1.5">
                    Skills
                    <span className="ml-2 text-[var(--fg)]/30 font-normal">Press Enter or comma to add</span>
                  </label>
                  <div
                    className="min-h-[48px] flex flex-wrap gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 cursor-text focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)]/30 transition-colors"
                    onClick={() => skillInputRef.current?.focus()}
                  >
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-[var(--primary)]/15 text-[var(--primary)] text-xs px-2.5 py-1 rounded-full"
                      >
                        {skill}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSkill(skill);
                          }}
                          className="text-[var(--primary)]/60 hover:text-[var(--primary)] ml-0.5"
                          aria-label={`Remove ${skill}`}
                        >
                          <IconX size={11} />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={skillInputRef}
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={onSkillKeyDown}
                      onBlur={() => skillInput.trim() && addSkill(skillInput)}
                      placeholder={data.skills.length === 0 ? "Type a skill and press Enter…" : ""}
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--fg)]/30 outline-none"
                    />
                  </div>
                </div>

                {data.skills.length > 0 && (
                  <p className="text-xs text-[var(--fg)]/40">
                    {data.skills.length} skill{data.skills.length !== 1 ? "s" : ""} added
                  </p>
                )}
              </div>
            )}

            {/* Summary */}
            {activeTab === "summary" && (
              <div className="space-y-3">
                <TextArea
                  label="Professional summary"
                  value={data.summary}
                  onChange={(v) => setField("summary", v)}
                  placeholder="A 2–4 sentence overview of your background, expertise, and what you bring to a role…"
                  rows={7}
                />
                <p className="text-xs text-[var(--fg)]/40">
                  {data.summary.length} characters · Aim for 200–400 for best results
                </p>
              </div>
            )}
          </div>

          {/* Download button — sticky bottom of form */}
          <div className="bg-[var(--surface)] border border-t-0 border-[var(--border)] rounded-b-[var(--radius-card)] p-4">
            {downloadError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs mb-3">
                <IconAlertCircle size={14} className="shrink-0" />
                <span>{downloadError}</span>
              </div>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-sky-400 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {downloading ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconDownload size={16} />
              )}
              {downloading ? "Generating PDF…" : "Download PDF"}
            </button>
            <p className="text-center text-[11px] text-[var(--fg)]/30 mt-2">
              Free · No watermarks · No signup required to edit
            </p>
          </div>
        </div>

        {/* ── Preview panel (3/5) ───────────────────────────────────────── */}
        <div className="w-full lg:w-3/5 flex flex-col gap-3 sticky top-6">
          {/* Template switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--fg)]/50 font-medium shrink-0">Template:</span>
            <div className="flex gap-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    template === t.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)]/60 hover:text-[var(--fg)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview container */}
          <div className="border border-[var(--border)] rounded-[var(--radius-card)] overflow-hidden shadow-lg">
            <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <span className="text-xs text-[var(--fg)]/30 font-mono">
                resume-preview · {template}
              </span>
            </div>
            <div className="overflow-auto max-h-[800px]">
              {template === "classic" && <ClassicPreview data={data} />}
              {template === "modern" && <ModernPreview data={data} />}
              {template === "minimal" && <MinimalPreview data={data} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
