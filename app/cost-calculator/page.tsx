import type { Metadata } from "next";
import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cost Calculator | Workdane Management Consultancy",
  description: "Build an indicative estimate for your UAE company setup: activities, licence length, visas and extra services.",
};

const included = [
  { title: "Always included", items: ["Your licence for the term you choose", "Company registration documents", "Every activity in your largest activity groups", "Digital copies of your company documents"] },
  { title: "Optional services", items: ["Residence visas", "Bank account assistance", "Corporate tax and VAT registration", "Company stamp", "Virtual receptionist"] },
  { title: "Only in some cases", items: ["Change of status, if you are already in the UAE", "Approval fees for regulated activities", "Document attestation and translation", "Office and facility requests"] },
];

const next = [
  { title: "Review your breakdown", text: "Your estimate updates as you choose. Try different options until the structure fits." },
  { title: "Eligibility check", text: "An adviser confirms your activities, owners and requirements before issuing a final quotation." },
  { title: "Approve and pay", text: "Pay only after you have agreed the written quotation." },
  { title: "Visa and bank account", text: "We then take you through visas and bank account opening." },
];

export default function CostCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Cost calculator"
        title={
          <>
            Estimate your setup <em className="gold-text italic">costs.</em>
          </>
        }
        intro="Choose your activities, licence length, visas and extras and watch your estimate update. Free to use, with no obligation."
      />
      <div className="pt-16">
        <CostCalculator />
      </div>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>What is in your estimate</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Everything the licence covers, and what is added on top</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {included.map((g) => (
              <div key={g.title} className="rounded-2xl border border-line bg-tint p-7">
                <h3 className="font-display text-[19px] font-bold text-heading">{g.title}</h3>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                  {g.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>After your estimate</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">What happens next</h2>
          <ol className="mt-10 grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
            {next.map((n, i) => (
              <li key={n.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-7">
                <span className="font-display text-[24px] text-heading/25">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[19px] font-bold text-heading">{n.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{n.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[15px]">
            Questions? Read the{" "}
            <Link href="/business-setup-guide" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
              business setup guide
            </Link>{" "}
            or <Link href="/faqs" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">browse the FAQs</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
