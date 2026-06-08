import { z } from "zod";

export const quoteSchema = z.object({
  pains: z.array(z.string()).min(0),
  template: z.string().optional(),
  budget: z.number().min(500_000).max(50_000_000),
  timeline: z.enum(["ASAP", "1-3 months", "3-6 months", "No rush"]),
  features: z.array(z.string()),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  whatsapp: z.string().min(7, "WhatsApp number required"),
  company: z.string().optional(),
  source: z.string().optional(),
  contactMethod: z.enum(["email", "whatsapp", "call"]),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
