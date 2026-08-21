import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import { isEmailSubscribed } from "@/lib/subscription";
import { isUnlocked } from "@/lib/store";
import type { AuditReport } from "@/lib/audit/engine";

Font.registerHyphenationCallback((word) => [word]);

const GRADE_COLORS: Record<string, string> = { A: "#059669", B: "#0891B2", C: "#D97706", D: "#EA580C", F: "#DC2626" };

const CATEGORY_LABEL: Record<string, string> = {
  security: "Security",
  seo: "SEO",
  performance: "Performance",
  "best-practices": "Best Practices",
};

const s = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 50, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  eyebrow: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, textTransform: "uppercase", color: "#1E3A8A" },
  url: { fontSize: 16, fontFamily: "Helvetica-Bold", marginTop: 4, marginBottom: 24 },
  scoreBox: { alignItems: "center" },
  scoreValue: { fontSize: 32, fontFamily: "Helvetica-Bold" },
  scoreLabel: { fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 },
  sectionTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, color: "#374151", marginBottom: 8, marginTop: 16, borderBottomWidth: 0.5, borderBottomColor: "#d1d5db", paddingBottom: 4 },
  row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#f3f4f6" },
  status: { width: 16, fontSize: 10, fontFamily: "Helvetica-Bold" },
  label: { flex: 1, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  detail: { flex: 1.3, fontSize: 9, color: "#6b7280" },
});

function AuditPDF({ report }: { report: AuditReport }) {
  const categories = ["security", "seo", "performance", "best-practices"] as const;
  return (
    <Document title={`Premium Audit — ${report.url}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>Premium Audit Report</Text>
            <Text style={s.url}>{report.url}</Text>
          </View>
          <View style={s.scoreBox}>
            <Text style={{ ...s.scoreValue, color: GRADE_COLORS[report.grade] }}>{report.grade}</Text>
            <Text style={s.scoreLabel}>{report.score}/100</Text>
          </View>
        </View>

        {categories.map((cat) => {
          const items = report.findings.filter((f) => f.category === cat);
          if (items.length === 0) return null;
          return (
            <View key={cat}>
              <Text style={s.sectionTitle}>{CATEGORY_LABEL[cat]}</Text>
              {items.map((f, i) => (
                <View key={i} style={s.row}>
                  <Text style={{ ...s.status, color: f.passed ? "#059669" : "#DC2626" }}>{f.passed ? "✓" : "✕"}</Text>
                  <Text style={s.label}>{f.label}</Text>
                  <Text style={s.detail}>{f.detail}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email as string | undefined;
    const report = body.report as AuditReport;

    const hasAccess = !!email && ((await isEmailSubscribed(email)) || (await isUnlocked(email, "premium-audit-unlock")));
    if (!hasAccess) {
      return NextResponse.json({ error: "This report requires TechBuddy Premium or the audit unlock from the store" }, { status: 403 });
    }
    if (!report) {
      return NextResponse.json({ error: "Missing report data" }, { status: 400 });
    }

    const buffer = await renderToBuffer(<AuditPDF report={report} />);

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="premium_audit_report.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[tools/premium-audit-pdf]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
