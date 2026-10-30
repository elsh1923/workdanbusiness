import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Facts from "@/components/Facts";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Process from "@/components/Process";
import CtaBand from "@/components/CtaBand";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Eyebrow from "@/components/Eyebrow";
import { licenseCategories, plusServices } from "@/lib/content";
import { categorySlug } from "@/lib/service-pages";

export default function Home() {
  return (
    <>
      <Hero />
      <Facts />
      <Services />

      <section id="license-categories" className="scroll-mt-24 border-t border-line bg-white px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>License categories</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">
            Pick the category that fits. <em className="gold-text italic">We handle the rest.</em>
          </h2>
          <ul className="mt-12 grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16 lg:grid-cols-3">
            {licenseCategories.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.name}>
                  <Link
                    href={`/license-categories/${categorySlug(c.name)}`}
                    className="group flex items-center gap-4 border-b border-heading/15 row-wipe py-6 sm:px-2"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy transition duration-500 group-hover:bg-navy group-hover:text-gold-light">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 font-display text-[18px] font-bold text-heading transition group-hover:text-navy">{c.name}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="workdane-plus" className="scroll-mt-24 border-t border-line bg-surface px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>Workdane Plus</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">
            Support that goes <em className="gold-text italic">beyond the licence.</em>
          </h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plusServices.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <Link
                    href={`/workdane-plus/${s.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition hover:border-gold hover:shadow-[0_24px_50px_-30px_rgba(7,57,157,0.5)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy transition group-hover:bg-navy group-hover:text-gold-light">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="mt-5 font-display text-[19px] font-bold text-heading">{s.title}</span>
                    <span className="mt-2 flex-1 text-[15px] leading-relaxed">{s.text}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold text-navy">
                      Learn more <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Why />
      <Process />
      <CtaBand />
      <FAQ />
      <Contact />
    </>
  );
}
