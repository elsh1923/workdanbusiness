import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { setupSteps } from "@/lib/content";

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
        <ol className="mx-auto grid max-w-[1840px] border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
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
        <div className="mx-auto mt-16 flex max-w-[1840px] flex-wrap gap-8">
          <Link href="/cost-calculator" className="group flex items-center gap-2 font-display text-[18px] font-bold text-heading hover:text-navy">
            Estimate your costs <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" />
          </Link>
          <Link href="/#contact" className="group flex items-center gap-2 font-display text-[18px] font-bold text-heading hover:text-navy">
            Talk to a consultant <ArrowRight className="h-5 w-5 text-gold transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
