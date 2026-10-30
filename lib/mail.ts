import nodemailer from "nodemailer";
import { CONTACT } from "./config";

export class MailNotConfigured extends Error {
  constructor() {
    super("SMTP credentials are not configured");
  }
}

export type Mail = { subject: string; text: string; html: string; replyTo?: string };

// Sends the enquiry to the team inbox. Configure SMTP_USER and SMTP_PASS in .env.local (see .env.example).
export async function sendMail(mail: Mail) {
  const to = process.env.CONTACT_TO || CONTACT.email;

  // Test mode: builds the message without sending it.
  if (process.env.CONTACT_DRY_RUN === "true") {
    const info = await nodemailer.createTransport({ jsonTransport: true }).sendMail({
      from: "website@workdane.local",
      to,
      ...mail,
    });
    console.log("[contact dry run]", info.message);
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new MailNotConfigured();

  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({ from: `"Workdane website" <${user}>`, to, ...mail });
}
