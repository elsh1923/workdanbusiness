import { Suspense } from "react";
import BusinessActivities from "@/components/BusinessActivities";
import { categories } from "@/lib/activities";

async function Directory({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = categories.find((c) => c === category) ?? "All";
  return <BusinessActivities initialCategory={initial} />;
}

export default function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <Suspense fallback={<BusinessActivities />}>
      <Directory searchParams={searchParams} />
    </Suspense>
  );
}
