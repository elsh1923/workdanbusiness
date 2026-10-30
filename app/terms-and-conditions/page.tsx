import type { Metadata } from "next";
import TextPage from "@/components/TextPage";
import { CONTACT } from "@/lib/config";

export const metadata: Metadata = { title: "Terms and Conditions | Workdane Management Consultancy" };

export default function Terms() {
  return (
    <TextPage
      eyebrow="Terms and conditions"
      title={
        <>
          Terms of <em className="gold-text italic">using this website.</em>
        </>
      }
      intro={`This website is operated by ${CONTACT.legalName}. By using it you agree to the points below.`}
      sections={[
        {
          heading: "Information only",
          body: ["The content on this website is general information. It is not legal, tax or financial advice. Requirements change, so we confirm them for your case in writing."],
        },
        {
          heading: "Fees and estimates",
          body: ["Any figure shown by the cost calculator or elsewhere on the site is indicative. Your final fees are set out in a written quotation, which you approve before we start."],
        },
        {
          heading: "Activities and approvals",
          body: ["The activity list is provided to help you plan. Whether an activity can be licensed, and which approvals it needs, is decided by the licensing authority."],
        },
        {
          heading: "Using the site",
          body: ["Please use the site and its forms honestly and only for lawful purposes. We may change or remove content at any time."],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms can be sent to ${CONTACT.email}.`],
        },
      ]}
    />
  );
}
