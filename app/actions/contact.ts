"use server"

import { Resend } from "resend"

// Initialize Resend client using environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData, receiverEmail: string) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Simple validation
  if (!name || !email || !message) {
    return { error: "Please fill out all fields." }
  }

  // Ensure Resend API Key is set
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable.")
    return { error: "Server configuration error. Contact form is currently unavailable." }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Craft Studio <onboarding@resend.dev>", // resend.dev test email, use verified domain in prod
      to: [receiverEmail],
      replyTo: email,
      subject: `New Contact Inquiry from ${name}`,
      text: message,
      html: `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    })

    if (error) {
      console.error("Resend API Error:", error)
      return { error: "Failed to send message. Please try again later." }
    }

    return { success: true }
  } catch (err) {
    console.error("Unexpected error sending email:", err)
    return { error: "An unexpected error occurred. Please try again later." }
  }
}
