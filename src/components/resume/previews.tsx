import type { ResumeData } from "@/types/resume";

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Classic
───────────────────────────────────────────────────────────────────────────── */

export function ClassicPreview({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website, data.github].filter(Boolean);
  return (
    <div className="bg-white text-gray-900 p-8 min-h-[700px] font-serif text-[13px] leading-relaxed">
      <div className="border-b-2 border-gray-900 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{data.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600 mt-0.5">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          {contact.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {data.summary && (
        <Section title="Professional Summary"><p className="text-gray-700 text-[12px]">{data.summary}</p></Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <Row left={exp.role || "Role"} right={exp.period} />
                <p className="text-xs text-gray-600 italic mb-1">{exp.company}</p>
                {exp.description && <p className="text-[12px] text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id}>
                <p className="font-bold text-[13px]">{p.name}{p.link && <span className="font-normal text-gray-400"> — {p.link}</span>}</p>
                {p.description && <p className="text-[12px] text-gray-700">{p.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <Row left={edu.degree || "Degree"} right={edu.year} />
                <p className="text-xs text-gray-600 italic">{edu.institution}</p>
                {edu.description && <p className="text-[12px] text-gray-700 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-1">
            {data.certifications.map((c) => (
              <Row key={c.id} left={`${c.name} — ${c.issuer}`} right={c.year} />
            ))}
          </div>
        </Section>
      )}

      {data.awards.length > 0 && (
        <Section title="Awards">
          <div className="space-y-1">
            {data.awards.map((a) => (
              <Row key={a.id} left={`${a.title} — ${a.issuer}`} right={a.year} />
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills"><p className="text-[12px] text-gray-700">{data.skills.join(" · ")}</p></Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Languages">
          <p className="text-[12px] text-gray-700">{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Row({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <p className="font-bold text-[13px]">{left}</p>
      {right && <p className="text-xs text-gray-500 shrink-0 ml-2">{right}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Modern
───────────────────────────────────────────────────────────────────────────── */

export function ModernPreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-gray-900 min-h-[700px] font-sans text-[12px] leading-relaxed flex">
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
          {[data.email, data.phone, data.location, data.linkedin, data.website, data.github].filter(Boolean).map((c, i) => (
            <p key={i} className="text-slate-300 text-[11px] break-all">{c}</p>
          ))}
        </div>

        {data.skills.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill) => (
                <span key={skill} className="bg-slate-700 text-slate-200 text-[10px] px-2 py-0.5 rounded">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Languages</p>
            {data.languages.map((l) => (
              <p key={l.id} className="text-slate-300 text-[11px]">{l.name} — {l.level}</p>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Certifications</p>
            {data.certifications.map((c) => (
              <p key={c.id} className="text-slate-300 text-[11px] mb-1">{c.name} <span className="text-slate-400">({c.year})</span></p>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        {data.summary && <ModernSection title="Profile"><p className="text-gray-700 text-[11px]">{data.summary}</p></ModernSection>}

        {data.experience.length > 0 && (
          <ModernSection title="Experience">
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-sky-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-[12px]">{exp.role || "Role"}</p>
                    <p className="text-[10px] text-gray-400 shrink-0 ml-2">{exp.period}</p>
                  </div>
                  <p className="text-sky-600 text-[11px] mb-1">{exp.company}</p>
                  {exp.description && <p className="text-gray-600 text-[11px]">{exp.description}</p>}
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {data.projects.length > 0 && (
          <ModernSection title="Projects">
            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id} className="border-l-2 border-sky-200 pl-3">
                  <p className="font-semibold text-[12px]">{p.name}</p>
                  {p.description && <p className="text-gray-600 text-[11px]">{p.description}</p>}
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {data.education.length > 0 && (
          <ModernSection title="Education">
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-sky-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-[12px]">{edu.degree || "Degree"}</p>
                    <p className="text-[10px] text-gray-400">{edu.year}</p>
                  </div>
                  <p className="text-sky-600 text-[11px]">{edu.institution}</p>
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {data.awards.length > 0 && (
          <ModernSection title="Awards">
            <div className="space-y-1">
              {data.awards.map((a) => (
                <p key={a.id} className="text-[11px] text-gray-600">{a.title} — <span className="text-gray-400">{a.issuer}, {a.year}</span></p>
              ))}
            </div>
          </ModernSection>
        )}
      </div>
    </div>
  );
}

function ModernSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">{title}</h2>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Minimal
───────────────────────────────────────────────────────────────────────────── */

export function MinimalPreview({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website, data.github].filter(Boolean);
  return (
    <div className="bg-white text-gray-900 p-10 min-h-[700px] font-mono text-[12px] leading-relaxed">
      <div className="mb-8">
        <h1 className="text-3xl font-normal tracking-tight text-gray-900 mb-1">{data.name || "Your Name"}</h1>
        <p className="text-gray-400 text-sm">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-[11px] text-gray-400">
          {contact.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {data.summary && <MinimalSection label="Summary"><p className="text-gray-600 max-w-prose text-[12px]">{data.summary}</p></MinimalSection>}

      {data.experience.length > 0 && (
        <MinimalSection label="Experience">
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="font-normal text-gray-900">{exp.role || "Role"}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{exp.company}</p>
                  {exp.description && <p className="text-gray-600 text-[11px] mt-1.5">{exp.description}</p>}
                </div>
                <p className="text-[10px] text-gray-300 whitespace-nowrap">{exp.period}</p>
              </div>
            ))}
          </div>
        </MinimalSection>
      )}

      {data.projects.length > 0 && (
        <MinimalSection label="Projects">
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.id}>
                <p className="text-gray-900">{p.name}</p>
                {p.description && <p className="text-gray-600 text-[11px] mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </MinimalSection>
      )}

      {data.education.length > 0 && (
        <MinimalSection label="Education">
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="text-gray-900">{edu.degree || "Degree"}</p>
                  <p className="text-gray-400 text-[11px]">{edu.institution}</p>
                </div>
                <p className="text-[10px] text-gray-300">{edu.year}</p>
              </div>
            ))}
          </div>
        </MinimalSection>
      )}

      {data.skills.length > 0 && (
        <MinimalSection label="Skills">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            {data.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </MinimalSection>
      )}

      {(data.certifications.length > 0 || data.awards.length > 0 || data.languages.length > 0) && (
        <MinimalSection label="Extras">
          <div className="space-y-1 text-[11px] text-gray-500">
            {data.certifications.map((c) => <p key={c.id}>{c.name} — {c.issuer} ({c.year})</p>)}
            {data.awards.map((a) => <p key={a.id}>{a.title} — {a.issuer} ({a.year})</p>)}
            {data.languages.length > 0 && <p>{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>}
          </div>
        </MinimalSection>
      )}
    </div>
  );
}

function MinimalSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300 mb-3">— {label}</p>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Executive (premium) — formal single-column, serif, ATS-safe
───────────────────────────────────────────────────────────────────────────── */

export function ExecutivePreview({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean);
  return (
    <div className="bg-white text-gray-900 p-10 min-h-[700px] font-serif text-[13px] leading-[1.7]">
      <div className="text-center mb-6">
        <h1 className="text-[26px] font-bold tracking-[0.08em] uppercase text-gray-900">{data.name || "Your Name"}</h1>
        <p className="text-[13px] text-gray-500 mt-1 tracking-wide">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 text-[11px] text-gray-500">
          {contact.map((c, i) => (
            <span key={i}>{c}{i < contact.length - 1 && <span className="mx-2 text-gray-300">|</span>}</span>
          ))}
        </div>
      </div>
      <div className="h-px bg-gray-900 mb-6" />

      {data.summary && (
        <ExecSection title="Executive Summary"><p className="text-gray-700 text-[12.5px] text-justify">{data.summary}</p></ExecSection>
      )}

      {data.experience.length > 0 && (
        <ExecSection title="Professional Experience">
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[13px]">{exp.company || "Company"}</p>
                  <p className="text-[11px] text-gray-500">{exp.period}</p>
                </div>
                <p className="text-[12px] text-gray-600 italic mb-1">{exp.role}</p>
                {exp.description && <p className="text-[12px] text-gray-700 text-justify">{exp.description}</p>}
              </div>
            ))}
          </div>
        </ExecSection>
      )}

      {data.education.length > 0 && (
        <ExecSection title="Education">
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <p className="text-[12.5px]"><span className="font-bold">{edu.degree || "Degree"}</span>, {edu.institution}</p>
                <p className="text-[11px] text-gray-500 shrink-0 ml-2">{edu.year}</p>
              </div>
            ))}
          </div>
        </ExecSection>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.certifications.length > 0 && (
          <ExecSection title="Certifications">
            {data.certifications.map((c) => (
              <p key={c.id} className="text-[12px] text-gray-700">{c.name}, {c.issuer} ({c.year})</p>
            ))}
          </ExecSection>
        )}
        {data.awards.length > 0 && (
          <ExecSection title="Honors & Awards">
            {data.awards.map((a) => (
              <p key={a.id} className="text-[12px] text-gray-700">{a.title}, {a.issuer} ({a.year})</p>
            ))}
          </ExecSection>
        )}
      </div>

      {data.skills.length > 0 && (
        <ExecSection title="Core Competencies"><p className="text-[12px] text-gray-700">{data.skills.join("   •   ")}</p></ExecSection>
      )}

      {data.languages.length > 0 && (
        <ExecSection title="Languages"><p className="text-[12px] text-gray-700">{data.languages.map((l) => `${l.name} (${l.level})`).join("   •   ")}</p></ExecSection>
      )}
    </div>
  );
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-2 text-center">{title}</h2>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Template: Technical (premium) — engineer-forward, projects up top, terminal skills
───────────────────────────────────────────────────────────────────────────── */

export function TechnicalPreview({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website, data.github].filter(Boolean);
  return (
    <div className="bg-white text-gray-900 p-8 min-h-[700px] font-sans text-[12px] leading-relaxed">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">{data.name || "Your Name"}</h1>
        <p className="text-emerald-600 text-sm font-medium mt-0.5">{data.title || "Your Title"}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-gray-500">
          {contact.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>

      {data.skills.length > 0 && (
        <div className="mb-5 bg-gray-900 rounded-lg p-4">
          <p className="text-emerald-400 text-[10px] font-mono mb-2">$ stack --list</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span key={skill} className="font-mono text-[10px] text-emerald-300 bg-gray-800 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {data.summary && <TechSection title="Summary"><p className="text-gray-700 text-[11.5px]">{data.summary}</p></TechSection>}

      {data.projects.length > 0 && (
        <TechSection title="Projects">
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-[12px] text-gray-900">{p.name}</p>
                  {p.link && <p className="text-[10px] text-emerald-600 font-mono">{p.link}</p>}
                </div>
                {p.description && <p className="text-[11px] text-gray-600 mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        </TechSection>
      )}

      {data.experience.length > 0 && (
        <TechSection title="Experience">
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-[12px]">{exp.role || "Role"} <span className="text-gray-400 font-normal">@ {exp.company}</span></p>
                  <p className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">{exp.period}</p>
                </div>
                {exp.description && <p className="text-gray-600 text-[11px] mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        </TechSection>
      )}

      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <TechSection title="Education">
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-[11.5px]">{edu.degree || "Degree"}</p>
                <p className="text-gray-500 text-[10.5px]">{edu.institution} · {edu.year}</p>
              </div>
            ))}
          </TechSection>
        )}
        {data.certifications.length > 0 && (
          <TechSection title="Certifications">
            {data.certifications.map((c) => (
              <p key={c.id} className="text-[11px] text-gray-600 mb-1">{c.name} <span className="text-gray-400">({c.year})</span></p>
            ))}
          </TechSection>
        )}
      </div>
    </div>
  );
}

function TechSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-2">// {title}</h2>
      {children}
    </div>
  );
}
