import { NextResponse } from "next/server";
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Font } from "@react-pdf/renderer";
import type { InvoiceData } from "@/types/invoice";
import { CURRENCY_SYMBOLS, invoiceTotals } from "@/types/invoice";

Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: { paddingTop: 50, paddingBottom: 50, paddingHorizontal: 56, fontFamily: "Helvetica", fontSize: 10, color: "#111827" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#1E3A8A" },
  invoiceLabel: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "right" },
  invoiceMeta: { fontSize: 9, color: "#6b7280", textAlign: "right", marginTop: 4 },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  partyBlock: { width: "46%" },
  partyLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#9ca3af", marginBottom: 6 },
  partyName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  partyLine: { fontSize: 9, color: "#4b5563", lineHeight: 1.5 },
  table: { borderTopWidth: 1.5, borderTopColor: "#111827", borderBottomWidth: 1.5, borderBottomColor: "#111827" },
  tHeadRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: "#d1d5db" },
  tRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: "#f3f4f6" },
  tHead: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1, color: "#6b7280" },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: "right" },
  colPrice: { width: 80, textAlign: "right" },
  colTotal: { width: 80, textAlign: "right" },
  totalsBlock: { alignSelf: "flex-end", width: 220, marginTop: 16 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalsLabel: { fontSize: 9.5, color: "#6b7280" },
  totalsValue: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  grandRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: "#111827" },
  grandLabel: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  grandValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1E3A8A" },
  footer: { marginTop: 40 },
  footerLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#9ca3af", marginBottom: 4 },
  footerText: { fontSize: 9, color: "#4b5563", lineHeight: 1.5 },
});

function fmt(n: number, currency: InvoiceData["currency"]): string {
  return `${CURRENCY_SYMBOLS[currency]}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function InvoicePDF({ data }: { data: InvoiceData }) {
  const { subtotal, tax, total } = invoiceTotals(data);
  return (
    <Document title={`Invoice ${data.invoiceNumber}`}>
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.brand}>{data.fromName || "Your Business"}</Text>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceMeta}>{data.invoiceNumber}</Text>
            <Text style={s.invoiceMeta}>Issued {data.issueDate} · Due {data.dueDate}</Text>
          </View>
        </View>

        <View style={s.partiesRow}>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>From</Text>
            <Text style={s.partyName}>{data.fromName || "—"}</Text>
            {data.fromAddress && <Text style={s.partyLine}>{data.fromAddress}</Text>}
            {data.fromEmail && <Text style={s.partyLine}>{data.fromEmail}</Text>}
            {data.fromPhone && <Text style={s.partyLine}>{data.fromPhone}</Text>}
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>Bill to</Text>
            <Text style={s.partyName}>{data.toName || "—"}</Text>
            {data.toAddress && <Text style={s.partyLine}>{data.toAddress}</Text>}
            {data.toEmail && <Text style={s.partyLine}>{data.toEmail}</Text>}
          </View>
        </View>

        <View style={s.table}>
          <View style={s.tHeadRow}>
            <Text style={[s.tHead, s.colDesc]}>Description</Text>
            <Text style={[s.tHead, s.colQty]}>Qty</Text>
            <Text style={[s.tHead, s.colPrice]}>Unit price</Text>
            <Text style={[s.tHead, s.colTotal]}>Amount</Text>
          </View>
          {data.items.map((item) => (
            <View key={item.id} style={s.tRow}>
              <Text style={[s.colDesc, { fontSize: 9.5 }]}>{item.description || "—"}</Text>
              <Text style={[s.colQty, { fontSize: 9.5 }]}>{item.quantity}</Text>
              <Text style={[s.colPrice, { fontSize: 9.5 }]}>{fmt(item.unitPrice, data.currency)}</Text>
              <Text style={[s.colTotal, { fontSize: 9.5, fontFamily: "Helvetica-Bold" }]}>{fmt(item.quantity * item.unitPrice, data.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totalsBlock}>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Subtotal</Text>
            <Text style={s.totalsValue}>{fmt(subtotal, data.currency)}</Text>
          </View>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Tax ({data.taxRate}%)</Text>
            <Text style={s.totalsValue}>{fmt(tax, data.currency)}</Text>
          </View>
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>Total due</Text>
            <Text style={s.grandValue}>{fmt(total, data.currency)}</Text>
          </View>
        </View>

        {data.bankDetails && (
          <View style={s.footer}>
            <Text style={s.footerLabel}>Payment details</Text>
            <Text style={s.footerText}>{data.bankDetails}</Text>
          </View>
        )}
        {data.notes && (
          <View style={s.footer}>
            <Text style={s.footerLabel}>Notes</Text>
            <Text style={s.footerText}>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.invoiceData as InvoiceData;
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Missing invoiceData" }, { status: 400 });
    }

    const buffer = await renderToBuffer(<InvoicePDF data={data} />);
    const safeNumber = (data.invoiceNumber ?? "invoice").replace(/[^a-z0-9-]/gi, "_");

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[tools/invoice-pdf]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
