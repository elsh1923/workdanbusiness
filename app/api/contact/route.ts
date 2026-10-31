import { MailNotConfigured, sendMail } from "@/lib/mail";

type Field = { label: string; value: string; type: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s-]{7,25}$/;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const reply = (status: number, message: string, extra: Record<string, unknown> = {}) =>
  Response.json({ ok: status === 200, message, ...extra }, { status });

function toField(x: unknown): Field {
  const f = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  return { label: clean(f.label, 80), value: clean(f.value, 2000), type: clean(f.type, 20) };
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return reply(429, "Too many messages from this connection. Please wait a few minutes, or message us on WhatsApp.", { fallback: true });
  }

  const body = (await req.json().catch(() => null)) as { form?: unknown; fields?: unknown; website?: unknown } | null;
  if (!body) return reply(400, "We could not read your message. Please try again.", { fallback: false });

  // Hidden honeypot field: real visitors leave it empty. Pretend success so bots move on.
  if (clean(body.website, 100)) return reply(200, "Sent");

  const form = clean(body.form, 80) || "Website enquiry";
  const fields = (Array.isArray(body.fields) ? body.fields.slice(0, 20) : []).map(toField).filter((f) => f.label);
  const filled = fields.filter((f) => f.value);
  if (!filled.length) return reply(400, "Please fill in the form before sending.", { fallback: false });

  const email = fields.find((f) => f.type === "email" && f.value);
  const phone = fields.find((f) => f.type === "tel" && f.value);
  if (email && !EMAIL.test(email.value)) return reply(400, "Please enter a valid email address.", { fallback: false });
  if (phone && !PHONE.test(phone.value)) return reply(400, "Please enter a valid phone number.", { fallback: false });
  if (!email && !phone) return reply(400, "Please give us an email address or phone number so we can reach you.", { fallback: false });

  const who = filled.find((f) => /name/i.test(f.label))?.value;
  const text = `${form}\n\n` + filled.map((f) => `${f.label}: ${f.value}`).join("\n");
  const html =
    `<h2 style="margin:0 0 12px">${esc(form)}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    filled
      .map((f) => `<tr><td style="color:#666;vertical-align:top">${esc(f.label)}</td><td><strong>${esc(f.value).replace(/\n/g, "<br>")}</strong></td></tr>`)
      .join("") +
    `</table>`;

  try {
    await sendMail({ subject: `[Website] ${form}${who ? ` - ${who}` : ""}`.replace(/[\r\n]+/g, " "), text, html, replyTo: email?.value });
    hits.set(ip, [...recent, now]);
    return reply(200, "Sent");
  } catch (err) {
    if (err instanceof MailNotConfigured) {
      return reply(503, "Online sending is not set up yet. You can send this message on WhatsApp instead.", { fallback: true });
    }
    console.error("[contact] send failed", err);
    return reply(500, "We could not send your message just now. Please try again, or send it on WhatsApp.", { fallback: true });
  }
}
