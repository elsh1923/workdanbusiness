import type { Metadata } from "next";
import Accordion from "@/components/Accordion";
import Eyebrow from "@/components/Eyebrow";
import NameCheck from "@/components/NameCheck";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Company Name Check | Workdane Management Consultancy",
  description: "Check your preferred company name and request availability confirmation for your UAE licence.",
};

const steps = [
  { title: "Submit your chosen name", text: "Enter the name you want to register, with a few details so we can reach you." },
  { title: "Get an instant result", text: "We check the format and restricted words straight away, so you can adjust before going further." },
  { title: "We confirm availability", text: "Our team checks the name with the authority and tells you whether you can reserve it." },
];

const faqs = [
  { q: "What is an establishment card and why do I need it?", a: "The establishment card is your company’s official identity with the immigration authority. It is needed to sponsor employee visas and is often asked for when connecting an office to utilities." },
  { q: "Which documents do I need to register a company?", a: "Usually passport copies for each owner, proof of address and your chosen activities and trade name. We send you the exact list for your structure after the first call." },
  { q: "How long does a licence take?", a: "It depends on your activity and whether it needs another authority’s approval. We confirm the expected timing in writing before you start." },
  { q: "Can I get UAE residency through my company?", a: "Yes. Once the licence and establishment card are in place, owners and employees can apply for residence visas. We guide you through each step." },
  { q: "What if my name is not available?", a: "We suggest alternatives close to your first choice and check them with you, so you do not have to start again." },
];

export default function NameCheckPage() {
  return (
    <>
      <PageHero
        eyebrow="Name check"
        title={
          <>
            Check your company <em className="gold-text italic">name.</em>
          </>
        }
        intro="A great name starts a business well. Make sure yours is unique, suitable and ready to register."
      />

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Company name check</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Share your preferred name</h2>
            <ul className="mt-8 space-y-5 text-[15px] leading-relaxed">
              <li>
                <strong className="text-heading">Free to submit.</strong> There is no service charge for a name check request.
              </li>
              <li>
                <strong className="text-heading">Instant response.</strong> See at once whether the name passes our first check.
              </li>
              <li>
                <strong className="text-heading">A path to reservation.</strong> We then work towards your name reservation.
              </li>
            </ul>
          </div>
          <div className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-12">
            <NameCheck />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">From a proposed name to the next registration step</h2>
          <ol className="mt-10 grid border-t border-heading/15 md:grid-cols-3 md:gap-x-12">
            {steps.map((s, i) => (
              <li key={s.title} className="border-b border-heading/15 py-8">
                <span className="font-display text-[24px] text-heading/25">0{i + 1}</span>
                <h3 className="mt-3 font-display text-[19px] font-bold text-heading">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="mb-8 font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Frequently asked questions</h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}
