import Link from "next/link";
import { ArrowDown, Lock } from "lucide-react";
import { calc } from "@/lib/calculator-config";
import { ACTIVITY_COUNT } from "@/lib/activities";
import Skyline from "./Skyline";

const minLicence = Math.min(...Object.values(calc.licence));

export default function CalcHero() {
  return (
    <section className="hero-bg grain relative isolate overflow-clip px-6 pb-28 pt-32 text-white sm:px-12 sm:pt-40 lg:px-16">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="drift pointer-events-none absolute -right-20 top-24 -z-10 h-[340px] w-[340px] rounded-full bg-gold/15 blur-3xl" />
      <Skyline className="parallax-b pointer-events-none absolute bottom-0 left-[-4rem] -z-10 h-[150px] w-[calc(100%+8rem)] opacity-50" />
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <nav aria-label="Breadcrumb" className="rise mb-10 flex items-center gap-2 text-[15px] text-white/80">
            <Link href="/home" className="transition hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-white">Cost calculator</span>
          </nav>
          <h1 className="rise max-w-3xl font-display text-[34px] font-bold leading-[1.2] sm:text-[48px]">
            Calculate your business setup cost <em className="gold-text italic">in real time.</em>
          </h1>
          <p className="rise mt-6 max-w-xl text-[18px] leading-relaxed text-white/90" style={{ animationDelay: "0.15s" }}>
            Select your business activities, then add the number of visas you need along with any value-added services.
          </p>
          <dl className="rise mt-10 flex flex-wrap gap-x-10 gap-y-6" style={{ animationDelay: "0.25s" }}>
            <div>
              <dt className="sr-only">Activities</dt>
              <dd className="font-display text-[30px] font-bold leading-none">{ACTIVITY_COUNT.toLocaleString("en-US")}</dd>
              <p className="mt-1 text-[14px] text-white/80">Activities</p>
            </div>
            <div className="border-l border-white/20 pl-10">
              <dd className="font-display text-[30px] font-bold leading-none">1 to 10</dd>
              <p className="mt-1 text-[14px] text-white/80">Year licences</p>
            </div>
            <div className="border-l border-white/20 pl-10">
              <dd className="font-display text-[30px] font-bold leading-none">6</dd>
              <p className="mt-1 text-[14px] text-white/80">Licence categories</p>
            </div>
          </dl>
          <a
            href="#calculator"
            className="gold-gradient btn-shine rise mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold text-midnight"
            style={{ animationDelay: "0.3s" }}
          >
            Calculate my costs <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <div className="rise rounded-3xl bg-white p-7 text-heading shadow-2xl max-lg:hidden" style={{ animationDelay: "0.2s" }} aria-hidden>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze">Your business setup cost</p>
            <span className="flex items-center gap-1.5 rounded-full bg-navy/10 px-3 py-1 text-[12px] font-bold text-navy">
              <Lock className="h-3 w-3" /> Locked
            </span>
          </div>
          <dl className="mt-6 space-y-4 text-[15px]">
            <div className="flex justify-between"><dt>Business licence</dt><dd className="font-bold">From AED {minLicence.toLocaleString("en-US")}</dd></div>
            <div className="flex justify-between"><dt>Visa fees</dt><dd className="select-none text-body blur-sm">AED 0,000</dd></div>
            <div className="flex justify-between"><dt>Value-added services</dt><dd className="select-none text-body blur-sm">AED 0,000</dd></div>
          </dl>
          <div className="mt-5 flex justify-between border-t border-line pt-4 font-display text-[19px] font-bold">
            <span>Estimated total</span>
            <span className="select-none blur-sm">AED 00,000</span>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-navy/5 px-4 py-3.5 text-[14px] font-bold text-navy">
            Share your details to unlock the full quote!
            <ArrowDown className="h-4 w-4 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
