# Workdane Business — Corporate Brochure Template Kit

> **Version 2.0 · 2026**
> Designed to match the brand of [workdanbusiness.vercel.app](https://workdanbusiness.vercel.app/)

---

## 📁 File Structure

```
brochure-template/
│
├── index.html              ← 12-slide interactive preview (1280×720 screen)
├── print.html              ← 11-slide A4 Landscape (PDF export — USE THIS FOR PRINT)
│
├── background-cover.svg    ← Cover page chevron geometry (left split)
├── background-pricing.svg  ← Pricing pages diagonal ribbon (right accent)
├── background-split.svg    ← Split-layout right chevron
├── background-why.svg      ← "Why Workdane" chevron (left-facing)
├── background-contact.svg  ← Back cover: UAE sunset skyline silhouette
│
├── tokens.css              ← All brand CSS variables + utility classes
└── README.md               ← This file
```

---

## 🖨️ How to Export to PDF

1. Open `print.html` in **Google Chrome** (or any Chromium browser)
2. Press `Ctrl + P` (Windows) or `Cmd + P` (Mac)
3. Set:
   - **Destination:** Save as PDF
   - **Layout:** Landscape
   - **Paper size:** A4
   - **Margins:** None
   - ✅ **Background graphics:** ON (critical!)
4. Click **Save** — you get a crisp A4 landscape PDF with all 11 slides as individual pages

---

## 🎨 Brand Design System

| Token | Hex | Use |
|---|---|---|
| `--midnight` | `#06132a` | Dark backgrounds, heavy text |
| `--navy` | `#07399d` | Primary brand colour, links |
| `--gold` | `#c28500` | Key accent colour |
| `--gold-light` | `#ffc63d` | CTAs, highlight gold |
| `--bronze` | `#8f5a00` | Gradient end |
| `--surface` | `#ffffff` | Page backgrounds |
| `--heading` | `#0b1730` | Heading text |
| `--body` | `#4b5563` | Body text |

**Fonts (Google Fonts):**
- Headings/Display: **Montserrat** (700, 800, 900)
- Body/UI: **Plus Jakarta Sans** (400, 500, 600, 700, 800)

---

## 📋 Slide Map

| # | File | Slide Title |
|---|---|---|
| 01 | Cover | "Do you deal in Business Setup Services?" |
| 02 | Photo | UAE Landscape — Key Statistics |
| 03 | Why | Why Workdane Business (split photo) |
| 04 | USPs | WHERE ELSE? — 12 Key Advantages |
| 05 | Partner | What's In It For You? (Partner Benefits) |
| 06 | Price | Price List: E-Commerce & Digital |
| 07 | Price | Price List: General Trading & Commercial |
| 08 | Price | Price List: Professional & IT Services |
| 09 | Docs | Documents Issued to Clients |
| 10 | Fac | Facilities & Workspaces |
| 11 | Contact | Back Cover — Contact & Let's Connect |

---

## 🔧 How to Customise Company Name

This template is designed as a **white-label background template**.
To swap the company name/logo:

1. Open `print.html` in any text editor (VS Code recommended)
2. Search for `WORKDANE` and replace with your client's company name
3. Replace `../public/logo-workdane.png` with the client's logo path
4. Update contact details in **Slide 11** (phone, email, address)
5. Update pricing figures in **Slides 6, 7, 8** if required

> **Tip:** Keep the SVG background files unchanged — they contain no company
> branding and are designed to be reused across clients.

---

## 📞 Contact Details (Current)

| | |
|---|---|
| **Company** | Workdane Management Consultancy (Workdane Trading LLC FZE) |
| **Licence** | 4413932.01 |
| **Phone / WhatsApp** | +971 56 537 4748 |
| **Email** | workdaneuae@gmail.com |
| **Dubai Office** | Al Khaimah Building, 3rd Floor, Office 34, Port Saeed, Deira, Dubai |
| **Sharjah Office** | Ground Floor, Business Centre, Sharjah Publishing City FZ |
| **Website** | https://workdanbusiness.vercel.app/ |
