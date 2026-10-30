import type { Metadata } from "next";
import TextPage from "@/components/TextPage";
import { CONTACT } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy | Workdane Management Consultancy" };

export default function PrivacyPolicy() {
  return (
    <TextPage
      eyebrow="Privacy policy"
      title={
        <>
          How we handle <em className="gold-text italic">your information.</em>
        </>
      }
      intro="This page explains what we collect when you use this website or contact us, and what we do with it."
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you fill in a form we receive the details you type, such as your name, email address, phone number and message. If you save activities to a shortlist, that list is stored in your own browser and is only sent to us if you choose to send it.",
          ],
        },
        {
          heading: "How we use it",
          body: ["We use your details to reply to your enquiry, prepare quotations and provide the services you ask for. We do not sell your information."],
        },
        {
          heading: "Who sees it",
          body: ["Your enquiry is received by our team by email. Where a service needs it, for example a licence application, we share only what is needed with the relevant authority or provider, with your knowledge."],
        },
        {
          heading: "Keeping it",
          body: ["We keep enquiry details for as long as needed to deal with your request and meet our legal obligations."],
        },
        {
          heading: "Your choices",
          body: [`You can ask us to correct or delete the details we hold about you by writing to ${CONTACT.email}.`],
        },
      ]}
    />
  );
}
