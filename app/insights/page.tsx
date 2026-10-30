import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import Eyebrow from "@/components/Eyebrow";
import FAQ from "@/components/FAQ";
import PageHero from "@/components/PageHero";

const subscribe = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
];

export default function Insights() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Plan with <em className="gold-text italic">confidence.</em>
          </>
        }
        intro="Guides, news, events and answers to the questions we hear most."
      />

      <section id="blogs" className="scroll-mt-28 bg-white px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Blogs</Eyebrow>
            <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Practical guides, written for founders.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed">
              Setup, visas, VAT and running a business in the UAE. Our first articles are being prepared. Leave your details and we will let you know when they are published.
            </p>
          </div>
          <EnquiryForm fields={subscribe} submitLabel="Notify me when articles are published" />
        </div>
      </section>

      <section id="featured" className="scroll-mt-28 border-t border-heading/15 bg-surface px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1840px]">
          <Eyebrow>Featured in</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Press and client stories.</h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed">
            Press mentions and client success stories will appear here as they are published.
          </p>
          <Link href="/#contact" className="mt-8 inline-block text-[15px] font-bold text-navy underline decoration-gold decoration-2 underline-offset-8">
            Share your story with us
          </Link>
        </div>
      </section>

      <section id="activity-hub" className="scroll-mt-28 border-t border-line bg-white px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1840px]">
          <Eyebrow>Activity hub</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Events, workshops and networking.</h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed">
            No sessions are scheduled yet. Ask us to invite you and we will send details as soon as there is something to attend.
          </p>
          <Link href="/#contact" className="mt-8 inline-block text-[15px] font-bold text-navy underline decoration-gold decoration-2 underline-offset-8">
            Request an invitation
          </Link>
        </div>
      </section>

      <div id="faqs" className="scroll-mt-28">
        <FAQ />
      </div>
    </>
  );
}
