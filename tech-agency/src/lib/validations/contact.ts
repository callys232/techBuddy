import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  department: z.enum(["sales", "technical", "partnerships", "support", "press"]),
  message: z.string().min(10, "Message too short"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Valid email required"),
  tags: z.array(z.string()).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
