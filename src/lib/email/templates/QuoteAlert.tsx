import {
  Html, Head, Body, Container, Heading, Text, Hr, Section
} from "@react-email/components";

interface QuoteAlertProps {
  name: string;
  email: string;
  whatsapp: string;
  company?: string;
  pains: string[];
  template?: string;
  budget: number;
  timeline: string;
  features: string[];
  colors?: string[];
  estimatedRange?: string;
  contactMethod: string;
}

export function QuoteAlert({
  name, email, whatsapp, company, pains, template,
  budget, timeline, features, colors, estimatedRange, contactMethod,
}: QuoteAlertProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "DM Sans, sans-serif", background: "#0D0D0F", color: "#F2F0EB" }}>
        <Container style={{ maxWidth: 600, margin: "40px auto", padding: "32px", background: "#1A202C", borderRadius: 12 }}>
          <Heading style={{ color: "#00E5C0", fontSize: 24, marginBottom: 8 }}>
            New Quote Request
          </Heading>
          <Text style={{ color: "#F2F0EB80", fontSize: 14, marginBottom: 24 }}>
            Submitted via the Quote Builder
          </Text>
          <Hr style={{ borderColor: "#2D3748" }} />
          <Section style={{ marginTop: 24 }}>
            <Text><strong>Name:</strong> {name}</Text>
            <Text><strong>Email:</strong> {email}</Text>
            <Text><strong>WhatsApp:</strong> {whatsapp}</Text>
            {company && <Text><strong>Company:</strong> {company}</Text>}
            <Text><strong>Pain Points:</strong> {pains.join(", ")}</Text>
            {template && <Text><strong>Template:</strong> {template}</Text>}
            {estimatedRange && <Text><strong>Computed estimate:</strong> {estimatedRange}</Text>}
            <Text><strong>Stated budget:</strong> ₦{(budget / 1_000_000).toFixed(1)}M</Text>
            <Text><strong>Timeline:</strong> {timeline}</Text>
            <Text><strong>Features:</strong> {features.join(", ")}</Text>
            {!!colors?.length && (
              <Text>
                <strong>Preferred colors:</strong>{" "}
                {colors.map((hex) => (
                  <span key={hex} style={{ marginRight: 10 }}>
                    <span style={{
                      display: "inline-block", width: 12, height: 12, borderRadius: 6,
                      backgroundColor: hex, marginRight: 4, verticalAlign: "middle",
                    }} />
                    {hex}
                  </span>
                ))}
              </Text>
            )}
            <Text><strong>Contact via:</strong> {contactMethod}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
