import { MailNotConfigured, sendMail, type Attachment } from "@/lib/mail";
import { buildRegistrationPdf, type PdfInput } from "@/lib/registration-pdf";
import { FILE_SLOTS, FULL_NAME_MESSAGE, MAX_SHAREHOLDERS, holderNumber, isFullName, questionNumber, type RegistrationData } from "@/lib/registration";


const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FILE = 6 * 1024 * 1024;
const MAX_TOTAL = 20 * 1024 * 1024;
const TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const WINDOW_MS = 30 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");
const list = (v: unknown, allowed?: readonly string[]) =>
  (Array.isArray(v) ? v : []).map((x) => clean(x, 120)).filter((x) => x && (!allowed || allowed.includes(x))).slice(0, 12);

const reply = (status: number, message: string, extra: Record<string, unknown> = {}) =>
  Response.json({ ok: status === 200, message, ...extra }, { status });

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return reply(429, "Too many submissions from this connection. Please wait a little, or contact us on WhatsApp.", { fallback: true });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reply(400, "We could not read your form. Please try again.");
  }
  if (clean(form.get("website"), 50)) return reply(200, "Sent"); // honeypot

  let raw: Partial<RegistrationData>;
  try {
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return reply(400, "We could not read your form. Please try again.");
  }

  const holders = (Array.isArray(raw.shareholders) ? raw.shareholders : []).slice(0, MAX_SHAREHOLDERS);
  if (holders.length < 1) return reply(400, "Add at least one shareholder.");

  const sh = holders.map((h) => ({
    roles: list(h.roles),
    percent: clean(h.percent, 6),
    fullName: clean(h.fullName, 120),
    phone: clean(h.phone, 30),
    email: clean(h.email, 120),
    address: clean(h.address, 300),
    fatherName: clean(h.fatherName, 120),
    motherName: clean(h.motherName, 120),
    passportNo: clean(h.passportNo, 40),
    nationality: clean(h.nationality, 80),
    passportExpiry: clean(h.passportExpiry, 20),
    uaeResident: clean(h.uaeResident, 5),
  }));

  const names = (Array.isArray(raw.names) ? raw.names : []).map((n) => clean(n, 120));
  if (!names[0] || !names[1] || !names[2]) return reply(400, "Please give three company name options.");

  const total = sh.reduce((t, h) => t + (parseFloat(h.percent) || 0), 0);
  if (Math.abs(total - 100) > 0.01) return reply(400, "The shareholding percentages must add up to 100%.");
  for (const [i, h] of sh.entries()) {
    const label = `Shareholder ${i + 1}`;
    if (!h.fullName || !h.phone || !h.address || !h.fatherName || !h.passportNo || !h.nationality || !h.passportExpiry || !h.uaeResident)
      return reply(400, `${label}: please complete all required fields.`);
    if (!EMAIL.test(h.email)) return reply(400, `${label}: please enter a valid email address.`);
    if (!isFullName(h.fullName)) return reply(400, `${label}: ${FULL_NAME_MESSAGE.toLowerCase()}.`);
    if (!isFullName(h.fatherName)) return reply(400, `${label}: father's full name. ${FULL_NAME_MESSAGE}.`);
    if (h.motherName && !isFullName(h.motherName)) return reply(400, `${label}: mother's full name. ${FULL_NAME_MESSAGE}.`);
  }

  // files
  const docs: PdfInput["documents"] = [];
  let totalBytes = 0;
  for (let i = 0; i < sh.length; i++) {
    for (const slot of FILE_SLOTS) {
      const v = form.get(`sh${i}_${slot.key}`);
      if (!(v instanceof File) || v.size === 0) {
        if (slot.required) return reply(400, `Shareholder ${i + 1}: please upload ${slot.label.toLowerCase()}.`);
        continue;
      }
      if (!TYPES.has(v.type)) return reply(400, `${slot.label} (shareholder ${i + 1}) must be a PDF, JPG, PNG or WebP file.`);
      if (v.size > MAX_FILE) return reply(400, `${slot.label} (shareholder ${i + 1}) is larger than 6 MB. Please upload a smaller file.`);
      totalBytes += v.size;
      if (totalBytes > MAX_TOTAL) return reply(400, "The uploaded files are too large in total. Please compress them and try again.");
      const ext = v.type === "application/pdf" ? "pdf" : v.type === "image/png" ? "png" : v.type === "image/webp" ? "webp" : "jpg";
      docs.push({
        holder: i + 1,
        label: slot.label,
        filename: `Shareholder${i + 1}-${slot.key}-${(sh[i].fullName || "").replace(/[^a-z0-9]+/gi, "_").slice(0, 30)}.${ext}`,
        type: v.type,
        data: new Uint8Array(await v.arrayBuffer()),
      });
    }
  }

  const d = {
    authority: clean(raw.authority, 120),
    consultant: clean(raw.consultant, 120),
    investorVisas: clean(raw.investorVisas, 4),
    employeeVisas: clean(raw.employeeVisas, 4),
    activities: (Array.isArray(raw.activities) ? raw.activities : []).slice(0, 30).map((a) => ({ code: clean(a?.code, 20), name: clean(a?.name, 200) })).filter((a) => a.name),
    turnover: clean(raw.turnover, 40),
    experience: clean(raw.experience, 1500),
    businessDescription: clean(raw.businessDescription, 1500),
    targetCountries: clean(raw.targetCountries, 600),
    paymentFromCustomers: clean(raw.paymentFromCustomers, 600),
    paymentToSuppliers: clean(raw.paymentToSuppliers, 600),
    otherLicence: clean(raw.otherLicence, 5),
    otherLicenceDetails: clean(raw.otherLicenceDetails, 400),
    crime: list(raw.crime),
    crimeOther: clean(raw.crimeOther, 300),
    pep: list(raw.pep),
    wealth: list(raw.wealth),
    wealthOther: clean(raw.wealthOther, 300),
    declaration: raw.declaration === true,
  };
  if (!d.declaration) return reply(400, "Please confirm the declaration before submitting.");
  if (!d.wealth.length) return reply(400, "Please choose at least one source of wealth.");
  if (!d.paymentFromCustomers || !d.paymentToSuppliers) return reply(400, "Please complete the payment method questions.");

  const ref = `REG-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // One combined PDF: the filled form followed by every uploaded document.
  const attachments: Attachment[] = [];
  try {
    const { bytes, unmerged } = await buildRegistrationPdf({ ref, ...d, names, shareholders: sh, documents: docs });
    attachments.push({ filename: `Registration-${ref}-${(sh[0].fullName || "applicant").replace(/[^a-z0-9]+/gi, "_").slice(0, 30)}.pdf`, content: Buffer.from(bytes), contentType: "application/pdf" });
    for (const u of unmerged) attachments.push({ filename: u.filename, content: Buffer.from(u.data), contentType: u.type });
  } catch (err) {
    console.error("[registration] pdf failed", err);
    for (const u of docs) attachments.push({ filename: u.filename, content: Buffer.from(u.data), contentType: u.type });
  }

  // email

  const q = (n: string, label: string, value: string) =>
    `<tr><td style="color:#07399d;font-weight:bold;vertical-align:top;padding:5px 10px 5px 0;white-space:nowrap">${esc(n)}</td><td style="color:#444;vertical-align:top;padding:5px 14px 5px 0">${esc(label)}</td><td style="padding:5px 0"><strong>${esc(value || "-").replace(/\n/g, "<br>")}</strong></td></tr>`;
  const block = (rows: string) => `<table cellpadding="0" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse;margin-bottom:6px">${rows}</table>`;
  const qn = (b: number) => questionNumber(b);
  const totalVisas = (parseInt(d.investorVisas, 10) || 0) + (parseInt(d.employeeVisas, 10) || 0);
  const acts = d.activities.map((a, i) => q(i === 0 ? "5" : "", `Business Activity ${i + 1}`, `${a.code} ${a.name}`.trim())).join("");

  let html = `<h2 style="margin:0;font-family:Arial,sans-serif">Company registration form</h2><p style="font-family:Arial,sans-serif;color:#666;margin:4px 0 12px">Reference ${ref}. The question numbers match the form and the attached PDF.</p>`;
  html += block(
    q("1", "Registration Authority", d.authority) +
      q("2", "Business Consultant Name", d.consultant) +
      names.map((n, i) => q(i === 0 ? "3" : "", `Company Name Option ${i + 1}`, n)).join("") +
      q("4", "Number of Visa", String(totalVisas)) +
      q("", "Investor/partner Visa", d.investorVisas || "0") +
      q("", "Employment Visa", d.employeeVisas || "0") +
      acts,
  );
  sh.forEach((h, i) => {
    const n = i + 1;
    html += `<h3 style="margin:18px 0 2px;color:#07399d;font-family:Arial,sans-serif">${holderNumber()}. SHARE HOLDERS</h3><p style="font-family:Arial,sans-serif;font-weight:bold;margin:2px 0 2px">Share holder ${n}</p>`;
    html += block(
      q("", "Role", h.roles.join(", ")) +
        q("", `Share holder ${n}: share holding percentage`, `From 100% - ${h.percent}%`) +
        q("", `Share holder ${n}: Full Name`, h.fullName) +
        q("", `Share holder ${n}: Contact Number`, h.phone) +
        q("", `Share holder ${n}: Email ID`, h.email) +
        q("", `Share holder ${n}: Home Address`, h.address) +
        q("", `Share holder ${n}: Father's Full Name`, h.fatherName) +
        q("", `Share holder ${n}: Mother's Full Name`, h.motherName) +
        q("", `Share holder ${n}: Passport Number`, h.passportNo) +
        q("", `Share holder ${n}: Nationality`, h.nationality) +
        q("", `Share holder ${n}: Passport Expiry Date`, h.passportExpiry) +
        q("", `Share holder ${n}: Are you A UAE Resident?`, h.uaeResident),
    );
  });
  html += block(
    q(String(qn(7)), "Expected Annual Turnover (AED)", d.turnover) +
      q(String(qn(8)), "Previous Employment/Business Experience", d.experience) +
      q(String(qn(9)), "Brief description of your intended business in UAE", d.businessDescription) +
      q(String(qn(10)), "Countries where your targeted customers will be based", d.targetCountries) +
      q(String(qn(11)), "Payment methods accepted from customers", d.paymentFromCustomers) +
      q(String(qn(12)), "Primary payment method with suppliers", d.paymentToSuppliers) +
      q(String(qn(13)), "Hold any other business license?", `${d.otherLicence}${d.otherLicenceDetails ? ` - ${d.otherLicenceDetails}` : ""}`) +
      q(String(qn(14)), "Involved in any of the below activities", `${d.crime.join(", ") || "-"}${d.crimeOther ? ` (${d.crimeOther})` : ""}`) +
      q(String(qn(15)), "Involved in any of the below", d.pep.join(", ") || "-") +
      q(String(qn(16)), "Source of wealth declaration", `${d.wealth.join(", ")}${d.wealthOther ? ` (${d.wealthOther})` : ""}`) +
      q(String(qn(17)), "Hold any other business license?", `${d.otherLicence}${d.otherLicenceDetails ? ` - ${d.otherLicenceDetails}` : ""}`) +
      q(String(qn(18)), "Involved in any of the below activities", `${d.crime.join(", ") || "-"}${d.crimeOther ? ` (${d.crimeOther})` : ""}`) +
      q(String(qn(19)), "Involved in any of the below", d.pep.join(", ") || "-") +
      q(String(qn(20)), "Source of wealth declaration", `${d.wealth.join(", ")}${d.wealthOther ? ` (${d.wealthOther})` : ""}`),
  );
  html += `<p style="font-family:Arial,sans-serif;color:#666;margin-top:20px">Declaration confirmed by the applicant. The completed form and all uploaded documents are attached as one PDF.</p>`;

  const text =
    `Company registration form ${ref}\n\n` +
    `1. Registration Authority: ${d.authority}\n2. Business Consultant Name: ${d.consultant}\n` +
    `3. Company Names: ${names.join(" | ")}\n4. Number of Visa: ${totalVisas} (investor/partner ${d.investorVisas}, employment ${d.employeeVisas})\n` +
    `5. Business activities: ${d.activities.map((a) => `${a.code} ${a.name}`).join("; ")}` +
    sh.map((h, i) => `\n${holderNumber()}. SHARE HOLDERS - Share holder ${i + 1}: ${h.fullName} (${h.percent}%) ${h.email} ${h.phone}`).join("") +
    `\n${qn(7)}. Expected Annual Turnover: ${d.turnover}\n${qn(11)}. Payments from customers: ${d.paymentFromCustomers}\n${qn(12)}. Payments to suppliers: ${d.paymentToSuppliers}` +
    "\n\nThe completed form and all uploaded documents are attached as one PDF.";

  try {
    await sendMail({ subject: `[Website] Company registration ${ref} - ${sh[0].fullName}`, text, html, replyTo: sh[0].email, attachments });
    hits.set(ip, [...recent, now]);
    return reply(200, "Sent", { ref });
  } catch (err) {
    if (err instanceof MailNotConfigured) return reply(503, "Online sending is not set up yet. Please contact us on WhatsApp.", { fallback: true });
    console.error("[registration] send failed", err);
    return reply(500, "We could not send your form just now. Please try again, or contact us on WhatsApp.", { fallback: true });
  }
}
