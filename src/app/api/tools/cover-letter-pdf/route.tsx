import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: { paddingTop: 64, paddingBottom: 64, paddingHorizontal: 64, fontFamily: "Helvetica", fontSize: 10.5, color: "#111827", lineHeight: 1.6 },
  name: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  contact: { fontSize: 9, color: "#6b7280", marginBottom: 24 },
  date: { fontSize: 9.5, color: "#6b7280", marginBottom: 24 },
  paragraph: { marginBottom: 14, textAlign: "justify" },
  sign: { marginTop: 18 },
});

function CoverLetterPDF({ name, email, phone, letter }: { name: string; email?: string; phone?: string; letter: string }) {
  const paragraphs = letter.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <Document title={`${name} — Cover Letter`}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{name}</Text>
        <Text style={s.contact}>{[email, phone].filter(Boolean).join("  ·  ")}</Text>
        <Text style={s.date}>{today}</Text>
        {paragraphs.map((p, i) => (
          <Text key={i} style={s.paragraph}>{p}</Text>
        ))}
        <Text style={s.sign}>Sincerely,{"\n"}{name}</Text>
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, letter } = body as { name: string; email?: string; phone?: string; letter: string };
    if (!name || !letter) {
      return NextResponse.json({ error: "name and letter are required" }, { status: 400 });
    }

    const buffer = await renderToBuffer(<CoverLetterPDF name={name} email={email} phone={phone} letter={letter} />);
    const safeName = name.replace(/[^a-z0-9]/gi, "_");

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}_cover_letter.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[tools/cover-letter-pdf]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
