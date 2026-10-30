import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Accordion from "@/components/Accordion";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import { setupSteps } from "@/lib/content";
import { faqGroups } from "@/lib/faqs";

const checklist = [
  { title: "Passport copies", text: "A clear copy of the passport for every owner and for each person who will manage the company." },
  { title: "Visa and Emirates ID copies", text: "For owners who already live in the UAE." },
  { title: "Proof of address", text: "A recent document showing each owner’s home address, such as a utility bill or tenancy contract." },
  { title: "Company documents", text: "If a shareholder is a company, its own registration documents, often attested." },
];

export default function BusinessSetupGuide() {
  return (
    <>
      <PageHero
        eyebrow="Business setup guide"
        title={
          <>
            From idea to a licensed, <em className="gold-text italic">open business.</em>
          </>
        }
        intro="The six stages most businesses go through. Our consultants confirm the exact requirements for your activity."
      />
      <section className="bg-surface px-6 py-28 sm:px-12 lg:px-16">
        <ol className="mx-auto grid max-w-[1320px] border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
          {setupSteps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-9">
              <span className="font-display text-[26px] text-heading/25">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-[21px] font-bold text-heading">{s.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-20 grid max-w-[1320px] gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <Eyebrow>Your document checklist</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Have these ready</h2>
            <ul className="mt-8 space-y-4">
              {checklist.map((c) => (
                <li key={c.title} className="flex gap-3 text-[15px] leading-relaxed">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>
                    <strong className="text-heading">{c.title}.</strong> {c.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Questions about setup</Eyebrow>
            <h2 className="mb-8 font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Common questions</h2>
            <Accordion items={faqGroups[1].items.concat(faqGroups[0].items.slice(1, 2))} />
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-[1320px] flex-wrap gap-8">
          <Link href="/cost-calculator" className="group flex items-center gap-2 font-display text-[18px] font-bold text-heading hover:text-navy">
            Estimate your costs <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" />
          </Link>
          <Link href="/home#contact" className="group flex items-center gap-2 font-display text-[18px] font-bold text-heading hover:text-navy">
            Talk to a consultant <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
