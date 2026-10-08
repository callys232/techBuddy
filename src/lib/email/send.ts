import { render } from "@react-email/components";
import { getResendClient } from "@/lib/email/resend";
import { QuoteAlert } from "./templates/QuoteAlert";
import { QuoteConfirmation } from "./templates/QuoteConfirmation";
import { ContactAlert } from "./templates/ContactAlert";

const FROM = "TechBuddy <noreply@techagency.africa>";
const TEAM_EMAIL = process.env.TEAM_EMAIL ?? "hello@techagency.africa";

export async function sendQuoteAlertToTeam(
  data: Parameters<typeof QuoteAlert>[0],
) {
  const resend = getResendClient();
  if (!resend) {
    return null;
  }

  const html = await render(QuoteAlert(data));
  return resend.emails.send({
    from: FROM,
    to: TEAM_EMAIL,
    subject: `New quote from ${data.name} (${data.company ?? data.email})`,
    html,
  });
}

export async function sendQuoteConfirmationToUser(name: string, email: string) {
  const resend = getResendClient();
  if (!resend) {
    return null;
  }

  const html = await render(QuoteConfirmation({ name }));
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "We got your quote request — expect a reply within 24 hours",
    html,
  });
}

export async function sendContactAlertToTeam(
  data: Parameters<typeof ContactAlert>[0],
) {
  const resend = getResendClient();
  if (!resend) {
    return null;
  }

  const html = await render(ContactAlert(data));
  return resend.emails.send({
    from: FROM,
    to: TEAM_EMAIL,
    subject: `Contact message from ${data.name} — ${data.department}`,
    html,
  });
}
