import {
  Html, Head, Body, Container, Heading, Text, Button, Hr
} from "@react-email/components";

interface QuoteConfirmationProps {
  name: string;
  calLink?: string;
}

export function QuoteConfirmation({ name, calLink = "https://cal.com" }: QuoteConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "DM Sans, sans-serif", background: "#0D0D0F", color: "#F2F0EB" }}>
        <Container style={{ maxWidth: 600, margin: "40px auto", padding: "32px", background: "#1A202C", borderRadius: 12 }}>
          <Heading style={{ color: "#00E5C0", fontSize: 24 }}>
            Got it, {name}! 🎉
          </Heading>
          <Text style={{ color: "#F2F0EB", lineHeight: 1.7 }}>
            We&apos;ve received your quote request and will be in touch within <strong>24 hours</strong>.
          </Text>
          <Text style={{ color: "#F2F0EB80", fontSize: 14 }}>
            Want to fast-track things? Book a free 30-minute discovery call with our team.
          </Text>
          <Hr style={{ borderColor: "#2D3748", margin: "24px 0" }} />
          <Button
            href={calLink}
            style={{ background: "#00E5C0", color: "#0D0D0F", padding: "12px 28px", borderRadius: 999, fontWeight: 700 }}
          >
            Book a Discovery Call
          </Button>
          <Text style={{ color: "#F2F0EB40", fontSize: 12, marginTop: 32 }}>
            TechAgency · Lagos, Nigeria · hello@techagency.africa
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
