import LinkRows from "@/components/LinkRows";
import PageHero from "@/components/PageHero";
import { licenseItems } from "@/lib/content";

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
      <section className="bg-surface px-5 pb-28 pt-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <LinkRows items={licenseItems} />
        </div>
      </section>
    </>
  );
}
