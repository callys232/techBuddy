export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: "NGN" | "USD" | "GBP" | "EUR";
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromPhone: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  bankDetails: string;
}

export const CURRENCY_SYMBOLS: Record<InvoiceData["currency"], string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  invoiceNumber: `INV-${new Date().getFullYear()}-001`,
  issueDate: todayPlus(0),
  dueDate: todayPlus(14),
  currency: "NGN",
  fromName: "",
  fromEmail: "",
  fromAddress: "",
  fromPhone: "",
  toName: "",
  toEmail: "",
  toAddress: "",
  items: [{ id: uid(), description: "", quantity: 1, unitPrice: 0 }],
  taxRate: 7.5,
  notes: "Thank you for your business.",
  bankDetails: "",
};

export function invoiceSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}

export function invoiceTotals(data: InvoiceData) {
  const subtotal = invoiceSubtotal(data.items);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
