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
import { licenseCategories } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <Facts />
      <Services />

      <section id="license-categories" className="scroll-mt-24 border-t border-line bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>License categories</Eyebrow>
          <h2 className="font-display text-[40px] font-bold leading-[1.15] text-heading">
            Pick the category that fits. <em className="gold-text italic">We handle the rest.</em>
          </h2>
          <ul className="mt-12 grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16 lg:grid-cols-3">
            {licenseCategories.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.name}>
                  <Link
                    href={`/business-activities?category=${encodeURIComponent(c.name)}`}
                    className="group flex items-center gap-4 border-b border-heading/15 row-wipe py-6 sm:px-2"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy transition duration-500 group-hover:bg-navy group-hover:text-gold-light">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 font-display text-xl font-bold text-heading transition group-hover:text-navy">{c.name}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" />
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
