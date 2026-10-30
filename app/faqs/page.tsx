import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import FaqSearch from "@/components/FaqSearch";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "FAQs | Workdane Management Consultancy",
  description: "Answers to common questions about UAE company setup, licences, visas, costs, banking and renewals.",
};

export default function Faqs() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title={
          <>
            How can we <em className="gold-text italic">help?</em>
          </>
        }
        intro="Quick answers to the questions we hear most about licences, visas, costs and banking."
      />
      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <FaqSearch />
      </section>
      <CtaBand />
    </>
  );
}
