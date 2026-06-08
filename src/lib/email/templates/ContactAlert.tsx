import {
  Html, Head, Body, Container, Heading, Text, Hr, Section
} from "@react-email/components";

interface ContactAlertProps {
  name: string;
  email: string;
  department: string;
  message: string;
}

export function ContactAlert({ name, email, department, message }: ContactAlertProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "DM Sans, sans-serif", background: "#0D0D0F", color: "#F2F0EB" }}>
        <Container style={{ maxWidth: 600, margin: "40px auto", padding: "32px", background: "#1A202C", borderRadius: 12 }}>
          <Heading style={{ color: "#00E5C0", fontSize: 24, marginBottom: 8 }}>
            New Contact Message
          </Heading>
          <Text style={{ color: "#F2F0EB80", fontSize: 14, marginBottom: 24 }}>
            Submitted via the Contact form
          </Text>
          <Hr style={{ borderColor: "#2D3748" }} />
          <Section style={{ marginTop: 24 }}>
            <Text><strong>Name:</strong> {name}</Text>
            <Text><strong>Email:</strong> {email}</Text>
            <Text><strong>Department:</strong> {department}</Text>
            <Hr style={{ borderColor: "#2D3748", margin: "16px 0" }} />
            <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
