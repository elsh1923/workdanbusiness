import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Careers | Workdane Management Consultancy" };

export default function Careers() {
  return (
    <InfoPage
      eyebrow="Careers"
      title={
        <>
          Build your career <em className="gold-text italic">with Workdane.</em>
        </>
      }
      intro="We are always glad to meet people who care about helping businesses start and stay compliant. Send us your details and we will contact you when a suitable role opens."
      points={[
        { title: "Business setup consultants", text: "Guide founders through licences, structures and approvals from the first call." },
        { title: "Visa and PRO officers", text: "Handle visa, Emirates ID and government service applications for clients." },
        { title: "Accounts and compliance", text: "Support clients with bookkeeping, VAT and renewals." },
      ]}
      formTitle="Tell us about yourself"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
        { name: "area", label: "Area of interest", type: "select", options: ["Business setup", "Visa and PRO", "Accounts and compliance", "Sales and marketing", "Other"] },
        { name: "message", label: "A short introduction", type: "textarea" },
      ]}
      submitLabel="Send my details"
      note="Please do not send passport or ID numbers. We will ask for documents later if needed."
    />
  );
}
