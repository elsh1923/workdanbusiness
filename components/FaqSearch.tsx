"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { faqGroups } from "@/lib/faqs";
import Accordion from "./Accordion";

export default function FaqSearch() {
  const [query, setQuery] = useState("");
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const groups = faqGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => words.every((w) => `${i.q} ${i.a}`.toLowerCase().includes(w))) }))
    .filter((g) => g.items.length);

  return (
    <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_2.4fr] lg:gap-20">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the FAQs"
            placeholder="Search the FAQs"
            className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-5 text-[16px] outline-none focus:border-gold"
          />
        </div>
        <nav aria-label="FAQ topics" className="mt-8 hidden lg:block">
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.25em] text-bronze">Topics</p>
          <ul className="space-y-2 text-[15px]">
            {faqGroups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="text-heading transition hover:text-navy">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="space-y-14" aria-live="polite">
        {groups.length === 0 && <p className="text-[15px]">No questions match “{query}”. Try fewer words, or ask us directly.</p>}
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-28">
            <h2 className="mb-6 font-display text-[26px] font-bold text-heading">{g.title}</h2>
            <Accordion items={g.items} />
          </section>
        ))}
      </div>
    </div>
  );
}
