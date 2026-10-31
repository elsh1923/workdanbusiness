import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { CRIME_OPTIONS, FILE_SLOTS, PEP_OPTIONS, WEALTH_SOURCES } from "./registration";

export type PdfShareholder = {
  roles: string[];
  percent: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  fatherName: string;
  motherName: string;
  passportNo: string;
  nationality: string;
  passportExpiry: string;
  uaeResident: string;
};

export type PdfInput = {
  ref: string;
  authority: string;
  consultant: string;
  names: string[];
  investorVisas: string;
  employeeVisas: string;
  activities: { code: string; name: string }[];
  shareholders: PdfShareholder[];
  turnover: string;
  experience: string;
  businessDescription: string;
  targetCountries: string;
  paymentFromCustomers: string;
  paymentToSuppliers: string;
  otherLicence: string;
  otherLicenceDetails: string;
  crime: string[];
  crimeOther: string;
  pep: string[];
  wealth: string[];
  wealthOther: string;
  documents: { holder: number; label: string; filename: string; type: string; data: Uint8Array }[];
};

type Doc = PdfInput["documents"][number];

const W = 595.28;
const H = 841.89;
const MX = 54;
const TOP = H - 64;
const BOTTOM = 62;
const BLACK = rgb(0.1, 0.1, 0.1);
const GREY = rgb(0.45, 0.45, 0.45);
const ANSWER = rgb(0.03, 0.2, 0.55);
const RED = rgb(0.85, 0.1, 0.1);
const RULE = rgb(0.75, 0.75, 0.75);

// The form follows the layout and numbering of Workdane's own registration form, with the answers filled in.
// It is drawn twice: first to count its pages, then again with the page numbers of the attached documents.
async function drawForm(pdf: PDFDocument, d: PdfInput, pageOf: (doc: Doc) => number | null) {
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const charset = new Set(font.getCharacterSet());
  // Standard PDF fonts only cover Latin text. Other scripts show as "?" here; the email body keeps the original.
  const safe = (s: string) =>
    Array.from(String(s ?? "").replace(/\r?\n/g, " "))
      .map((c) => (charset.has(c.codePointAt(0)!) ? c : "?"))
      .join("");

  let page: PDFPage = pdf.addPage([W, H]);
  let y = TOP;

  const frame = (p: PDFPage) => {
    p.drawText("COMPANY REGISTRATION FORM BY WORKDANE CONSULTANCY - UAE", { x: MX, y: H - 40, size: 8, font: bold, color: BLACK });
    const r = safe(`Ref ${d.ref}`);
    p.drawText(r, { x: W - MX - font.widthOfTextAtSize(r, 8), y: H - 40, size: 8, font, color: GREY });
    p.drawLine({ start: { x: MX, y: H - 47 }, end: { x: W - MX, y: H - 47 }, thickness: 0.6, color: RULE });
  };
  frame(page);

  const ensure = (h: number) => {
    if (y - h < BOTTOM) {
      page = pdf.addPage([W, H]);
      frame(page);
      y = TOP;
    }
  };

  const wrap = (text: string, f: PDFFont, size: number, width: number) => {
    const words = safe(text).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(t, size) <= width) cur = t;
      else {
        if (cur) lines.push(cur);
        let rest = w;
        while (f.widthOfTextAtSize(rest, size) > width) {
          let cut = rest.length;
          while (cut > 1 && f.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut--;
          lines.push(rest.slice(0, cut));
          rest = rest.slice(cut);
        }
        cur = rest;
      }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  };

  // numbered question heading, e.g. "3.  Company Name:"
  const heading = (n: string, text: string, required = false, hint?: string) => {
    ensure(40);
    y -= 14;
    const t = safe(`${n}.  ${text}`);
    page.drawText(t, { x: MX, y, size: 11.5, font: bold, color: BLACK });
    if (required) page.drawText("*", { x: MX + bold.widthOfTextAtSize(t, 11.5) + 2, y, size: 11.5, font: bold, color: RED });
    y -= 6;
    if (hint) {
      y -= 11;
      page.drawText(safe(hint), { x: MX, y, size: 8.5, font: italic, color: GREY });
    }
    y -= hint ? 20 : 8;
  };

  // "Label:   answer" line, answer wraps under the label when long
  const field = (label: string, answer: string, required = false, rule = false) => {
    const lines = wrap(answer || "", bold, 10.5, W - MX * 2 - 12);
    ensure(18 + lines.length * 14);
    const l = safe(label);
    page.drawText(l, { x: MX, y, size: 9, font, color: BLACK });
    if (required) page.drawText("*", { x: MX + font.widthOfTextAtSize(l, 9) + 2, y, size: 9, font, color: RED });
    y -= 15;
    lines.forEach((ln) => {
      page.drawText(ln, { x: MX + 8, y, size: 10.5, font: bold, color: ANSWER });
      y -= 14;
    });
    if (!answer) y -= 2;
    if (rule) page.drawLine({ start: { x: MX, y: y + 6 }, end: { x: W - MX, y: y + 6 }, thickness: 0.5, color: RULE });
    y -= 6;
  };

  const box = (x: number, yy: number, on: boolean) => {
    page.drawRectangle({ x, y: yy - 1, width: 9, height: 9, borderWidth: 0.8, borderColor: BLACK });
    if (on) {
      page.drawLine({ start: { x: x + 1.8, y: yy + 0.8 }, end: { x: x + 7.2, y: yy + 6.4 }, thickness: 1.3, color: ANSWER });
      page.drawLine({ start: { x: x + 1.8, y: yy + 6.4 }, end: { x: x + 7.2, y: yy + 0.8 }, thickness: 1.3, color: ANSWER });
    }
  };

  const options = (opts: readonly string[], chosen: string[]) => {
    opts.forEach((o) => {
      const lines = wrap(o, font, 10, W - MX * 2 - 36);
      ensure(lines.length * 13 + 6);
      box(MX + 12, y, chosen.includes(o));
      lines.forEach((ln, i) => page.drawText(ln, { x: MX + 30, y: y - i * 13, size: 10, font: chosen.includes(o) ? bold : font, color: chosen.includes(o) ? ANSWER : BLACK }));
      y -= lines.length * 13 + 4;
    });
  };

  // 1-3
  heading("1", "Registration Authority", true, "The Authority you are registering your company");
  page.drawText(safe(d.authority.toUpperCase()), { x: MX + 8, y, size: 11, font: bold, color: ANSWER });
  y -= 20;
  heading("2", "Business Consultant Name");
  page.drawText(safe(d.consultant), { x: MX + 8, y, size: 11, font: bold, color: ANSWER });
  y -= 20;
  heading("3", "Company Name:");
  d.names.forEach((n, i) => field(`Company Name Option ${i + 1}:`, n, true, true));

  // 4
  const total = (parseInt(d.investorVisas, 10) || 0) + (parseInt(d.employeeVisas, 10) || 0);
  heading("4", "Number of Visa", true);
  field("Number of Visa", String(total));
  field("Investor/partner Visa", d.investorVisas || "0");
  field("Employment Visa", d.employeeVisas || "0");

  // 5
  heading("5", "Mention your business activities including Codes");
  const acts = d.activities.length ? d.activities : [];
  const rows = Math.max(5, acts.length);
  for (let i = 0; i < rows; i++) {
    const a = acts[i];
    field(`Business Activity ${i + 1}`, a ? `${a.code} ${a.name}`.trim() : "");
  }
  ensure(16);
  page.drawText("Note: Additional activity is chargeable", { x: MX + 8, y, size: 8.5, font: italic, color: GREY });
  y -= 16;

  // 6
  ensure(60);
  y -= 10;
  page.drawText("6.  SHARE HOLDERS", { x: MX, y, size: 12, font: bold, color: BLACK });
  y -= 10;
  d.shareholders.forEach((h, i) => {
    const n = i + 1;
    ensure(90);
    y -= 12;
    page.drawLine({ start: { x: MX, y: y + 8 }, end: { x: W - MX, y: y + 8 }, thickness: 0.8, color: RULE });
    page.drawText(`Share holder ${n}`, { x: MX, y: y - 6, size: 11, font: bold, color: BLACK });
    y -= 26;
    // roles
    let rx = MX;
    ["General Manager", "Board of Director", "Share Holder"].forEach((role, ri) => {
      const key = ["General Manager", "Board of Director", "Shareholder"][ri];
      box(rx, y, h.roles.includes(key));
      page.drawText(role, { x: rx + 14, y: y + 0.5, size: 9.5, font: h.roles.includes(key) ? bold : font, color: h.roles.includes(key) ? ANSWER : BLACK });
      rx += 14 + font.widthOfTextAtSize(role, 9.5) + 26;
    });
    y -= 20;
    field(`Share holder ${n}: share holding percentage`, `From 100% - ${h.percent}%`, true);
    field(`Share holder ${n}: Full Name`, h.fullName, true);
    field(`Share holder ${n}: Contact Number`, h.phone, true);
    field(`Share holder ${n}: Email ID`, h.email, true);
    field(`Share holder ${n}: Home Address`, h.address, true);
    field(`Share holder ${n}: Father Name`, h.fatherName, true);
    field(`Share holder ${n}: Mother Name`, h.motherName);
    field(`Share holder ${n}: Passport Number`, h.passportNo);
    field(`Share holder ${n}: Nationality`, h.nationality);
    field(`Share holder ${n}: Passport Expiry Date`, h.passportExpiry);
    field(`Share holder ${n}: Are you A UAE Resident?  Yes / No`, h.uaeResident);

    ensure(30 + FILE_SLOTS.length * 16);
    page.drawText("File that should Attached:", { x: MX, y, size: 11, font: bold, color: BLACK });
    y -= 18;
    FILE_SLOTS.forEach((slot) => {
      const doc = d.documents.find((x) => x.holder === n && x.label === slot.label);
      const pg = doc ? pageOf(doc) : null;
      const label = `${slot.label}`;
      box(MX + 12, y, !!doc);
      page.drawText(safe(label), { x: MX + 30, y: y + 0.5, size: 10, font, color: BLACK });
      const status = doc ? (pg ? `attached, page ${pg}` : "attached separately") : slot.required ? "not attached" : "not provided";
      page.drawText(safe(status), { x: W - MX - font.widthOfTextAtSize(safe(status), 9), y: y + 0.5, size: 9, font: doc ? bold : italic, color: doc ? ANSWER : GREY });
      y -= 16;
    });
    y -= 6;
  });

  // 7-12
  heading("7", "Expected Annual Turnover");
  field("Amount", d.turnover ? `${d.turnover} AED` : "");
  heading("8", "Previous Employment/Business Experience");
  field("Provide brief description of your previous work experience", d.experience);
  heading("9", "Brief description of your intended business in UAE");
  field("Provide brief description of your intended business", d.businessDescription);
  heading("10", "List all the countries where your targeted customers will be based", false, "(UAE and international)");
  field("Countries", d.targetCountries);
  heading("11", "Mention the relevant payment methods you will be accepting from customers? Example, cash, bank transfers etc", true);
  field("Answer", d.paymentFromCustomers);
  heading("12", "Mention the primary payment method your company will use, when transacting with suppliers? Example, cash, bank transfers, card etc");
  field("Answer", d.paymentToSuppliers);

  // 13-16
  heading("13", "Do you hold any other business license - in the UAE or other country?");
  options(["Yes", "No"], d.otherLicence ? [d.otherLicence] : []);
  if (d.otherLicence === "Yes") field("If yes, please list the company name and which country it is based in", d.otherLicenceDetails);

  heading("14", "Have you been involved in any of the below activities:");
  options(CRIME_OPTIONS, d.crime);
  if (d.crime.includes("Other")) field("If Other, please specify", d.crimeOther);

  heading("15", "Have you been involved in any of the below:");
  options(PEP_OPTIONS, d.pep);

  heading("16", "SOURCE OF WEALTH DECLARATION", true);
  options(WEALTH_SOURCES, d.wealth);
  if (d.wealth.includes("Other")) field("Please specify", d.wealthOther);

  ensure(40);
  y -= 8;
  const decl = wrap("Declaration: the applicant confirmed electronically that the information and documents given are true and complete.", italic, 8.5, W - MX * 2);
  decl.forEach((l) => {
    page.drawText(l, { x: MX, y, size: 8.5, font: italic, color: GREY });
    y -= 12;
  });

  return { count: pdf.getPageCount(), font, bold };
}

export async function buildRegistrationPdf(d: PdfInput): Promise<{ bytes: Uint8Array; unmerged: Doc[] }> {
  // Work out how many pages each document will take, so the form can say where each one is.
  const pagesOf = new Map<Doc, number>();
  const bad = new Set<Doc>();
  for (const doc of d.documents) {
    try {
      if (doc.type === "application/pdf") {
        const src = await PDFDocument.load(doc.data, { ignoreEncryption: true });
        pagesOf.set(doc, src.getPageCount());
      } else if (doc.type === "image/jpeg" || doc.type === "image/png") pagesOf.set(doc, 1);
      else bad.add(doc);
    } catch {
      bad.add(doc);
    }
  }

  const probe = await PDFDocument.create();
  const { count: formPages } = await drawForm(probe, d, () => null);

  const startPage = new Map<Doc, number>();
  let next = formPages + 1;
  for (const doc of d.documents) {
    if (bad.has(doc)) continue;
    startPage.set(doc, next);
    next += pagesOf.get(doc) ?? 1;
  }

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Company registration form ${d.ref}`);
  pdf.setAuthor("Workdane Management Consultancy");
  const { count, font, bold } = await drawForm(pdf, d, (doc) => startPage.get(doc) ?? null);
  const totalPages = count + [...pagesOf.entries()].filter(([k]) => !bad.has(k)).reduce((t, [, n]) => t + n, 0);

  const unmerged: Doc[] = [...bad];
  for (const doc of d.documents) {
    if (bad.has(doc)) continue;
    const caption = `Shareholder ${doc.holder} - ${doc.label}`
      .split("")
      .filter((c) => new Set(font.getCharacterSet()).has(c.codePointAt(0)!))
      .join("");
    try {
      if (doc.type === "application/pdf") {
        const src = await PDFDocument.load(doc.data, { ignoreEncryption: true });
        const copied = await pdf.copyPages(src, src.getPageIndices());
        copied.forEach((p) => {
          pdf.addPage(p);
          const { width } = p.getSize();
          p.drawText(caption, { x: Math.max(8, (width - font.widthOfTextAtSize(caption, 7.5)) / 2), y: 8, size: 7.5, font, color: GREY });
        });
      } else {
        const img = doc.type === "image/png" ? await pdf.embedPng(doc.data) : await pdf.embedJpg(doc.data);
        const p = pdf.addPage([W, H]);
        p.drawText("COMPANY REGISTRATION FORM BY WORKDANE CONSULTANCY - UAE", { x: MX, y: H - 40, size: 8, font: bold, color: BLACK });
        p.drawLine({ start: { x: MX, y: H - 47 }, end: { x: W - MX, y: H - 47 }, thickness: 0.6, color: RULE });
        p.drawText(caption, { x: MX, y: H - 68, size: 11, font: bold, color: ANSWER });
        const maxW = W - MX * 2;
        const maxH = H - 110 - 60;
        const s = Math.min(maxW / img.width, maxH / img.height, 1.6);
        const w = img.width * s;
        const h = img.height * s;
        p.drawImage(img, { x: (W - w) / 2, y: H - 90 - h, width: w, height: h });
      }
    } catch {
      unmerged.push(doc);
    }
  }

  // page numbers, bottom right, like the original form
  const all = pdf.getPageCount();
  for (let i = 0; i < all; i++) {
    const p = pdf.getPage(i);
    const { width } = p.getSize();
    const t = `${i + 1}`;
    p.drawText(t, { x: width - 40 - font.widthOfTextAtSize(t, 9), y: i < count ? 36 : 20, size: 9, font, color: GREY });
  }
  void totalPages;

  return { bytes: await pdf.save(), unmerged };
}
