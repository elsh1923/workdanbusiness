"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageCircle, Plus } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

type Faq = { q: string; a: string; link?: { label: string; href: string } };

const faqs: Faq[] = [
  {
    q: "How long does company setup take?",
    a: "Timelines depend on your activity and the approvals it needs. We confirm your timeline in writing before we start.",
    link: { label: "See the setup steps", href: "/business-setup-guide" },
  },
  {
    q: "Mainland or free zone: which should I choose?",
    a: "It depends on your activity and who you sell to. We compare both options with you during the consultation.",
    link: { label: "Browse licence categories", href: "/license-categories" },
  },
  {
    q: "Can you handle visas for my staff?",
    a: "Yes. We process employment, family and investor visas, and arrange Emirates ID and medical appointments.",
    link: { label: "Explore visa and PRO support", href: "/workdane-plus" },
  },
  {
    q: "What fees should I expect?",
    a: "Government fees and our service fee are shown separately in your written quotation. Fees on this website are indicative only.",
    link: { label: "Estimate your costs", href: "/cost-calculator" },
  },
  {
    q: "Do you help after setup?",
    a: "Yes. We handle licence renewals, VAT returns, bookkeeping and visa renewals so nothing lapses.",
    link: { label: "See Workdane Plus services", href: "/workdane-plus" },
  },
];

function HelpPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-bg grain relative isolate overflow-clip rounded-3xl p-8 text-white ${className}`}>
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
      <span className="gold-gradient flex h-12 w-12 items-center justify-center rounded-xl text-midnight">
        <HelpCircle className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-[21px] font-bold leading-snug">Still have a question?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-white/90">Cannot find your answer? Send us a message and we will reply.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={whatsappLink("Hello Workdane, I have a question about company setup.")}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#0f7d46] px-5 py-3 text-[15px] font-bold text-white transition hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp us
        </a>
        <Link href="/contact" className="gold-gradient btn-shine rounded-full px-5 py-3 text-[15px] font-bold text-midnight">
          Contact us
        </Link>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-tint px-6 py-28 sm:px-12 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">
            Questions, <em className="gold-text italic">answered.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed">
            The things founders ask us most before they start. Tap a question to read the answer.
          </p>
          <HelpPanel className="mt-10 max-w-md max-lg:hidden" />
        </Reveal>

        <div>
          <ul className="space-y-4">
            {faqs.map((f, n) => {
              const isOpen = open === n;
              return (
                <li
                  key={f.q}
                  className={`relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-gold/50 shadow-[0_24px_50px_-30px_rgba(194,133,0,0.6)]"
                      : "border-line hover:border-heading/25 hover:shadow-[0_16px_36px_-28px_rgba(20,63,143,0.5)]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 origin-top bg-gold transition-transform duration-500 ${isOpen ? "scale-y-100" : "scale-y-0"}`}
                  />
                  <h3>
                    <button
                      id={`faq-q-${n}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${n}`}
                      onClick={() => setOpen(isOpen ? null : n)}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left sm:gap-5 sm:px-7 sm:py-6"
                    >
                      <span className={`font-display text-[15px] font-bold transition-colors ${isOpen ? "text-gold" : "text-heading/30"}`}>
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-[18px] font-bold leading-snug text-heading sm:text-[21px]">{f.q}</span>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                          isOpen ? "rotate-45 border-gold bg-gold text-midnight" : "border-heading/25 text-heading"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${n}`}
                    role="region"
                    aria-labelledby={`faq-q-${n}`}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 sm:pl-[4.75rem] sm:pr-7">
                        <p className="max-w-2xl text-[15px] leading-relaxed">{f.a}</p>
                        {f.link && (
                          <Link href={f.link.href} className="group mt-4 inline-flex items-center gap-2 text-[15px] font-bold text-navy">
                            <span className="underline decoration-gold decoration-2 underline-offset-4">{f.link.label}</span>
                            <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <HelpPanel className="mt-8 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
