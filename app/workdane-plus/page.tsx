import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { plusServices } from "@/lib/content";

export default function WorkdanePlus() {
  return (
    <>
      <PageHero
        eyebrow="Workdane Plus"
        title={
          <>
            Support that continues <em className="gold-text italic">after setup.</em>
          </>
        }
        intro="Banking, visas, medical screening, documentation and a dedicated account manager, all arranged through one team."
      />
      <section className="bg-surface px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-x-16 md:grid-cols-2">
          {plusServices.map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.id} id={s.id} className="scroll-mt-28 border-t border-heading/15 py-10">
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-[26px] font-bold text-heading">{s.title}</h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed">{s.text}</p>
                <Link href="/#contact" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-navy">
                  Ask about this service
                  <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-12 max-w-[1320px] text-[13px] leading-relaxed text-body">
          Availability and terms for each service are confirmed by our team for your business.
        </p>
      </section>
    </>
  );
}
