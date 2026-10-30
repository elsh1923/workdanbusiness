import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Our Partners | Workdane Management Consultancy" };

export default function OurPartners() {
  return (
    <InfoPage
      eyebrow="Our partners"
      title={
        <>
          Work with a network that <em className="gold-text italic">supports your business.</em>
        </>
      }
      intro="We work with banks, service providers and professional firms so that your setup does not stall waiting on someone else. Tell us what you need and we will introduce the right partner."
      points={[
        { title: "Banking", text: "Introductions to banks for business account applications." },
        { title: "Professional services", text: "Accountants, legal advisers and other specialists when you need them." },
        { title: "Business services", text: "Workspace, documentation and other providers that support your first year." },
      ]}
      formTitle="Ask for an introduction"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
        { name: "need", label: "What do you need?", type: "select", options: ["Banking", "Accounting or legal", "Workspace", "Something else"] },
      ]}
      submitLabel="Ask for an introduction"
      note="Introductions do not guarantee approval or acceptance by any partner."
    />
  );
}
