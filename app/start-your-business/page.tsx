import LinkRows from "@/components/LinkRows";
import PageHero from "@/components/PageHero";
import { startItems } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Your Business in the UAE | Company Setup | Workdane",
  description: "Everything you need to start a company in the UAE: choose your activities, estimate costs, check your trade name and follow the setup steps with Workdane.",
};

export default function StartYourBusiness() {
  return (
    <>
      <PageHero
        eyebrow="Start your business"
        title={
          <>
            Everything you need to <em className="gold-text italic">start in the UAE.</em>
          </>
        }
        intro="Choose a starting point. Each one opens a dedicated page with the detail and the next step."
        image={{ src: "/office-presentation.webp", alt: "A team reviewing charts around a meeting table", width: 736, height: 736 }}
      />
      <section className="bg-surface px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <LinkRows items={startItems} />
        </div>
      </section>
    </>
  );
}
