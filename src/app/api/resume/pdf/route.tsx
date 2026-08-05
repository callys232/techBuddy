import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import type { ResumeData, ResumeTemplate } from "@/types/resume";
import { RESUME_TEMPLATES } from "@/types/resume";
import { isEmailSubscribed } from "@/lib/subscription";

Font.registerHyphenationCallback((word) => [word]);

const contactLine = (d: ResumeData) => [d.email, d.phone, d.location, d.linkedin, d.website, d.github].filter(Boolean);

/* ─────────────────────────────────────────────────────────────────────────────
   Classic
───────────────────────────────────────────────────────────────────────────── */

const classic = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 48, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10, color: "#111827", lineHeight: 1.5 },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  title: { fontSize: 11, color: "#6b7280", marginBottom: 6 },
  contact: { flexDirection: "row", flexWrap: "wrap", gap: 10, fontSize: 9, color: "#9ca3af" },
  divider: { borderBottomWidth: 1.5, borderBottomColor: "#111827", marginVertical: 10 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: "#d1d5db", paddingBottom: 3 },
  section: { marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  bold: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  faint: { fontSize: 9, color: "#9ca3af" },
  italic: { fontSize: 9, color: "#6b7280", fontFamily: "Helvetica-Oblique", marginBottom: 3 },
  body: { fontSize: 9.5, color: "#374151", lineHeight: 1.55 },
  entry: { marginBottom: 10 },
});

function ClassicPDF({ data }: { data: ResumeData }) {
  return (
    <Document title={`${data.name} — Resume`}>
      <Page size="A4" style={classic.page}>
        <Text style={classic.name}>{data.name || "Your Name"}</Text>
        <Text style={classic.title}>{data.title || ""}</Text>
        <View style={classic.contact}>{contactLine(data).map((p, i) => <Text key={i}>{p}</Text>)}</View>
        <View style={classic.divider} />

        {data.summary && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Professional Summary</Text>
            <Text style={classic.body}>{data.summary}</Text>
          </View>
        )}

        {data.experience.length > 0 && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={classic.entry}>
                <View style={classic.row}><Text style={classic.bold}>{exp.role || "Role"}</Text><Text style={classic.faint}>{exp.period}</Text></View>
                <Text style={classic.italic}>{exp.company}</Text>
                {exp.description && <Text style={classic.body}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.projects.length > 0 && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Projects</Text>
            {data.projects.map((p) => (
              <View key={p.id} style={classic.entry}>
                <Text style={classic.bold}>{p.name}{p.link ? ` — ${p.link}` : ""}</Text>
                {p.description && <Text style={classic.body}>{p.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={classic.entry}>
                <View style={classic.row}><Text style={classic.bold}>{edu.degree || "Degree"}</Text><Text style={classic.faint}>{edu.year}</Text></View>
                <Text style={classic.italic}>{edu.institution}</Text>
                {edu.description && <Text style={classic.body}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.certifications.length > 0 && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Certifications</Text>
            {data.certifications.map((c) => (
              <View key={c.id} style={classic.row}><Text style={classic.bold}>{c.name} — {c.issuer}</Text><Text style={classic.faint}>{c.year}</Text></View>
            ))}
          </View>
        )}

        {data.awards.length > 0 && (
          <View style={classic.section}>
            <Text style={classic.sectionTitle}>Awards</Text>
            {data.awards.map((a) => (
              <View key={a.id} style={classic.row}><Text style={classic.bold}>{a.title} — {a.issuer}</Text><Text style={classic.faint}>{a.year}</Text></View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View style={classic.section}><Text style={classic.sectionTitle}>Skills</Text><Text style={classic.body}>{data.skills.join(" · ")}</Text></View>
        )}

        {data.languages.length > 0 && (
          <View style={classic.section}><Text style={classic.sectionTitle}>Languages</Text><Text style={classic.body}>{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</Text></View>
        )}
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Modern
───────────────────────────────────────────────────────────────────────────── */

const modern = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#111827" },
  sidebar: { width: "36%", backgroundColor: "#1e293b", padding: 28, color: "#e2e8f0" },
  initial: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#38bdf8", color: "#fff", fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "center", lineHeight: 2.3, marginBottom: 10 },
  sName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#f8fafc", marginBottom: 2 },
  sTitle: { fontSize: 9, color: "#7dd3fc", marginBottom: 16 },
  sLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#7dd3fc", marginBottom: 6, marginTop: 14 },
  sText: { fontSize: 9, color: "#94a3b8", marginBottom: 3, lineHeight: 1.4 },
  chip: { backgroundColor: "#334155", color: "#cbd5e1", fontSize: 8, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, marginRight: 4, marginBottom: 4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap" },
  content: { flex: 1, padding: 28, paddingTop: 32 },
  cTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#0ea5e9", marginBottom: 8, marginTop: 14 },
  bar: { width: 2, backgroundColor: "#bae6fd", marginRight: 8, borderRadius: 1 },
  entryRow: { flexDirection: "row", marginBottom: 10 },
  entryContent: { flex: 1 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 1 },
  entrySub: { fontSize: 9, color: "#0284c7", marginBottom: 2 },
  entryPeriod: { fontSize: 8, color: "#9ca3af", textAlign: "right", minWidth: 50 },
  entryDesc: { fontSize: 9, color: "#4b5563", lineHeight: 1.5 },
  body: { fontSize: 9.5, color: "#374151", lineHeight: 1.6 },
});

function ModernPDF({ data }: { data: ResumeData }) {
  return (
    <Document title={`${data.name} — Resume`}>
      <Page size="A4" style={modern.page}>
        <View style={modern.sidebar}>
          <Text style={modern.initial}>{(data.name || "?")[0]}</Text>
          <Text style={modern.sName}>{data.name || "Your Name"}</Text>
          <Text style={modern.sTitle}>{data.title || ""}</Text>

          <Text style={modern.sLabel}>Contact</Text>
          {contactLine(data).map((p, i) => <Text key={i} style={modern.sText}>{p}</Text>)}

          {data.skills.length > 0 && (
            <View>
              <Text style={modern.sLabel}>Skills</Text>
              <View style={modern.chipsRow}>{data.skills.map((s) => <Text key={s} style={modern.chip}>{s}</Text>)}</View>
            </View>
          )}

          {data.languages.length > 0 && (
            <View>
              <Text style={modern.sLabel}>Languages</Text>
              {data.languages.map((l) => <Text key={l.id} style={modern.sText}>{l.name} — {l.level}</Text>)}
            </View>
          )}

          {data.certifications.length > 0 && (
            <View>
              <Text style={modern.sLabel}>Certifications</Text>
              {data.certifications.map((c) => <Text key={c.id} style={modern.sText}>{c.name} ({c.year})</Text>)}
            </View>
          )}
        </View>

        <View style={modern.content}>
          {data.summary && <View><Text style={modern.cTitle}>Profile</Text><Text style={modern.body}>{data.summary}</Text></View>}

          {data.experience.length > 0 && (
            <View>
              <Text style={modern.cTitle}>Experience</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={modern.entryRow}>
                  <View style={modern.bar} />
                  <View style={modern.entryContent}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={modern.entryTitle}>{exp.role || "Role"}</Text>
                      <Text style={modern.entryPeriod}>{exp.period}</Text>
                    </View>
                    <Text style={modern.entrySub}>{exp.company}</Text>
                    {exp.description && <Text style={modern.entryDesc}>{exp.description}</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.projects.length > 0 && (
            <View>
              <Text style={modern.cTitle}>Projects</Text>
              {data.projects.map((p) => (
                <View key={p.id} style={modern.entryRow}>
                  <View style={modern.bar} />
                  <View style={modern.entryContent}>
                    <Text style={modern.entryTitle}>{p.name}</Text>
                    {p.description && <Text style={modern.entryDesc}>{p.description}</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View>
              <Text style={modern.cTitle}>Education</Text>
              {data.education.map((edu) => (
                <View key={edu.id} style={modern.entryRow}>
                  <View style={modern.bar} />
                  <View style={modern.entryContent}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={modern.entryTitle}>{edu.degree || "Degree"}</Text>
                      <Text style={modern.entryPeriod}>{edu.year}</Text>
                    </View>
                    <Text style={modern.entrySub}>{edu.institution}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {data.awards.length > 0 && (
            <View>
              <Text style={modern.cTitle}>Awards</Text>
              {data.awards.map((a) => <Text key={a.id} style={modern.entryDesc}>{a.title} — {a.issuer}, {a.year}</Text>)}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Minimal
───────────────────────────────────────────────────────────────────────────── */

const minimal = StyleSheet.create({
  page: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 64, fontFamily: "Courier", fontSize: 10, color: "#111827", lineHeight: 1.6 },
  name: { fontSize: 26, fontFamily: "Courier", color: "#111827", marginBottom: 3 },
  title: { fontSize: 11, color: "#9ca3af", marginBottom: 10, fontFamily: "Courier" },
  contact: { flexDirection: "row", flexWrap: "wrap", gap: 16, fontSize: 9, color: "#9ca3af" },
  label: { fontSize: 8, color: "#d1d5db", textTransform: "uppercase", letterSpacing: 3, marginBottom: 10, marginTop: 24 },
  grid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  left: { flex: 1 },
  entryTitle: { fontSize: 10, fontFamily: "Courier", color: "#111827", marginBottom: 1 },
  entrySub: { fontSize: 9, color: "#9ca3af", marginBottom: 4 },
  entryDesc: { fontSize: 9, color: "#4b5563", lineHeight: 1.55 },
  period: { fontSize: 8.5, color: "#d1d5db", textAlign: "right", minWidth: 55 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, fontSize: 9, color: "#6b7280" },
  body: { fontSize: 9.5, color: "#4b5563", lineHeight: 1.65 },
});

function MinimalPDF({ data }: { data: ResumeData }) {
  return (
    <Document title={`${data.name} — Resume`}>
      <Page size="A4" style={minimal.page}>
        <Text style={minimal.name}>{data.name || "Your Name"}</Text>
        <Text style={minimal.title}>{data.title || ""}</Text>
        <View style={minimal.contact}>{contactLine(data).map((p, i) => <Text key={i}>{p}</Text>)}</View>

        {data.summary && <View><Text style={minimal.label}>— Summary</Text><Text style={minimal.body}>{data.summary}</Text></View>}

        {data.experience.length > 0 && (
          <View>
            <Text style={minimal.label}>— Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={minimal.grid}>
                <View style={minimal.left}>
                  <Text style={minimal.entryTitle}>{exp.role || "Role"}</Text>
                  <Text style={minimal.entrySub}>{exp.company}</Text>
                  {exp.description && <Text style={minimal.entryDesc}>{exp.description}</Text>}
                </View>
                <Text style={minimal.period}>{exp.period}</Text>
              </View>
            ))}
          </View>
        )}

        {data.projects.length > 0 && (
          <View>
            <Text style={minimal.label}>— Projects</Text>
            {data.projects.map((p) => (
              <View key={p.id} style={{ marginBottom: 8 }}>
                <Text style={minimal.entryTitle}>{p.name}</Text>
                {p.description && <Text style={minimal.entryDesc}>{p.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View>
            <Text style={minimal.label}>— Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={minimal.grid}>
                <View style={minimal.left}>
                  <Text style={minimal.entryTitle}>{edu.degree || "Degree"}</Text>
                  <Text style={minimal.entrySub}>{edu.institution}</Text>
                </View>
                <Text style={minimal.period}>{edu.year}</Text>
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View><Text style={minimal.label}>— Skills</Text><View style={minimal.skillsRow}>{data.skills.map((s) => <Text key={s}>{s}</Text>)}</View></View>
        )}

        {(data.certifications.length > 0 || data.awards.length > 0 || data.languages.length > 0) && (
          <View>
            <Text style={minimal.label}>— Extras</Text>
            {data.certifications.map((c) => <Text key={c.id} style={minimal.entryDesc}>{c.name} — {c.issuer} ({c.year})</Text>)}
            {data.awards.map((a) => <Text key={a.id} style={minimal.entryDesc}>{a.title} — {a.issuer} ({a.year})</Text>)}
            {data.languages.length > 0 && <Text style={minimal.entryDesc}>{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Executive (premium)
───────────────────────────────────────────────────────────────────────────── */

const exec = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 50, paddingHorizontal: 60, fontFamily: "Times-Roman", fontSize: 10.5, color: "#111827", lineHeight: 1.6 },
  name: { fontSize: 20, fontFamily: "Times-Bold", textAlign: "center", letterSpacing: 2, textTransform: "uppercase" },
  title: { fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 3, marginBottom: 8 },
  contact: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, fontSize: 9, color: "#6b7280", marginBottom: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#111827", marginBottom: 14 },
  sectionTitle: { fontSize: 9.5, fontFamily: "Times-Bold", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "center", marginBottom: 6 },
  section: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Times-Bold", fontSize: 10.5 },
  italic: { fontFamily: "Times-Italic", fontSize: 10, color: "#4b5563", marginBottom: 2 },
  faint: { fontSize: 9.5, color: "#6b7280" },
  body: { fontSize: 10, color: "#374151", textAlign: "justify" },
  entry: { marginBottom: 8 },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
});

function ExecutivePDF({ data }: { data: ResumeData }) {
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean);
  return (
    <Document title={`${data.name} — Resume`}>
      <Page size="A4" style={exec.page}>
        <Text style={exec.name}>{data.name || "Your Name"}</Text>
        <Text style={exec.title}>{data.title || ""}</Text>
        <View style={exec.contact}>{contact.map((c, i) => <Text key={i}>{c}{i < contact.length - 1 ? "   |   " : ""}</Text>)}</View>
        <View style={exec.divider} />

        {data.summary && (
          <View style={exec.section}><Text style={exec.sectionTitle}>Executive Summary</Text><Text style={exec.body}>{data.summary}</Text></View>
        )}

        {data.experience.length > 0 && (
          <View style={exec.section}>
            <Text style={exec.sectionTitle}>Professional Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={exec.entry}>
                <View style={exec.row}><Text style={exec.bold}>{e.company || "Company"}</Text><Text style={exec.faint}>{e.period}</Text></View>
                <Text style={exec.italic}>{e.role}</Text>
                {e.description && <Text style={exec.body}>{e.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View style={exec.section}>
            <Text style={exec.sectionTitle}>Education</Text>
            {data.education.map((ed) => (
              <View key={ed.id} style={exec.row}>
                <Text style={exec.body}><Text style={exec.bold}>{ed.degree || "Degree"}</Text>, {ed.institution}</Text>
                <Text style={exec.faint}>{ed.year}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={exec.twoCol}>
          {data.certifications.length > 0 && (
            <View style={exec.col}>
              <Text style={exec.sectionTitle}>Certifications</Text>
              {data.certifications.map((c) => <Text key={c.id} style={exec.body}>{c.name}, {c.issuer} ({c.year})</Text>)}
            </View>
          )}
          {data.awards.length > 0 && (
            <View style={exec.col}>
              <Text style={exec.sectionTitle}>Honors &amp; Awards</Text>
              {data.awards.map((a) => <Text key={a.id} style={exec.body}>{a.title}, {a.issuer} ({a.year})</Text>)}
            </View>
          )}
        </View>

        {data.skills.length > 0 && (
          <View style={exec.section}><Text style={exec.sectionTitle}>Core Competencies</Text><Text style={{ ...exec.body, textAlign: "center" }}>{data.skills.join("   •   ")}</Text></View>
        )}
        {data.languages.length > 0 && (
          <View style={exec.section}><Text style={exec.sectionTitle}>Languages</Text><Text style={{ ...exec.body, textAlign: "center" }}>{data.languages.map((l) => `${l.name} (${l.level})`).join("   •   ")}</Text></View>
        )}
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Technical (premium)
───────────────────────────────────────────────────────────────────────────── */

const tech = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 40, paddingHorizontal: 48, fontFamily: "Helvetica", fontSize: 9.5, color: "#111827", lineHeight: 1.5 },
  name: { fontSize: 19, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 10.5, color: "#059669", fontFamily: "Helvetica-Bold", marginTop: 2 },
  contact: { flexDirection: "row", flexWrap: "wrap", gap: 8, fontSize: 8.5, color: "#6b7280", marginTop: 6, marginBottom: 12 },
  stackBox: { backgroundColor: "#111827", borderRadius: 6, padding: 10, marginBottom: 12 },
  stackLabel: { fontSize: 8, fontFamily: "Courier", color: "#34d399", marginBottom: 6 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: { fontFamily: "Courier", fontSize: 8, color: "#6ee7b7", backgroundColor: "#1f2937", paddingVertical: 3, paddingHorizontal: 6, borderRadius: 3, marginRight: 4, marginBottom: 4 },
  sectionTitle: { fontSize: 8.5, fontFamily: "Courier", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, color: "#9ca3af", marginBottom: 6, marginTop: 10 },
  projBox: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, padding: 8, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  link: { fontFamily: "Courier", fontSize: 8, color: "#059669" },
  body: { fontSize: 9, color: "#4b5563", marginTop: 3 },
  faint: { fontSize: 8, color: "#9ca3af", fontFamily: "Courier" },
  entry: { marginBottom: 8 },
  twoCol: { flexDirection: "row", gap: 20 },
  col: { flex: 1 },
});

function TechnicalPDF({ data }: { data: ResumeData }) {
  return (
    <Document title={`${data.name} — Resume`}>
      <Page size="A4" style={tech.page}>
        <Text style={tech.name}>{data.name || "Your Name"}</Text>
        <Text style={tech.title}>{data.title || ""}</Text>
        <View style={tech.contact}>{contactLine(data).map((p, i) => <Text key={i}>{p}</Text>)}</View>

        {data.skills.length > 0 && (
          <View style={tech.stackBox}>
            <Text style={tech.stackLabel}>$ stack --list</Text>
            <View style={tech.chipsRow}>{data.skills.map((s) => <Text key={s} style={tech.chip}>{s}</Text>)}</View>
          </View>
        )}

        {data.summary && <View><Text style={tech.sectionTitle}>// Summary</Text><Text style={tech.body}>{data.summary}</Text></View>}

        {data.projects.length > 0 && (
          <View>
            <Text style={tech.sectionTitle}>// Projects</Text>
            {data.projects.map((p) => (
              <View key={p.id} style={tech.projBox}>
                <View style={tech.row}><Text style={tech.bold}>{p.name}</Text>{p.link && <Text style={tech.link}>{p.link}</Text>}</View>
                {p.description && <Text style={tech.body}>{p.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.experience.length > 0 && (
          <View>
            <Text style={tech.sectionTitle}>// Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={tech.entry}>
                <View style={tech.row}><Text style={tech.bold}>{e.role || "Role"} @ {e.company}</Text><Text style={tech.faint}>{e.period}</Text></View>
                {e.description && <Text style={tech.body}>{e.description}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={tech.twoCol}>
          {data.education.length > 0 && (
            <View style={tech.col}>
              <Text style={tech.sectionTitle}>// Education</Text>
              {data.education.map((ed) => (
                <View key={ed.id} style={{ marginBottom: 6 }}>
                  <Text style={tech.bold}>{ed.degree || "Degree"}</Text>
                  <Text style={tech.faint}>{ed.institution} · {ed.year}</Text>
                </View>
              ))}
            </View>
          )}
          {data.certifications.length > 0 && (
            <View style={tech.col}>
              <Text style={tech.sectionTitle}>// Certifications</Text>
              {data.certifications.map((c) => <Text key={c.id} style={tech.body}>{c.name} ({c.year})</Text>)}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Route handler
───────────────────────────────────────────────────────────────────────────── */

const RENDERERS: Record<ResumeTemplate, (props: { data: ResumeData }) => React.ReactElement> = {
  classic: ClassicPDF,
  modern: ModernPDF,
  minimal: MinimalPDF,
  executive: ExecutivePDF,
  technical: TechnicalPDF,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeData = body.resumeData as ResumeData;
    const template = (body.template as ResumeTemplate) ?? "classic";
    const email = body.email as string | undefined;

    if (!resumeData || typeof resumeData !== "object") {
      return NextResponse.json({ error: "Missing resumeData" }, { status: 400 });
    }

    const meta = RESUME_TEMPLATES.find((t) => t.id === template);
    if (meta?.premium) {
      if (!email || !(await isEmailSubscribed(email))) {
        return NextResponse.json({ error: "This template requires a Resume Premium subscription" }, { status: 403 });
      }
    }

    const Renderer = RENDERERS[template] ?? ClassicPDF;
    const buffer = await renderToBuffer(<Renderer data={resumeData} />);

    const safeName = (resumeData.name ?? "resume").replace(/[^a-z0-9]/gi, "_");

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}_resume.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[resume/pdf]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
