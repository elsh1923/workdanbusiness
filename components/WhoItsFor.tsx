"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Eyebrow from "./Eyebrow";

const cards = [
  { title: "First-time founders", text: "You have an idea and a budget but no licence yet. Start small and add services as you grow.", img: "/team-meeting.png", w: 560, h: 418, alt: "A team meeting around a table" },
  { title: "Freelancers going official", text: "Moving from client invoices to a company? See what a licence and a visa cost before you commit.", img: "/handshake.png", w: 736, h: 412, alt: "Two people shaking hands" },
  { title: "Growing teams", text: "Visa quotas and workspace needs grow with headcount. Know the cost for each new hire up front.", img: "/office-presentation.webp", w: 736, h: 736, alt: "A team reviewing charts" },
  { title: "Relocating companies", text: "Change-of-status costs and visa needs add up when a team moves. See the cost per person before you pay.", img: "/dubai-team.png", w: 736, h: 414, alt: "Advisers reviewing data over a city view" },
  { title: "Existing companies expanding to the UAE", text: "Adding a UAE entity to international branches? Compare a licence-only presence with a fully staffed office.", img: "/process-plan.png", w: 736, h: 410, alt: "Two people planning on a printed chart" },
];

export default function WhoItsFor() {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const total = cards.length + 1;

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + 24;
    const index = Math.round(el.scrollLeft / step) + dir;
    el.scrollTo({ left: Math.max(0, Math.min(el.scrollWidth - el.clientWidth, index * step)), behavior: "smooth" });
  };

  return (
    <section className="bg-white px-6 py-24 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Who is it for?</Eyebrow>
            <h2 className="font-display text-[30px] font-bold leading-tight text-heading sm:text-[36px]">For founders who plan ahead</h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed">Our cost calculator gives entrepreneurs a clear estimate of their costs before they decide to commit.</p>
        </div>

        <ul
          ref={ref}
          onScroll={(e) => {
            const el = e.currentTarget;
            const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
            setActive(Math.round(el.scrollLeft / (w + 24)));
          }}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((c, i) => (
            <li key={c.title} className="w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-white sm:w-[340px]">
              <Image src={c.img} alt={c.alt} width={c.w} height={c.h} className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <p className="text-[13px] font-extrabold tracking-widest text-navy">0{i + 1}</p>
                <h3 className="mt-2 font-display text-[20px] font-bold leading-snug text-heading">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed">{c.text}</p>
              </div>
            </li>
          ))}
          <li className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-2xl bg-gradient-to-br from-[#022364] to-[#073eab] p-7 text-white sm:w-[340px]">
            <div>
              <span className="block h-1 w-10 rounded bg-gold-light" />
              <h3 className="mt-5 font-display text-[20px] font-bold">Not sure about your category?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/85">Add your selections and one of our advisers can help you find the right structure for your goals and budget.</p>
            </div>
            <Link href="#calculator" className="mt-8 inline-block self-start rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-navy transition hover:bg-gold-light">
              Estimate my costs!
            </Link>
          </li>
        </ul>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" aria-label="Previous" onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition hover:border-navy">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2" aria-hidden>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-navy" : "w-2 bg-navy/25"}`} />
            ))}
          </div>
          <button type="button" aria-label="Next" onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-heading transition hover:border-navy">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
