import { NextResponse } from "next/server";
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
  Font,
  type DocumentProps,
} from "@react-pdf/renderer";

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

type Template = "classic" | "modern" | "minimal";

/* ─────────────────────────────────────────────────────────────────────────────
   Register fonts — fall back to Helvetica if network unavailable
───────────────────────────────────────────────────────────────────────────── */

Font.registerHyphenationCallback((word) => [word]);

/* ─────────────────────────────────────────────────────────────────────────────
   Classic PDF Template
───────────────────────────────────────────────────────────────────────────── */

const classicStyles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.5,
  },
  headerName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
  },
  headerContact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 9,
    color: "#9ca3af",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#111827",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#111827",
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
    paddingBottom: 3,
  },
  section: {
    marginBottom: 14,
  },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  expPeriod: {
    fontSize: 9,
    color: "#9ca3af",
  },
  expCompany: {
    fontSize: 9,
    color: "#6b7280",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 3,
  },
  expDesc: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.55,
  },
  entryBlock: {
    marginBottom: 10,
  },
  skillsText: {
    fontSize: 9.5,
    color: "#374151",
  },
  summaryText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.6,
  },
});

function ClassicPDF({ data }: { data: ResumeData }) {
  const contactParts = [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean);

  return React.createElement(
    Document,
    { title: `${data.name} — Resume` },
    React.createElement(
      Page,
      { size: "A4", style: classicStyles.page },

      /* Header */
      React.createElement(Text, { style: classicStyles.headerName }, data.name || "Your Name"),
      React.createElement(Text, { style: classicStyles.headerTitle }, data.title || ""),
      React.createElement(
        View,
        { style: classicStyles.headerContact },
        ...contactParts.map((p, i) => React.createElement(Text, { key: i }, p))
      ),
      React.createElement(View, { style: classicStyles.divider }),

      /* Summary */
      data.summary
        ? React.createElement(
            View,
            { style: classicStyles.section },
            React.createElement(Text, { style: classicStyles.sectionTitle }, "Professional Summary"),
            React.createElement(Text, { style: classicStyles.summaryText }, data.summary)
          )
        : null,

      /* Experience */
      data.experience.length > 0
        ? React.createElement(
            View,
            { style: classicStyles.section },
            React.createElement(Text, { style: classicStyles.sectionTitle }, "Experience"),
            ...data.experience.map((exp) =>
              React.createElement(
                View,
                { key: exp.id, style: classicStyles.entryBlock },
                React.createElement(
                  View,
                  { style: classicStyles.expRow },
                  React.createElement(Text, { style: classicStyles.expRole }, exp.role || "Role"),
                  React.createElement(Text, { style: classicStyles.expPeriod }, exp.period)
                ),
                React.createElement(Text, { style: classicStyles.expCompany }, exp.company),
                exp.description
                  ? React.createElement(Text, { style: classicStyles.expDesc }, exp.description)
                  : null
              )
            )
          )
        : null,

      /* Education */
      data.education.length > 0
        ? React.createElement(
            View,
            { style: classicStyles.section },
            React.createElement(Text, { style: classicStyles.sectionTitle }, "Education"),
            ...data.education.map((edu) =>
              React.createElement(
                View,
                { key: edu.id, style: classicStyles.entryBlock },
                React.createElement(
                  View,
                  { style: classicStyles.expRow },
                  React.createElement(Text, { style: classicStyles.expRole }, edu.degree || "Degree"),
                  React.createElement(Text, { style: classicStyles.expPeriod }, edu.year)
                ),
                React.createElement(
                  Text,
                  { style: classicStyles.expCompany },
                  edu.institution
                ),
                edu.description
                  ? React.createElement(Text, { style: classicStyles.expDesc }, edu.description)
                  : null
              )
            )
          )
        : null,

      /* Skills */
      data.skills.length > 0
        ? React.createElement(
            View,
            { style: classicStyles.section },
            React.createElement(Text, { style: classicStyles.sectionTitle }, "Skills"),
            React.createElement(
              Text,
              { style: classicStyles.skillsText },
              data.skills.join(" · ")
            )
          )
        : null
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Modern PDF Template
───────────────────────────────────────────────────────────────────────────── */

const modernStyles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },
  sidebar: {
    width: "36%",
    backgroundColor: "#1e293b",
    padding: 28,
    color: "#e2e8f0",
  },
  sidebarInitial: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#38bdf8",
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    lineHeight: 2.3,
    marginBottom: 10,
  },
  sidebarName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#f8fafc",
    marginBottom: 2,
  },
  sidebarTitle: {
    fontSize: 9,
    color: "#7dd3fc",
    marginBottom: 16,
  },
  sidebarSectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#7dd3fc",
    marginBottom: 6,
    marginTop: 14,
  },
  sidebarContact: {
    fontSize: 9,
    color: "#94a3b8",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillChip: {
    backgroundColor: "#334155",
    color: "#cbd5e1",
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  content: {
    flex: 1,
    padding: 28,
    paddingTop: 32,
  },
  contentSectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#0ea5e9",
    marginBottom: 8,
    marginTop: 14,
  },
  accentBar: {
    width: 2,
    backgroundColor: "#bae6fd",
    marginRight: 8,
    borderRadius: 1,
  },
  entryRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 1,
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#0284c7",
    marginBottom: 2,
  },
  entryPeriod: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "right",
    minWidth: 50,
  },
  entryDesc: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  summaryText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.6,
  },
});

function ModernPDF({ data }: { data: ResumeData }) {
  const contactParts = [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean);

  return React.createElement(
    Document,
    { title: `${data.name} — Resume` },
    React.createElement(
      Page,
      { size: "A4", style: modernStyles.page },

      /* Sidebar */
      React.createElement(
        View,
        { style: modernStyles.sidebar },
        React.createElement(
          Text,
          { style: modernStyles.sidebarInitial },
          (data.name || "?")[0]
        ),
        React.createElement(Text, { style: modernStyles.sidebarName }, data.name || "Your Name"),
        React.createElement(Text, { style: modernStyles.sidebarTitle }, data.title || ""),

        React.createElement(Text, { style: modernStyles.sidebarSectionLabel }, "Contact"),
        ...contactParts.map((p, i) =>
          React.createElement(Text, { key: i, style: modernStyles.sidebarContact }, p)
        ),

        data.skills.length > 0
          ? React.createElement(
              View,
              null,
              React.createElement(Text, { style: modernStyles.sidebarSectionLabel }, "Skills"),
              React.createElement(
                View,
                { style: modernStyles.skillsRow },
                ...data.skills.map((skill) =>
                  React.createElement(Text, { key: skill, style: modernStyles.skillChip }, skill)
                )
              )
            )
          : null
      ),

      /* Content */
      React.createElement(
        View,
        { style: modernStyles.content },

        data.summary
          ? React.createElement(
              View,
              null,
              React.createElement(Text, { style: modernStyles.contentSectionTitle }, "Profile"),
              React.createElement(Text, { style: modernStyles.summaryText }, data.summary)
            )
          : null,

        data.experience.length > 0
          ? React.createElement(
              View,
              null,
              React.createElement(Text, { style: modernStyles.contentSectionTitle }, "Experience"),
              ...data.experience.map((exp) =>
                React.createElement(
                  View,
                  { key: exp.id, style: modernStyles.entryRow },
                  React.createElement(View, { style: modernStyles.accentBar }),
                  React.createElement(
                    View,
                    { style: modernStyles.entryContent },
                    React.createElement(
                      View,
                      { style: { flexDirection: "row", justifyContent: "space-between" } },
                      React.createElement(Text, { style: modernStyles.entryTitle }, exp.role || "Role"),
                      React.createElement(Text, { style: modernStyles.entryPeriod }, exp.period)
                    ),
                    React.createElement(Text, { style: modernStyles.entrySubtitle }, exp.company),
                    exp.description
                      ? React.createElement(Text, { style: modernStyles.entryDesc }, exp.description)
                      : null
                  )
                )
              )
            )
          : null,

        data.education.length > 0
          ? React.createElement(
              View,
              null,
              React.createElement(Text, { style: modernStyles.contentSectionTitle }, "Education"),
              ...data.education.map((edu) =>
                React.createElement(
                  View,
                  { key: edu.id, style: modernStyles.entryRow },
                  React.createElement(View, { style: modernStyles.accentBar }),
                  React.createElement(
                    View,
                    { style: modernStyles.entryContent },
                    React.createElement(
                      View,
                      { style: { flexDirection: "row", justifyContent: "space-between" } },
                      React.createElement(Text, { style: modernStyles.entryTitle }, edu.degree || "Degree"),
                      React.createElement(Text, { style: modernStyles.entryPeriod }, edu.year)
                    ),
                    React.createElement(Text, { style: modernStyles.entrySubtitle }, edu.institution),
                    edu.description
                      ? React.createElement(Text, { style: modernStyles.entryDesc }, edu.description)
                      : null
                  )
                )
              )
            )
          : null
      )
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Minimal PDF Template
───────────────────────────────────────────────────────────────────────────── */

const minimalStyles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 64,
    fontFamily: "Courier",
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.6,
  },
  name: {
    fontSize: 26,
    fontFamily: "Courier",
    fontWeight: "normal",
    color: "#111827",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 10,
    fontFamily: "Courier",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    fontSize: 9,
    color: "#9ca3af",
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 8,
    color: "#d1d5db",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 10,
    marginTop: 24,
  },
  entryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  entryLeft: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: "Courier",
    color: "#111827",
    marginBottom: 1,
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#9ca3af",
    marginBottom: 4,
  },
  entryDesc: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.55,
  },
  entryPeriod: {
    fontSize: 8.5,
    color: "#d1d5db",
    textAlign: "right",
    minWidth: 55,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    color: "#6b7280",
  },
  summaryText: {
    fontSize: 9.5,
    color: "#4b5563",
    lineHeight: 1.65,
  },
});

function MinimalPDF({ data }: { data: ResumeData }) {
  const contactParts = [data.email, data.phone, data.location, data.linkedin, data.website].filter(Boolean);

  return React.createElement(
    Document,
    { title: `${data.name} — Resume` },
    React.createElement(
      Page,
      { size: "A4", style: minimalStyles.page },

      React.createElement(Text, { style: minimalStyles.name }, data.name || "Your Name"),
      React.createElement(Text, { style: minimalStyles.jobTitle }, data.title || ""),
      React.createElement(
        View,
        { style: minimalStyles.contactRow },
        ...contactParts.map((p, i) => React.createElement(Text, { key: i }, p))
      ),

      data.summary
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: minimalStyles.sectionLabel }, "— Summary"),
            React.createElement(Text, { style: minimalStyles.summaryText }, data.summary)
          )
        : null,

      data.experience.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: minimalStyles.sectionLabel }, "— Experience"),
            ...data.experience.map((exp) =>
              React.createElement(
                View,
                { key: exp.id, style: minimalStyles.entryGrid },
                React.createElement(
                  View,
                  { style: minimalStyles.entryLeft },
                  React.createElement(Text, { style: minimalStyles.entryTitle }, exp.role || "Role"),
                  React.createElement(Text, { style: minimalStyles.entrySubtitle }, exp.company),
                  exp.description
                    ? React.createElement(Text, { style: minimalStyles.entryDesc }, exp.description)
                    : null
                ),
                React.createElement(Text, { style: minimalStyles.entryPeriod }, exp.period)
              )
            )
          )
        : null,

      data.education.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: minimalStyles.sectionLabel }, "— Education"),
            ...data.education.map((edu) =>
              React.createElement(
                View,
                { key: edu.id, style: minimalStyles.entryGrid },
                React.createElement(
                  View,
                  { style: minimalStyles.entryLeft },
                  React.createElement(Text, { style: minimalStyles.entryTitle }, edu.degree || "Degree"),
                  React.createElement(Text, { style: minimalStyles.entrySubtitle }, edu.institution),
                  edu.description
                    ? React.createElement(Text, { style: minimalStyles.entryDesc }, edu.description)
                    : null
                ),
                React.createElement(Text, { style: minimalStyles.entryPeriod }, edu.year)
              )
            )
          )
        : null,

      data.skills.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: minimalStyles.sectionLabel }, "— Skills"),
            React.createElement(
              View,
              { style: minimalStyles.skillsRow },
              ...data.skills.map((skill) =>
                React.createElement(Text, { key: skill }, skill)
              )
            )
          )
        : null
    )
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Route handler
───────────────────────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeData = body.resumeData as ResumeData;
    const template = (body.template as Template) ?? "classic";

    if (!resumeData || typeof resumeData !== "object") {
      return NextResponse.json({ error: "Missing resumeData" }, { status: 400 });
    }

    let doc: React.ReactElement<DocumentProps>;
    if (template === "modern") {
      doc = React.createElement(ModernPDF, { data: resumeData }) as React.ReactElement<DocumentProps>;
    } else if (template === "minimal") {
      doc = React.createElement(MinimalPDF, { data: resumeData }) as React.ReactElement<DocumentProps>;
    } else {
      doc = React.createElement(ClassicPDF, { data: resumeData }) as React.ReactElement<DocumentProps>;
    }

    const buffer = await renderToBuffer(doc);

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
