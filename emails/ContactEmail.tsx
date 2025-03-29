import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactEmail({
  name,
  email,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission</Preview>
      <Body>
        <Container>
          <Heading>New Contact Form Submission</Heading>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
          <Text>Message: {message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
