import type { Metadata } from "next";
import BusinessActivities from "@/components/BusinessActivities";
import PageHero from "@/components/PageHero";
import { ACTIVITY_COUNT } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Business Activities | Workdane Management Consultancy",
  description: "Search over 2,000 licensable business activities, see which need third-party approval and shortlist the ones you are considering.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Business activities"
        title={
          <>
            Find the activity for <em className="gold-text italic">your licence.</em>
          </>
        }
        intro={`Search ${ACTIVITY_COUNT.toLocaleString("en-US")} licensable activities by name, code or authority. Shortlist the ones you are considering and send them to us in one message.`}
        image={{ src: "/activities-hero.webp", alt: "Two business partners shaking hands over a desk of financial documents and calculators", width: 1024, height: 1024 }}
      />
      <BusinessActivities />
    </>
  );
}
