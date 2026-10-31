import { COMPANY, CONTACT, OFFICES } from "@/lib/config";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

// Tells Google who the business is, where it works and how to contact it (schema.org markup).
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY.name,
    legalName: CONTACT.legalName,
    url: siteUrl,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    description:
      "Business consultants in the UAE: company formation, licensing, visas, bank account assistance, VAT and renewals, with offices in Dubai and Sharjah.",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    knowsAbout: ["UAE company setup", "business licences", "residence visas", "corporate banking assistance", "VAT registration"],
    location: OFFICES.map((o) => ({
      "@type": "Place",
      name: `${COMPANY.name}, ${o.name}`,
      address: { "@type": "PostalAddress", streetAddress: o.lines.slice(0, -1).join(", "), addressCountry: "AE" },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
