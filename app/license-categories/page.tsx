import LinkRows from "@/components/LinkRows";
import PageHero from "@/components/PageHero";
import { licenseItems } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UAE Business Licence Categories: Trading, Professional, IT, E-Commerce | Workdane",
  description: "Compare the six UAE licence categories: general trading, professional services, IT services, e-commerce, administrative and marketing services.",
};

export default function LicenseCategories() {
  return (
    <>
      <PageHero
        eyebrow="License categories"
        title={
          <>
            Choose the category that <em className="gold-text italic">fits your business.</em>
          </>
        }
        intro="Each category lists the activities it covers. Open one to see its activities, indicative fees and any extra approvals."
      />
      <section className="bg-surface px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <LinkRows items={licenseItems} />
        </div>
      </section>
    </>
  );
}
