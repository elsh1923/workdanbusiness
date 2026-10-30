import type { Metadata } from "next";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact | Workdane Management Consultancy",
  description: "Talk to Workdane about company setup, licensing, visas and accounting in the UAE.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to <em className="gold-text italic">our team.</em>
          </>
        }
        intro="Send us your plans and we will reply with the right structure, the approvals involved and a written quotation."
      />
      <Contact />
    </>
  );
}
