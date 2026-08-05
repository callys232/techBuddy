import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import { isEmailSubscribed } from "@/lib/subscription";

Font.registerHyphenationCallback((word) => [word]);

interface BusinessPlan {
  executiveSummary: string;
  problem: string;
  solution: string;
  marketAnalysis: string;
  businessModel: string;
  goToMarket: string;
  financialSummary: string;
  team: string;
  ask: string;
}

const s = StyleSheet.create({
  cover: { paddingTop: 140, paddingHorizontal: 60, fontFamily: "Helvetica" },
  coverEyebrow: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 2, textTransform: "uppercase", color: "#1E3A8A", marginBottom: 12 },
  coverTitle: { fontSize: 30, fontFamily: "Helvetica-Bold", color: "#111827", lineHeight: 1.2 },
  coverSub: { fontSize: 11, color: "#6b7280", marginTop: 16 },
  coverFooter: { position: "absolute", bottom: 60, left: 60, fontSize: 9, color: "#9ca3af" },
  page: { paddingTop: 50, paddingBottom: 50, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10, color: "#111827", lineHeight: 1.6 },
  sectionTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#1E3A8A", marginBottom: 6, marginTop: 18 },
  body: { fontSize: 10.5, color: "#374151", textAlign: "justify" },
  divider: { borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb", marginTop: 6 },
});

const SECTIONS: { key: keyof BusinessPlan; title: string }[] = [
  { key: "executiveSummary", title: "Executive Summary" },
  { key: "problem", title: "The Problem" },
  { key: "solution", title: "The Solution" },
  { key: "marketAnalysis", title: "Market Analysis" },
  { key: "businessModel", title: "Business Model" },
  { key: "goToMarket", title: "Go-to-Market Strategy" },
  { key: "financialSummary", title: "Financial Summary" },
  { key: "team", title: "Team" },
  { key: "ask", title: "The Ask" },
];

function BusinessPlanPDF({ idea, plan }: { idea: string; plan: BusinessPlan }) {
  return (
    <Document title="Business Plan">
      <Page size="A4" style={s.cover}>
        <Text style={s.coverEyebrow}>Business Plan</Text>
        <Text style={s.coverTitle}>{idea}</Text>
        <Text style={s.coverSub}>Prepared with TechBuddy — techbuddy.ng</Text>
        <Text style={s.coverFooter}>{new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</Text>
      </Page>
      <Page size="A4" style={s.page}>
        {SECTIONS.map(({ key, title }) => (
          plan[key] ? (
            <View key={key}>
              <Text style={s.sectionTitle}>{title}</Text>
              <Text style={s.body}>{plan[key]}</Text>
              <View style={s.divider} />
            </View>
          ) : null
        ))}
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email as string | undefined;
    const idea = body.idea as string;
    const plan = body.plan as BusinessPlan;

    if (!email || !(await isEmailSubscribed(email))) {
      return NextResponse.json({ error: "This report requires a TechBuddy Premium subscription" }, { status: 403 });
    }
    if (!plan || !idea) {
      return NextResponse.json({ error: "Missing plan data" }, { status: 400 });
    }

    const buffer = await renderToBuffer(<BusinessPlanPDF idea={idea} plan={plan} />);

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="business_plan.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[tools/business-plan-pdf]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
