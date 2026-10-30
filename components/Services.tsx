"use client";

import Image from "next/image";
import { services } from "@/lib/services";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

const ticker = ["Company formation", "Licensing", "Visas & PRO", "VAT", "Accounting", "Banking", "Renewals", "Amendments"];

export default function Services() {
  return (
    <>
      <div className="overflow-hidden border-y border-heading/10 bg-white py-6" aria-hidden>
        <div className="marquee flex w-max whitespace-nowrap">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="pr-12 font-display text-[26px] italic text-heading/30">
              {t} <span className="not-italic text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="services" className="scroll-mt-24 bg-surface px-6 py-28 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[5fr_7fr] lg:gap-24">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">
              Everything your business needs, <em className="gold-text italic">in one place.</em>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed">
              You get one team and one point of contact, from the first licence application to the renewal reminder that comes after.
            </p>
            <div className="relative mt-10 max-w-md">
              <div aria-hidden className="absolute -bottom-3 -left-3 h-full w-full rounded-2xl border-2 border-gold/60" />
              <Image
                src="/handshake.png"
                alt="Two business partners shaking hands after agreeing a deal"
                width={736}
                height={412}
                className="relative aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>
          </Reveal>

          <ol className="border-t border-heading/15">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="group relative grid grid-cols-[3rem_1fr] gap-4 overflow-hidden border-b border-heading/15 py-9 pl-1 row-wipe sm:grid-cols-[4.5rem_1fr]">
                  <span className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-gold transition-transform duration-500 group-hover:scale-y-100" />
                  <span className="pointer-events-none absolute -right-2 -top-4 font-display text-[120px] font-extrabold leading-none text-heading/[0.04] transition-colors duration-500 group-hover:text-gold/15">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[21px] text-heading/25 transition-colors duration-300 group-hover:text-gold">0{i + 1}</span>
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy transition duration-500 group-hover:rotate-[-14deg] group-hover:scale-110 group-hover:bg-navy group-hover:text-gold-light">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-[21px] font-bold text-heading transition-transform duration-500 group-hover:translate-x-3 sm:text-[26px]">{s.title}</h3>
                    </div>
                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed">{s.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-bold uppercase tracking-widest text-bronze">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
