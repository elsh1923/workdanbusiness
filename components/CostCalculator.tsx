"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { categories, type Category } from "@/lib/activities";
import { INDICATIVE_NOTE } from "@/lib/config";
import { calculatorRates } from "@/lib/content";

const MAX_VISAS = 10;
const fmt = (n: number) => n.toLocaleString("en-US");
const stepLabel = "mb-5 text-[13px] font-extrabold uppercase tracking-[0.25em] text-bronze";
const choice = "flex w-full items-center justify-between gap-4 border-b border-heading/15 py-4 text-left text-[15px] transition";

export default function CostCalculator() {
  const [category, setCategory] = useState<Category>("General Trading");
  const [visas, setVisas] = useState(0);
  const [bank, setBank] = useState(false);
  const [vat, setVat] = useState(false);

  const lines = [
    { label: `${category} licence`, amount: calculatorRates.base[category] },
    ...(visas > 0 ? [{ label: `${visas} ${visas === 1 ? "visa" : "visas"}`, amount: visas * calculatorRates.visa }] : []),
    ...(bank ? [{ label: "Bank account introduction", amount: calculatorRates.bankIntro }] : []),
    ...(vat ? [{ label: "VAT registration", amount: calculatorRates.vatRegistration }] : []),
  ];
  const total = lines.reduce((s, l) => s + l.amount, 0);

  return (
    <section className="bg-surface px-6 pb-28 sm:px-12 lg:px-16">
      <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <div className="space-y-16">
          <div>
            <p className={stepLabel}>1. Licence category</p>
            <div className="grid gap-x-10 sm:grid-cols-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`${choice} ${category === c ? "font-bold text-navy" : "text-heading hover:text-navy"}`}
                >
                  <span>{c}</span>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full border ${category === c ? "border-gold bg-gold" : "border-heading/30"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={stepLabel}>2. Visas for your team</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Remove a visa"
                onClick={() => setVisas((v) => Math.max(0, v - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-heading/25 text-heading transition hover:border-navy"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span aria-live="polite" className="w-12 text-center font-display text-[34px] font-bold text-heading">
                {visas}
              </span>
              <button
                type="button"
                aria-label="Add a visa"
                onClick={() => setVisas((v) => Math.min(MAX_VISAS, v + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-heading/25 text-heading transition hover:border-navy"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <p className={stepLabel}>3. Extras</p>
            <div className="grid gap-x-10 sm:grid-cols-2">
              <button type="button" aria-pressed={bank} onClick={() => setBank((b) => !b)} className={`${choice} ${bank ? "font-bold text-navy" : "text-heading hover:text-navy"}`}>
                <span>Bank account introduction</span>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full border ${bank ? "border-gold bg-gold" : "border-heading/30"}`} />
              </button>
              <button type="button" aria-pressed={vat} onClick={() => setVat((v) => !v)} className={`${choice} ${vat ? "font-bold text-navy" : "text-heading hover:text-navy"}`}>
                <span>VAT registration</span>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full border ${vat ? "border-gold bg-gold" : "border-heading/30"}`} />
              </button>
            </div>
          </div>
        </div>

        <aside className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-10 lg:sticky lg:top-32 lg:self-start">
          <p className={stepLabel}>Estimated total</p>
          <p className="font-display text-[34px] font-bold text-navy">AED {fmt(total)}</p>
          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-[15px]">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-4">
                <span>{l.label}</span>
                <span className="font-bold text-heading">AED {fmt(l.amount)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[13px] leading-relaxed text-body">{INDICATIVE_NOTE}</p>
          <a
            href="/#contact"
            className="gold-gradient btn-shine mt-8 block rounded-full py-4 text-center text-[15px] font-bold text-midnight transition hover:brightness-105"
          >
            Get a written quote
          </a>
        </aside>
      </div>
    </section>
  );
}
