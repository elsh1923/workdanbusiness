import Link from "next/link";
import { Check, Plus, TriangleAlert } from "lucide-react";
import { calc, employeeVisaTotal, investorVisaTotal } from "@/lib/calculator-config";
import Eyebrow from "./Eyebrow";

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

const always = ["Trade licence for the term you choose", "Memorandum of association (MOA)", "Certificate of formation", "Personal bank account assistance, free of charge"];

const optional = [
  { label: "Residence visa for yourself", price: `From ${aed(investorVisaTotal)}` },
  { label: "Corporate bank account assistance", price: aed(calc.extras.bank) },
  { label: "Corporate tax registration and filing", price: aed(calc.extras.taxPackage) },
  { label: "VAT registration", price: aed(calc.extras.vat) },
  { label: "Company stamp", price: aed(calc.extras.stamp) },
  { label: "Virtual receptionist", price: `${aed(calc.extras.receptionistPerYear)} per year` },
];

const maybe = [
  { label: "Change of status", price: aed(calc.visa.changeOfStatus) },
  { label: "Regulated activity approval fees", price: "Varies by activity" },
  { label: "Employment visas", price: `From ${aed(employeeVisaTotal)}` },
  { label: "Office and facility management requests", price: "Priced on request" },
  { label: "Document attestation and translations", price: "Priced on request" },
  { label: "Health insurance", price: "Not included" },
];

const after = [
  { when: "Straight away", title: "Review your breakdown", text: "Your estimate updates as you choose. Experiment until you find the company structure that suits you." },
  { when: "Next", title: "Eligibility check", text: "One of our advisers confirms your details, activities and requirements before issuing a final quotation." },
  { when: "When you agree", title: "Pay and get your licence", text: "Once you approve the written quotation and pay, we submit your application and follow it through." },
  { when: "After your licence", title: "Visa and bank account", text: "We then take you through residence visas and opening a bank account. These are separate services." },
];

export default function CalcExtras() {
  return (
    <>
      <section className="bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>What is included</Eyebrow>
              <h2 className="max-w-xl font-display text-[30px] font-bold leading-tight text-heading sm:text-[36px]">What’s included in your business setup estimate?</h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed">Everything the licence covers, everything you choose to add, and the charges that only apply in certain cases.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="overflow-hidden rounded-2xl border border-line border-t-4 border-t-[#0f7d46] bg-white p-7">
              <header className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f7d46]/10 text-[#0f7d46]">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="flex-1 font-display text-[21px] font-bold text-heading">Always included</h3>
                <span className="rounded-full bg-[#0f7d46]/10 px-3 py-1 text-[12px] font-extrabold uppercase tracking-wider text-[#0f7d46]">Included</span>
              </header>
              <p className="mt-4 text-[15px] leading-relaxed">Your licence cost covers the following documents, services and benefits.</p>
              <ul className="mt-5 divide-y divide-line border-t border-line">
                {always.map((i) => (
                  <li key={i} className="flex items-center gap-3 py-4 text-[15px]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0f7d46]/10 text-[#0f7d46]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </article>

            <article className="overflow-hidden rounded-2xl border border-line border-t-4 border-t-navy bg-navy/[0.03] p-7">
              <header className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
                  <Plus className="h-5 w-5" />
                </span>
                <h3 className="flex-1 font-display text-[21px] font-bold text-heading">Value-added services</h3>
                <span className="rounded-full bg-navy/10 px-3 py-1 text-[12px] font-extrabold uppercase tracking-wider text-navy">Optional</span>
              </header>
              <p className="mt-4 text-[15px] leading-relaxed">Pay only for what you need. Add or remove these services even after your licence is issued.</p>
              <ul className="mt-5 divide-y divide-line border-t border-line">
                {optional.map((i) => (
                  <li key={i.label} className="flex items-start justify-between gap-4 py-4 text-[15px]">
                    <span className="flex gap-3">
                      <Plus className="mt-1 h-4 w-4 shrink-0 text-navy" />
                      {i.label}
                    </span>
                    <span className="shrink-0 font-bold text-heading">{i.price}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="overflow-hidden rounded-2xl border border-dashed border-line border-t-4 border-t-gold bg-white p-7">
              <header className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-bronze">
                  <TriangleAlert className="h-5 w-5" />
                </span>
                <h3 className="flex-1 font-display text-[21px] font-bold leading-tight text-heading">Circumstantial expenses</h3>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[12px] font-extrabold uppercase tracking-wider text-bronze">May apply</span>
              </header>
              <p className="mt-4 text-[15px] leading-relaxed">These charges only apply in specific situations.</p>
              <ul className="mt-5 divide-y divide-line border-t border-line">
                {maybe.map((i) => (
                  <li key={i.label} className="flex items-start justify-between gap-4 py-4 text-[15px]">
                    <span className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      {i.label}
                    </span>
                    <span className="shrink-0 text-right font-bold text-heading">{i.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="max-w-lg font-display text-[30px] font-bold leading-tight text-heading sm:text-[36px]">What happens after you get your estimate?</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed">You do not need to pay anything until you have spoken with an adviser and confirmed your activities with them.</p>

          <ol className="relative mt-14 grid gap-12 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-navy md:block" />
            {after.map((a, i) => (
              <li key={a.title} className="relative text-center">
                <span className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[18px] font-bold text-white ${i === 0 ? "ring-[10px] ring-navy/10" : ""}`}>{i + 1}</span>
                <p className="mt-5 text-[12px] font-extrabold uppercase tracking-widest text-navy">{a.when}</p>
                <h3 className="mt-2 font-display text-[19px] font-bold leading-snug text-heading">{a.title}</h3>
                <p className="mx-auto mt-3 max-w-[18rem] text-[15px] leading-relaxed">{a.text}</p>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-12 max-w-2xl text-center text-[13px] leading-relaxed text-body">
            The residence visa package and bank account assistance are separate services and are charged separately. Timing depends on approvals and on your documents being complete.
          </p>
          <p className="mt-6 text-center text-[16px]">
            Have questions? Check our{" "}
            <Link href="/business-setup-guide" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
              step-by-step business setup guide
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
