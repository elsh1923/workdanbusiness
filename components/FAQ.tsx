"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

const faqs = [
  [
    "How long does company setup take?",
    "Timelines depend on your activity and the approvals it needs. We confirm your timeline in writing before we start.",
  ],
  [
    "Mainland or free zone: which should I choose?",
    "It depends on your activity and who you sell to. We compare both options with you during the consultation.",
  ],
  [
    "Can you handle visas for my staff?",
    "Yes. We process employment, family and investor visas, and arrange Emirates ID and medical appointments.",
  ],
  [
    "What fees should I expect?",
    "Government fees and our service fee are shown separately in your written quotation. Fees on this website are indicative only.",
  ],
  [
    "Do you help after setup?",
    "Yes. We handle licence renewals, VAT returns, bookkeeping and visa renewals so nothing lapses.",
  ],
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-surface px-5 py-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <Reveal>
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="font-display text-[40px] font-bold leading-[1.05] text-heading sm:text-[44px]">
            Questions, <em className="gold-text italic">answered.</em>
          </h2>
          <p className="mt-6 max-w-sm text-[16px] leading-relaxed">Cannot find your answer? Send us a message and we will reply.</p>
        </Reveal>

        <div className="border-t border-heading/15">
          {faqs.map(([q, a], n) => (
            <div key={q} className="border-b border-heading/15">
              <button
                onClick={() => setOpen(open === n ? null : n)}
                aria-expanded={open === n}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-xl font-bold text-heading sm:text-2xl">{q}</span>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-heading/25 transition duration-300 ${
                    open === n ? "rotate-45 border-gold bg-gold text-midnight" : "text-heading"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ${open === n ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden pr-16 text-[16px] leading-relaxed">
                  <span className="block pb-6">{a}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
