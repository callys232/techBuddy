export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  year: string;
  description: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
}

export type ResumeTemplate = "classic" | "modern" | "minimal" | "executive" | "technical";

export interface TemplateMeta {
  id: ResumeTemplate;
  label: string;
  premium: boolean;
}

export const RESUME_TEMPLATES: TemplateMeta[] = [
  { id: "classic",   label: "Classic",   premium: false },
  { id: "modern",    label: "Modern",    premium: false },
  { id: "minimal",   label: "Minimal",   premium: false },
  { id: "executive", label: "Executive", premium: true },
  { id: "technical", label: "Technical", premium: true },
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: "Adaeze Okafor",
  title: "Product Designer",
  email: "adaeze@example.com",
  phone: "+234 802 000 0001",
  location: "Lagos, Nigeria",
  linkedin: "linkedin.com/in/adaeze-okafor",
  website: "adaeze.design",
  github: "github.com/adaeze-okafor",
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
  projects: [
    {
      id: "proj-1",
      name: "Design System for Kuda Mobile",
      description: "Built and shipped a token-based design system adopted across 6 product teams, cutting new-screen design time by 40%.",
      link: "adaeze.design/kuda-ds",
    },
  ],
  certifications: [
    { id: "cert-1", name: "Google UX Design Professional Certificate", issuer: "Google / Coursera", year: "2021" },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native" },
    { id: "lang-2", name: "Igbo", level: "Fluent" },
  ],
  awards: [
    { id: "award-1", title: "Best Fintech UX", issuer: "Nigeria Tech Awards", year: "2023" },
  ],
};
