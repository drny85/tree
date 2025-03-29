"use server";

import ContactEmail from "@/emails/ContactEmail";
import { rateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  console.log(name, email, message);
  // Validate form data
  if (!name || !email || !message) {
    return { error: "All fields are required" };
  }
  // Send the email using Resend
  const headersList = headers();
  const ip = (await headersList).get("x-forwarded-for") || "unknown";

  const canSubmit = await rateLimit(ip);
  if (!canSubmit) {
    return { error: "Rate limit exceeded" };
  }

  if (!process.env.RESEND_API_KEY) {
    return { error: "Missing RESEND_API_KEY" };
  }

  try {
    await resend.emails.send({
      from: email,
      to: "your-email@example.com", // Replace with your email
      subject: "New Contact Form Submission",
      replyTo: email,
      react: ContactEmail({ name, email, message }),
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send email" };
  }
}
