import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Featured In | Workdane Management Consultancy" };

export default function FeaturedIn() {
  return (
    <InfoPage
      eyebrow="Featured in"
      title={
        <>
          Press and <em className="gold-text italic">client stories.</em>
        </>
      }
      intro="Press mentions and client success stories will appear here as they are published."
      points={[
        { title: "Press mentions", text: "Articles and interviews that feature Workdane will be listed here." },
        { title: "Client stories", text: "With their permission, we will share how founders set up and grew with us." },
        { title: "Media enquiries", text: "Journalists and editors can reach our team using the form." },
      ]}
      formTitle="Share your story or contact the press team"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "type", label: "I would like to", type: "select", options: ["Share my client story", "Make a media enquiry", "Something else"] },
        { name: "message", label: "Message", type: "textarea" },
      ]}
      submitLabel="Send message"
    />
  );
}
