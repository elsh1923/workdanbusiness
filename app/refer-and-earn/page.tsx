import InfoPage from "@/components/InfoPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer and Earn | Workdane Management Consultancy",
  description: "Introduce a business to Workdane and share the reward when they set up a company in the UAE.",
};

export default function ReferAndEarn() {
  return (
    <InfoPage
      eyebrow="Refer and earn"
      title={
        <>
          Introduce a business. <em className="gold-text italic">Share the reward.</em>
        </>
      }
      intro="Know a founder who is setting up? Refer them to us and receive a reward once their setup is confirmed."
      points={[
        { title: "Send us a referral", text: "Fill in the form with the business you are referring and how to reach them." },
        { title: "We contact them", text: "Our team reaches out to your referral. We never share your details beyond what they agree to." },
        { title: "Receive your reward", text: "Once their setup is confirmed, we confirm your reward in writing and arrange payment." },
      ]}
      formTitle="Submit a referral"
      fields={[
        { name: "yourName", label: "Your name", required: true },
        { name: "yourEmail", label: "Your email", type: "email", required: true },
        { name: "referredBusiness", label: "Business you are referring", required: true },
        { name: "referredContact", label: "Their name and phone or email", required: true },
        { name: "message", label: "Anything we should know (optional)", type: "textarea" },
      ]}
      submitLabel="Submit referral"
      note="Reward amount and terms are confirmed in writing before any payment."
    />
  );
}
