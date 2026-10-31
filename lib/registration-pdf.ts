import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { CRIME_OPTIONS, FILE_SLOTS, PEP_OPTIONS, WEALTH_SOURCES, holderNumber, questionNumber } from "./registration";

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
const GREY = rgb(0.55, 0.55, 0.55);
const ANSWER = rgb(0.03, 0.2, 0.55);
const RED = rgb(0.85, 0.1, 0.1);
const RULE = rgb(0.72, 0.72, 0.72);

// Wording of each upload line, as printed on Workdane's registration form.
const PRINTED_FILE: Record<string, string> = {
  passport: "Upload: Passport scanned File",
  photo: "Upload: Passport size photo",
  address: "File Upload: Proof of Address (ID, Driving License, Bill, Contract or anyother....)",
  bank: "File Upload: 3 to 6 months Bank Statement",
  experience: "Previous Employment/Business Experience",
};

// The form follows the printed Workdane form page by page, with the answers filled in.
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

  const qn = (b: number) => questionNumber(b);
  let page: PDFPage = pdf.addPage([W, H]);
  let y = TOP;

  const frame = (p: PDFPage) => {
    p.drawText("COMPANY REGISTRATION FORM BY WORKDANE CONSULTANCY - UAE", { x: MX, y: H - 40, size: 8, font: bold, color: BLACK });
    const r = safe(`Ref ${d.ref}`);
    p.drawText(r, { x: W - MX - font.widthOfTextAtSize(r, 8), y: H - 40, size: 8, font, color: GREY });
    p.drawLine({ start: { x: MX, y: H - 47 }, end: { x: W - MX, y: H - 47 }, thickness: 0.6, color: RULE });
  };
  frame(page);

  const newPage = () => {
    page = pdf.addPage([W, H]);
    frame(page);
    y = TOP;
  };
  const ensure = (h: number) => {
    if (y - h < BOTTOM) newPage();
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

  // numbered question heading, e.g. "3.  Company Name:" (long questions wrap, like the printed form)
  const heading = (n: string, text: string, opts: { required?: boolean; hint?: string; right?: string } = {}) => {
    const lines = wrap(`${n}.  ${text}`, bold, 11.5, W - MX * 2 - (opts.right ? 40 : 0));
    ensure(34 + lines.length * 14);
    y -= 14;
    lines.forEach((l, i) => {
      page.drawText(l, { x: MX + (i ? 16 : 0), y, size: 11.5, font: bold, color: BLACK });
      if (i === lines.length - 1 && opts.required) page.drawText("*", { x: MX + (i ? 16 : 0) + bold.widthOfTextAtSize(l, 11.5) + 2, y, size: 11.5, font: bold, color: RED });
      if (i < lines.length - 1) y -= 14;
    });
    if (opts.right) {
      const r = safe(opts.right);
      page.drawText(r, { x: W - MX - bold.widthOfTextAtSize(r, 10.5), y: y - 14, size: 10.5, font: bold, color: BLACK });
      y -= 12;
    }
    y -= 8;
    if (opts.hint) {
      page.drawText(safe(opts.hint), { x: MX, y: y - 3, size: 8.5, font: italic, color: GREY });
      y -= 14;
    }
    y -= 6;
  };

  // "Label" line with the answer under it
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

  const hintLine = (text: string) => {
    ensure(16);
    page.drawText(safe(text), { x: MX, y, size: 8.5, font: italic, color: GREY });
    y -= 14;
  };

  const check = (x: number, yy: number) => {
    page.drawLine({ start: { x, y: yy + 3 }, end: { x: x + 3, y: yy }, thickness: 1.4, color: ANSWER });
    page.drawLine({ start: { x: x + 3, y: yy }, end: { x: x + 9, y: yy + 8 }, thickness: 1.4, color: ANSWER });
  };

  const box = (x: number, yy: number, on: boolean) => {
    page.drawRectangle({ x, y: yy - 1, width: 9, height: 9, borderWidth: 0.8, borderColor: BLACK });
    if (on) {
      page.drawLine({ start: { x: x + 1.8, y: yy + 0.8 }, end: { x: x + 7.2, y: yy + 6.4 }, thickness: 1.3, color: ANSWER });
      page.drawLine({ start: { x: x + 1.8, y: yy + 6.4 }, end: { x: x + 7.2, y: yy + 0.8 }, thickness: 1.3, color: ANSWER });
    }
  };

  // "o" bullets like the printed form; a filled bullet means chosen
  const bullet = (x: number, yy: number, on: boolean) => {
    page.drawCircle({ x: x + 3, y: yy + 3, size: 3, borderWidth: 0.8, borderColor: BLACK, color: on ? ANSWER : rgb(1, 1, 1) });
  };
  const options = (opts: readonly string[], chosen: string[], labelOf: (o: string) => string = (o) => o) => {
    opts.forEach((o) => {
      const on = chosen.includes(o);
      const lines = wrap(labelOf(o), on ? bold : font, 10, W - MX * 2 - 60);
      ensure(lines.length * 13 + 8);
      bullet(MX + 24, y, on);
      lines.forEach((ln, i) => page.drawText(ln, { x: MX + 42, y: y - i * 13, size: 10, font: on ? bold : font, color: on ? ANSWER : BLACK }));
      y -= lines.length * 13 + 8;
    });
  };
  const specify = (label: string, value: string) => {
    ensure(30);
    page.drawText(safe(label), { x: MX + 42, y, size: 10, font, color: BLACK });
    y -= 14;
    if (value) {
      wrap(value, bold, 10, W - MX * 2 - 60).forEach((ln) => {
        page.drawText(ln, { x: MX + 42, y, size: 10, font: bold, color: ANSWER });
        y -= 13;
      });
    }
    y -= 4;
  };

  // 1-3
  heading("1", "Registration Authority", { required: true });
  page.drawText(safe(d.authority.toUpperCase()), { x: MX + 8, y: y + 4, size: 10.5, font: bold, color: ANSWER });
  y -= 14;
  hintLine("The Authority you are registering your company");
  heading("2", "Business Consultant Name");
  page.drawText(safe(d.consultant), { x: MX + 8, y: y + 4, size: 10.5, font: bold, color: ANSWER });
  y -= 18;
  heading("3", "Company Name:");
  d.names.forEach((n, i) => field(`Company Name Option ${i + 1}:`, n, true, true));

  // 4
  const total = (parseInt(d.investorVisas, 10) || 0) + (parseInt(d.employeeVisas, 10) || 0);
  heading("4", "Number of Visa", { required: true });
  field("Number of Visa", String(total));
  field("Investor/partner Visa", d.investorVisas || "0");
  field("Employment Visa", d.employeeVisas || "0");

  // 5
  heading("5", "Mention your business activities including Codes");
  const rows = Math.max(5, d.activities.length);
  for (let i = 0; i < rows; i++) {
    const a = d.activities[i];
    field(`Business Activity ${i + 1}`, a ? `${a.code} ${a.name}`.trim() : "");
  }
  hintLine("Note: Additional activity is chargeable");

  // 6 - every shareholder has a page of its own; question 6 is printed once, on the first
  d.shareholders.forEach((h, i) => {
    const n = i + 1;
    newPage();
    y = TOP - 14;
    if (i === 0) {
      page.drawText(`${holderNumber()}.  SHARE HOLDERS`, { x: MX, y, size: 12, font: bold, color: BLACK });
      y -= 18;
    }
    page.drawText(`Share holder ${n}`, { x: MX, y, size: 11, font: bold, color: BLACK });
    y -= 22;
    let rx = MX;
    ["General Manager", "Board of Director", "Share Holder"].forEach((role, ri) => {
      const key = ["General Manager", "Board of Director", "Shareholder"][ri];
      box(rx, y, h.roles.includes(key));
      page.drawText(role, { x: rx + 14, y: y + 0.5, size: 9.5, font: h.roles.includes(key) ? bold : font, color: h.roles.includes(key) ? ANSWER : BLACK });
      rx += 14 + font.widthOfTextAtSize(role, 9.5) + 26;
    });
    y -= 22;
    field(`Share holder ${n}: share holding percentage`, `From 100% - ${h.percent}%`, true);
    hintLine("Provide share holding percentage");
    field(`Share holder ${n}: Full Name`, h.fullName, true);
    field(`Share holder ${n}: Contact Number`, h.phone, true);
    field(`Share holder ${n}: Email ID`, h.email, true);
    field(`Share holder ${n}: Home Address`, h.address, true);
    field(`Share holder ${n}: Father's Full Name`, h.fatherName, true);
    field(`Share holder ${n}: Mother's Full Name`, h.motherName);
    field(`Share holder ${n}: Passport Number`, h.passportNo);
    field(`Share holder ${n}: Nationality`, h.nationality);
    field(`Share holder ${n}: Passport Expiry Date`, h.passportExpiry);
    field(`Share holder ${n}: Are you A UAE Resident? Yes /No`, h.uaeResident);

    ensure(40 + FILE_SLOTS.length * 18);
    y -= 6;
    page.drawText("File that should Attached:", { x: MX, y, size: 12, font: bold, color: BLACK });
    y -= 20;
    page.drawText(`Share holder ${n}`, { x: MX + 12, y, size: 10.5, font: bold, color: BLACK });
    y -= 18;
    FILE_SLOTS.forEach((slot) => {
      const doc = d.documents.find((x) => x.holder === n && x.label === slot.label);
      const pg = doc ? pageOf(doc) : null;
      if (doc) check(MX + 14, y);
      const lines = wrap(PRINTED_FILE[slot.key] ?? slot.label, doc ? bold : font, 10, W - MX * 2 - 150);
      lines.forEach((ln, li) => page.drawText(ln, { x: MX + 32, y: y - li * 12 + 0.5, size: 10, font: doc ? bold : font, color: doc ? ANSWER : BLACK }));
      const status = doc ? (pg ? `attached, page ${pg}` : "attached separately") : slot.required ? "not attached" : "not provided";
      page.drawText(safe(status), { x: W - MX - font.widthOfTextAtSize(safe(status), 9), y: y + 0.5, size: 9, font: doc ? bold : italic, color: doc ? ANSWER : GREY });
      y -= lines.length * 12 + 7;
    });
  });

  // 7-16, starting on a fresh page like the printed form
  newPage();
  y = TOP - 4;
  heading(String(qn(7)), "Expected Annual Turnover");
  page.drawLine({ start: { x: MX + 8, y: y - 3 }, end: { x: W - MX - 34, y: y - 3 }, thickness: 0.6, color: RULE });
  page.drawText(safe(d.turnover), { x: MX + 12, y, size: 10.5, font: bold, color: ANSWER });
  page.drawText("AED", { x: W - MX - 28, y, size: 9.5, font: bold, color: BLACK });
  y -= 14;
  heading(String(qn(8)), "Previous Employment/Business Experience");
  field("Provide Brief description of your previous work experience", d.experience);
  heading(String(qn(9)), "Brief description of your intended business in UAE");
  field("Provide Brief description of your intended business", d.businessDescription);
  heading(String(qn(10)), "List all the countries where your targeted customers will be based (UAE and international)");
  field("Countries", d.targetCountries);
  heading(String(qn(11)), "Mention the relevant payment methods you will be accepting from customers? Example, cash, bank transfers etc", { required: true });
  field("Answer", d.paymentFromCustomers);
  heading(String(qn(12)), "Mention the primary payment method your company will use, when transacting with suppliers? Example, cash, bank transfers, card etc");
  field("Answer", d.paymentToSuppliers);

  // 13-16, then the same four questions again as 17-20, exactly as the printed form continues
  const licenceBlock = (n: number) => {
    heading(String(n), "Do you hold any other business license- in the UAE or other country?", { right: "Yes/No" });
    page.drawText(safe((d.otherLicence || "").toUpperCase()), { x: MX + 8, y: y + 8, size: 10.5, font: bold, color: ANSWER });
    y -= 6;
    hintLine("If yes, please list the company name and which country it is based in.");
    if (d.otherLicence === "Yes" && d.otherLicenceDetails) field("Company name and country", d.otherLicenceDetails);
  };
  const crimeBlock = (n: number) => {
    heading(String(n), "Have you been involved in any of the below activities:");
    options(CRIME_OPTIONS, d.crime);
    specify("If Other, Please specify", d.crime.includes("Other") ? d.crimeOther : "");
  };
  const pepBlock = (n: number) => {
    heading(String(n), "Have you been involved in any of the below:");
    options(PEP_OPTIONS, d.pep);
  };
  const wealthBlock = (n: number) => {
    heading(String(n), "SOURCE OF WEALTH DECLARATION", { required: true });
    options(WEALTH_SOURCES, d.wealth, (o) => (o === "Other" ? "Other," : o));
    specify("Please specify:", d.wealth.includes("Other") ? d.wealthOther : "");
  };

  licenceBlock(qn(13));
  crimeBlock(qn(14));
  pepBlock(qn(15));
  wealthBlock(qn(16));
  licenceBlock(qn(17));
  crimeBlock(qn(18));
  pepBlock(qn(19));
  wealthBlock(qn(20));

  ensure(40);
  y -= 8;
  wrap("Declaration: the applicant confirmed electronically that the information and documents given are true and complete.", italic, 8.5, W - MX * 2).forEach((l) => {
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

  const unmerged: Doc[] = [...bad];
  const captionSet = new Set(font.getCharacterSet());
  for (const doc of d.documents) {
    if (bad.has(doc)) continue;
    const caption = Array.from(`Shareholder ${doc.holder} - ${doc.label}`)
      .filter((c) => captionSet.has(c.codePointAt(0)!))
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

  // page numbers, bottom right, like the printed form
  const all = pdf.getPageCount();
  for (let i = 0; i < all; i++) {
    const p = pdf.getPage(i);
    const { width } = p.getSize();
    const t = `${i + 1}`;
    p.drawText(t, { x: width - 40 - font.widthOfTextAtSize(t, 9), y: i < count ? 36 : 20, size: 9, font, color: GREY });
  }

  return { bytes: await pdf.save(), unmerged };
}
