import nodemailer from "nodemailer";
import { CONTACT } from "./config";

export class MailNotConfigured extends Error {
  constructor() {
    super("SMTP credentials are not configured");
  }
}

export type Attachment = { filename: string; content: Buffer; contentType?: string };
export type Mail = { subject: string; text: string; html: string; replyTo?: string; attachments?: Attachment[] };

// Sends the enquiry to the team inbox. Configure SMTP_USER and SMTP_PASS in .env.local (see .env.example).
export async function sendMail(mail: Mail) {
  const to = process.env.CONTACT_TO || CONTACT.email;

  // Test mode: builds the message without sending it.
  if (process.env.CONTACT_DRY_RUN === "true") {
    const { attachments, ...rest } = mail;
    // CONTACT_DRY_RUN_DIR lets a developer open the generated attachments without sending anything.
    if (process.env.CONTACT_DRY_RUN_DIR && attachments?.length) {
      const { mkdirSync, writeFileSync } = await import("node:fs");
      mkdirSync(process.env.CONTACT_DRY_RUN_DIR, { recursive: true });
      for (const a of attachments) writeFileSync(`${process.env.CONTACT_DRY_RUN_DIR}/${a.filename}`, a.content);
    }
    const info = await nodemailer.createTransport({ jsonTransport: true }).sendMail({
      from: "website@workdane.local",
      to,
      ...rest,
    });
    console.log("[contact dry run]", info.message, attachments?.length ? `| ${attachments.length} attachments: ${attachments.map((a) => `${a.filename} (${a.content.length} bytes)`).join(", ")}` : "");
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
