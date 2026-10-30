"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, MessageCircle, Plus, Search, X } from "lucide-react";
import { activities, categories, type Activity } from "@/lib/activities";
import { INDICATIVE_NOTE, whatsappLink } from "@/lib/config";

type Sort = "name" | "low" | "high";

const fmt = (n: number) => n.toLocaleString("en-US");
const tabs = ["All", ...categories];

export default function BusinessActivities({ initialCategory = "All" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>("name");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [viewing, setViewing] = useState<Activity | null>(null);
  const [showList, setShowList] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities
      .filter((a) => category === "All" || a.category === category)
      .filter((a) => !q || `${a.code} ${a.name} ${a.category}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "low" ? a.fee - b.fee : b.fee - a.fee));
  }, [query, category, sort]);

  const picked = activities.filter((a) => shortlist.includes(a.code));
  const toggle = (code: string) =>
    setShortlist((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewing]);

  const shortlistMessage =
    `Hello Workdane, I'm considering these business activities:\n` +
    picked.map((a) => `- ${a.code} ${a.name}`).join("\n") +
    `\nPlease advise on the next steps.`;

  const viewingOn = viewing ? shortlist.includes(viewing.code) : false;

  return (
    <section id="business-activities" className="scroll-mt-24 bg-white px-5 pb-28 pt-16 sm:px-9">
      <div className="mx-auto max-w-[1840px]">

        <div className="flex flex-col gap-6 border-b border-heading/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex max-w-md flex-1 items-center gap-3 border-b-2 border-heading/20 pb-2 transition focus-within:border-gold">
            <Search className="h-4 w-4 shrink-0 text-body" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or code"
              aria-label="Search activities"
              className="w-full bg-transparent text-[16px] text-heading outline-none placeholder:text-body/50"
            />
          </label>
          <label className="flex items-center gap-3 text-[14px] font-extrabold uppercase tracking-[0.18em] text-navy">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="border-b-2 border-gold bg-transparent py-1 pr-1 text-[16px] font-extrabold uppercase tracking-[0.12em] outline-none"
            >
              <option value="name">Name, A to Z</option>
              <option value="low">Fee, low to high</option>
              <option value="high">Fee, high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const n = t === "All" ? activities.length : activities.filter((a) => a.category === t).length;
            const on = category === t;
            return (
              <button
                key={t}
                onClick={() => setCategory(t)}
                aria-pressed={on}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-bold transition ${
                  on ? "bg-navy text-white" : "bg-tint text-navy hover:bg-line"
                }`}
              >
                {t} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>

        <ol className="mt-8 border-t border-heading/15">
          {list.map((a) => {
            const on = shortlist.includes(a.code);
            return (
              <li key={a.code} className="border-b border-heading/15">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setViewing(a)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setViewing(a);
                  }}
                  className="group grid cursor-pointer grid-cols-[1fr_auto] items-center gap-4 px-1 py-5 outline-none row-wipe sm:grid-cols-[7rem_1fr_13rem_9rem_3rem] sm:px-4"
                >
                  <span className="hidden font-mono text-[14px] tracking-wider text-bronze sm:block">{a.code}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-bold text-heading transition-transform duration-300 group-hover:translate-x-3 sm:text-2xl">
                      {a.name}
                    </span>
                    <span className="mt-1 block text-[14px] font-bold uppercase tracking-widest text-bronze sm:hidden">
                      {a.category} · AED {fmt(a.fee)}
                    </span>
                    {a.approval && (
                      <span className="mt-2 inline-block text-[12px] font-bold uppercase tracking-widest text-navy/70">
                        Extra approval
                      </span>
                    )}
                  </span>
                  <span className="hidden text-[16px] text-body sm:block">{a.category}</span>
                  <span className="hidden text-[16px] font-bold text-navy sm:block">AED {fmt(a.fee)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(a.code);
                    }}
                    aria-pressed={on}
                    aria-label={`${on ? "Remove" : "Add"} ${a.name} ${on ? "from" : "to"} shortlist`}
                    className={`flex h-10 w-10 items-center justify-center justify-self-end rounded-full border transition ${
                      on
                        ? "border-gold bg-gold text-midnight"
                        : "border-heading/25 text-heading hover:border-navy hover:bg-navy hover:text-white"
                    }`}
                  >
                    {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        {!list.length && <p className="py-16 text-center font-display text-2xl text-heading/50">No activities match. Try a different word.</p>}
        <p className="mt-6 text-[14px] text-body/80">{INDICATIVE_NOTE}</p>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-midnight/50 backdrop-blur-[2px]" onClick={() => setViewing(null)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={viewing.name}
            onClick={(e) => e.stopPropagation()}
            className="rise flex h-full w-full max-w-lg flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="font-mono text-[14px] tracking-wider text-bronze">{viewing.code}</span>
              <button onClick={() => setViewing(null)} aria-label="Close" className="rounded-full p-2 text-heading hover:bg-line">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-10">
              <p className="text-[14px] font-bold uppercase tracking-[0.25em] text-bronze">{viewing.category}</p>
              <h3 className="mt-3 font-display text-[40px] font-bold leading-tight text-heading">{viewing.name}</h3>
              <p className="mt-6 text-[16px] leading-relaxed">
                We confirm the licence requirements, approvals and documents for {viewing.name.toLowerCase()} before you apply.
              </p>
              {viewing.approval && (
                <p className="mt-6 border-l-2 border-gold pl-4 text-[16px] leading-relaxed text-heading">
                  <span className="font-bold">Extra approval:</span> {viewing.approval}
                </p>
              )}
              <div className="mt-10 border-t border-line pt-6">
                <p className="text-[14px] font-bold uppercase tracking-[0.25em] text-bronze">Indicative fee</p>
                <p className="mt-2 font-display text-[40px] font-bold text-navy">AED {fmt(viewing.fee)}</p>
                <p className="mt-2 text-[14px] text-body/80">{INDICATIVE_NOTE}</p>
              </div>
            </div>
            <div className="grid gap-3 border-t border-line p-6 sm:grid-cols-2 sm:p-8">
              <button
                onClick={() => toggle(viewing.code)}
                className={`rounded-full px-6 py-3.5 text-[16px] font-bold transition ${
                  viewingOn ? "border border-navy text-navy hover:bg-navy hover:text-white" : "gold-gradient btn-shine text-midnight"
                }`}
              >
                {viewingOn ? "Remove from shortlist" : "Add to shortlist"}
              </button>
              <a
                href={whatsappLink(`Hello Workdane, I'd like to know more about ${viewing.code} - ${viewing.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0f7d46] px-6 py-3.5 text-[16px] font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}

      {picked.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-midnight text-white shadow-2xl">
            <button
              onClick={() => setShowList((s) => !s)}
              aria-expanded={showList}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-[16px] font-bold">
                Shortlist <span className="gold-text ml-2 text-base">{picked.length}</span>
              </span>
              <span className="flex items-center gap-2 text-[16px] font-semibold text-white/70">
                {showList ? "Hide" : "Review"}
                <ArrowUpRight className={`h-4 w-4 transition ${showList ? "rotate-180" : ""}`} />
              </span>
            </button>

            {showList && (
              <div className="rise border-t border-white/10 px-6 py-5">
                <ul className="max-h-56 space-y-3 overflow-y-auto">
                  {picked.map((a) => (
                    <li key={a.code} className="flex items-center justify-between gap-4 text-[16px]">
                      <span>
                        <span className="mr-3 font-mono text-[14px] text-gold-light">{a.code}</span>
                        {a.name}
                      </span>
                      <button onClick={() => toggle(a.code)} aria-label={`Remove ${a.name}`} className="text-white/60 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href={whatsappLink(shortlistMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#0f7d46] px-5 py-3 text-[16px] font-bold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send on WhatsApp
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setShowList(false)}
                    className="gold-gradient btn-shine flex items-center justify-center rounded-full px-5 py-3 text-[16px] font-bold text-midnight"
                  >
                    Request a call back
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
