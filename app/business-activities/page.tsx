import { Suspense } from "react";
import type { Metadata } from "next";
import BusinessActivities from "@/components/BusinessActivities";
import PageHero from "@/components/PageHero";
import { activities, categories } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Business Activities | Workdane Management Consultancy",
  description: "Search licensable business activities, see indicative fees and shortlist the ones you are considering.",
};

async function Directory({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = categories.find((c) => c === category) ?? "All";
  return <BusinessActivities initialCategory={initial} />;
}

export default function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Business activities"
        title={
          <>
            Find the activity for <em className="gold-text italic">your licence.</em>
          </>
        }
        intro={`Search ${activities.length} licensable activities. Shortlist the ones you are considering and send them to us in one message.`}
      />
      <Suspense fallback={<BusinessActivities />}>
        <Directory searchParams={searchParams} />
      </Suspense>
    </>
  );
}
