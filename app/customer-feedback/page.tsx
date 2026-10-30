import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Customer Feedback | Workdane Management Consultancy" };

export default function CustomerFeedback() {
  return (
    <InfoPage
      eyebrow="Customer feedback"
      title={
        <>
          Tell us how we <em className="gold-text italic">can do better.</em>
        </>
      }
      intro="Your feedback helps us improve. Share a compliment, a suggestion or a concern and a manager will read it."
      points={[
        { title: "Every message is read", text: "Feedback goes straight to our management team, not a general inbox." },
        { title: "We reply to concerns", text: "If you raise a problem and leave your details, we will get back to you." },
        { title: "We act on patterns", text: "When several people mention the same thing, we change how we work." },
      ]}
      formTitle="Share your feedback"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "type", label: "Type of feedback", type: "select", options: ["Compliment", "Suggestion", "Complaint"] },
        { name: "message", label: "Your feedback", type: "textarea", required: true },
      ]}
      submitLabel="Send feedback"
    />
  );
}
