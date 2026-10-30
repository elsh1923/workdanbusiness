import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Activity Hub | Workdane Management Consultancy" };

export default function ActivityHub() {
  return (
    <InfoPage
      eyebrow="Activity hub"
      title={
        <>
          Events, workshops and <em className="gold-text italic">networking.</em>
        </>
      }
      intro="No sessions are scheduled yet. Ask us to invite you and we will send details as soon as there is something to attend."
      points={[
        { title: "Setup workshops", text: "Short sessions on licences, visas and what to prepare before you apply." },
        { title: "Networking", text: "Meet other founders and professionals building businesses in the UAE." },
        { title: "Be first to know", text: "Leave your details and we will invite you when dates are announced." },
      ]}
      formTitle="Request an invitation"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel" },
        { name: "interest", label: "I am interested in", type: "select", options: ["Workshops", "Networking events", "Both"] },
      ]}
      submitLabel="Request an invitation"
    />
  );
}
