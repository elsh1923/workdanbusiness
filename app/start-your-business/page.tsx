import LinkRows from "@/components/LinkRows";
import PageHero from "@/components/PageHero";
import { startItems } from "@/lib/content";

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
      />
      <section className="bg-surface px-5 pb-28 pt-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <LinkRows items={startItems} />
        </div>
      </section>
    </>
  );
}
