"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories } from "@/lib/activities";
import { activities, activityTypes, industries, type Activity } from "@/lib/activity-data";
import { whatsappLink } from "@/lib/config";

type SortKey = "type" | "group" | "sub" | "name" | "authority";
type Approval = "any" | "required" | "none";

const STORAGE_KEY = "workdane-saved-activities";
const PAGE_SIZES = [10, 25, 50, 100];
const chips = ["All", ...categories, "Other"];
const GRID = "lg:grid-cols-[9.5rem_4.5rem_6.5rem_minmax(0,1fr)_15rem_6.5rem_3rem]";

const categoryCounts = chips.reduce<Record<string, number>>((acc, c) => {
  acc[c] = c === "All" ? activities.length : activities.filter((a) => a.category === c).length;
  return acc;
}, {});

const select =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-[16px] text-heading outline-none transition hover:border-heading/30 focus:border-navy focus:ring-4 focus:ring-navy/10";

function compare(a: Activity, b: Activity, key: SortKey) {
  if (key === "group" || key === "sub") return a[key].localeCompare(b[key], undefined, { numeric: true });
  if (key === "authority") return (a.authority ?? "~").localeCompare(b.authority ?? "~");
  return a[key].localeCompare(b[key]);
}

// 1 … 4 5 6 … 20 style page list
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const out: (number | "…")[] = [];
  let last = 0;
  for (const p of [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)) {
    if (p - last > 1) out.push("…");
    out.push(p);
    last = p;
  }
  return out;
}

const timingText = (a: Activity) =>
  a.timing === "before" ? "Needed before your licence is issued" : a.timing === "after" ? "Needed after your licence is issued" : "";

export default function BusinessActivities() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("");
  const [industry, setIndustry] = useState("");
  const [approval, setApproval] = useState<Approval>("any");
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "sub", dir: 1 });
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const [viewing, setViewing] = useState<Activity | null>(null);
  const [showList, setShowList] = useState(false);

  const deferredQuery = useDeferredValue(query);

  // Menu links look like /business-activities?category=IT%20Services
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    // Reading the address bar after load keeps the page static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (wanted && chips.includes(wanted)) setCategory(wanted);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      // localStorage only exists in the browser, so it is read after load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string" && !!activities[Number(id)]));
    } catch {}
  }, []);

  const toggle = (id: string) =>
    setSaved((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const words = q ? q.split(/\s+/) : [];
    return activities
      .filter((a) => category === "All" || a.category === category)
      .filter((a) => !type || a.type === type)
      .filter((a) => !industry || a.industry === industry)
      .filter((a) => approval === "any" || (approval === "required" ? !!a.authority : !a.authority))
      .filter((a) => words.every((w) => a.search.includes(w)))
      .sort((a, b) => compare(a, b, sort.key) * sort.dir || compare(a, b, "sub"));
  }, [deferredQuery, category, type, industry, approval, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const filtersActive = !!(type || industry || approval !== "any");

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

  const picked = saved.map((id) => activities[Number(id)]).filter(Boolean);
  const shortlistMessage =
    `Hello Workdane, I'm considering these business activities:\n` +
    picked
      .slice(0, 20)
      .map((a) => `- ${a.sub} ${a.name.length > 90 ? `${a.name.slice(0, 90)}...` : a.name}`)
      .join("\n") +
    (picked.length > 20 ? `\n...and ${picked.length - 20} more` : "") +
    `\nPlease advise on the next steps.`;

  const sortBy = (key: SortKey) => {
    setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
    setPage(1);
  };

  const clearFilters = () => {
    setType("");
    setIndustry("");
    setApproval("any");
    setQuery("");
    setCategory("All");
    setPage(1);
  };

  const head = (k: SortKey, label: string, className = "") => (
    <button
      type="button"
      onClick={() => sortBy(k)}
      aria-label={`Sort by ${label}`}
      className={`flex items-center gap-1.5 text-left text-[13px] font-bold uppercase tracking-wider text-white ${className}`}
    >
      {label}
      {sort.key === k ? sort.dir === 1 ? <ArrowUp className="h-3.5 w-3.5 text-gold-light" /> : <ArrowDown className="h-3.5 w-3.5 text-gold-light" /> : <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />}
    </button>
  );

  const viewingOn = viewing ? saved.includes(viewing.id) : false;

  return (
    <section id="business-activities" className="scroll-mt-24 bg-white px-6 pb-28 pt-16 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        {/* search and controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-body" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by activity, code, group or authority"
              aria-label="Search activities"
              className="w-full rounded-full border border-line bg-white py-4 pl-14 pr-5 text-[16px] text-heading outline-none transition placeholder:text-body/60 hover:border-heading/30 focus:border-navy focus:ring-4 focus:ring-navy/10"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            className={`flex items-center justify-center gap-2 rounded-full border px-6 py-4 text-[15px] font-semibold transition ${
              showFilters || filtersActive ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced filters
            {filtersActive && <span className="gold-gradient h-2 w-2 rounded-full" />}
          </button>
          <button
            type="button"
            onClick={() => setShowList((s) => !s)}
            className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-[15px] font-semibold text-white transition hover:bg-slate-accent"
          >
            <Bookmark className="h-4 w-4" />
            Saved
            <span className="gold-gradient min-w-7 rounded-full px-2 py-0.5 text-center text-[13px] font-bold text-midnight">{saved.length}</span>
          </button>
        </div>

        {showFilters && (
          <div className="rise mt-4 grid gap-4 rounded-2xl border border-line bg-tint p-5 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-[13px] font-bold text-heading">
              Type
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className={`${select} mt-2 font-normal`}
              >
                <option value="">All types</option>
                {activityTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-[13px] font-bold text-heading">
              Industry
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setPage(1);
                }}
                className={`${select} mt-2 font-normal`}
              >
                <option value="">All industries</option>
                {industries.map((t) => (
                  <option key={t} value={t}>
                    {t.length > 60 ? `${t.slice(0, 58)}...` : t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[13px] font-bold text-heading">
              Third-party approval
              <select
                value={approval}
                onChange={(e) => {
                  setApproval(e.target.value as Approval);
                  setPage(1);
                }}
                className={`${select} mt-2 font-normal`}
              >
                <option value="any">Any</option>
                <option value="required">Approval required</option>
                <option value="none">No approval needed</option>
              </select>
            </label>
            <div className="flex items-end">
              <button type="button" onClick={clearFilters} className="w-full rounded-xl border border-gold px-4 py-2.5 text-[15px] font-bold text-bronze transition hover:bg-gold/10">
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* licence categories */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {chips.map((c) => {
            const on = category === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  window.history.replaceState(null, "", c === "All" ? window.location.pathname : `?category=${encodeURIComponent(c)}`);
                  setPage(1);
                }}
                aria-pressed={on}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-bold transition ${on ? "bg-navy text-white" : "bg-tint text-navy hover:bg-line"}`}
              >
                {c} <span className="opacity-80">{categoryCounts[c]}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[14px] text-body" aria-live="polite">
          <b className="text-heading">{filtered.length.toLocaleString("en-US")}</b> {filtered.length === 1 ? "activity" : "activities"} found
        </p>

        {/* table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          <div className={`hidden items-center gap-x-4 bg-navy px-4 py-3.5 lg:grid ${GRID}`}>
            {head("type", "Type")}
            {head("group", "Group")}
            {head("sub", "Code")}
            {head("name", "Activity name")}
            {head("authority", "Third party")}
            <span className="text-[13px] font-bold uppercase tracking-wider text-white">Fee</span>
            <span className="sr-only">Save</span>
          </div>

          <ol>
            {visible.map((a) => {
              const on = saved.includes(a.id);
              return (
                <li key={a.id} className="border-t border-line first:border-t-0">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setViewing(a)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setViewing(a);
                    }}
                    className={`group row-wipe grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-4 outline-none ${GRID}`}
                  >
                    <span className="hidden text-[13px] text-body lg:block">{a.type}</span>
                    <span className="hidden font-mono text-[13px] text-bronze lg:block">{a.group}</span>
                    <span className="hidden font-mono text-[13px] font-semibold text-bronze lg:block">{a.sub}</span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-[15px] font-semibold leading-snug text-heading transition-transform duration-300 group-hover:translate-x-1">{a.name}</span>
                      <span className="mt-1 block text-[12px] font-bold uppercase tracking-wider text-bronze lg:hidden">
                        {a.sub} · {a.type}
                        {a.authority ? " · Approval needed" : ""}
                      </span>
                    </span>
                    <span className="hidden text-[13px] leading-snug text-body lg:block">{a.authority ?? "Not required"}</span>
                    <span className="hidden text-[13px] font-semibold text-navy lg:block">On request</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(a.id);
                      }}
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Save"} ${a.sub} ${on ? "from" : "to"} your shortlist`}
                      className={`flex h-10 w-10 items-center justify-center justify-self-end rounded-full border transition ${
                        on ? "border-gold bg-gold text-midnight" : "border-heading/25 text-heading hover:border-navy hover:bg-navy hover:text-white"
                      }`}
                    >
                      {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {!visible.length && (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-[21px] font-bold text-heading">No activities match your search.</p>
              <button onClick={clearFilters} className="mt-4 text-[15px] font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                Clear search and filters
              </button>
            </div>
          )}
        </div>

        {/* paging */}
        {filtered.length > 0 && (
          <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14px] text-body">
              Showing <b className="text-heading">{(start + 1).toLocaleString("en-US")}</b> to{" "}
              <b className="text-heading">{Math.min(start + pageSize, filtered.length).toLocaleString("en-US")}</b> of{" "}
              <b className="text-heading">{filtered.length.toLocaleString("en-US")}</b>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition hover:border-navy disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageList(current, pageCount).map((p, i) =>
                p === "…" ? (
                  <span key={`gap-${i}`} className="px-1 text-body">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === current ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-full px-3 text-[14px] font-bold transition ${p === current ? "bg-navy text-white" : "text-navy hover:bg-tint"}`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage(current + 1)}
                disabled={current === pageCount}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition hover:border-navy disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <label className="flex items-center gap-2 text-[14px] text-body">
              Rows
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-line bg-white px-2 py-1.5 text-[16px] text-heading"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </nav>
        )}

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-body">
          The activity list follows the approved activities of the Sharjah Publishing City Free Zone. Fees and any third-party approvals are confirmed in your written quotation.
        </p>
      </div>

      {/* details panel */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-midnight/50 backdrop-blur-[2px]" onClick={() => setViewing(null)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={viewing.name}
            onClick={(e) => e.stopPropagation()}
            className="rise flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="font-mono text-[13px] font-semibold tracking-wider text-bronze">{viewing.sub}</span>
              <button onClick={() => setViewing(null)} aria-label="Close" className="rounded-full p-2 text-heading hover:bg-line">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-bronze">{viewing.industry}</p>
              <h3 className="mt-3 font-display text-[26px] font-bold leading-snug text-heading">{viewing.name}</h3>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-[15px]">
                <div>
                  <dt className="text-[13px] font-bold text-body">Type</dt>
                  <dd className="mt-1 font-semibold text-heading">{viewing.type}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold text-body">Group</dt>
                  <dd className="mt-1 font-mono font-semibold text-heading">{viewing.group}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold text-body">Licence category</dt>
                  <dd className="mt-1 font-semibold text-heading">{viewing.category}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold text-body">Fee</dt>
                  <dd className="mt-1 font-semibold text-navy">On request</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-xl bg-tint p-5">
                <p className="text-[13px] font-bold text-body">Third-party approval</p>
                {viewing.authority ? (
                  <>
                    <p className="mt-1 text-[15px] font-semibold text-heading">{viewing.authority}</p>
                    {viewing.timing && <p className="mt-1 text-[14px] text-body">{timingText(viewing)}.</p>}
                  </>
                ) : (
                  <p className="mt-1 text-[15px] font-semibold text-heading">Not required for this activity.</p>
                )}
              </div>

              {viewing.dnfbp && (
                <p className="mt-4 border-l-2 border-gold pl-4 text-[14px] leading-relaxed text-heading">
                  <span className="font-bold">Regulated activity:</span> this is a designated non-financial business or profession, so anti-money-laundering rules apply.
                </p>
              )}
              {viewing.notes && <p className="mt-4 border-l-2 border-gold pl-4 text-[14px] leading-relaxed text-heading">{viewing.notes}</p>}

              <p className="mt-8 text-[13px] leading-relaxed text-body">Your final fee and any approvals are confirmed in your written quotation.</p>
            </div>

            <div className="grid gap-3 border-t border-line p-6 sm:grid-cols-2 sm:p-8">
              <button
                onClick={() => toggle(viewing.id)}
                className={`rounded-full px-6 py-3.5 text-[15px] font-bold transition ${viewingOn ? "border border-navy text-navy hover:bg-navy hover:text-white" : "gold-gradient btn-shine text-midnight"}`}
              >
                {viewingOn ? "Remove from shortlist" : "Add to shortlist"}
              </button>
              <a
                href={whatsappLink(`Hello Workdane, I'd like to know more about ${viewing.sub} - ${viewing.name.slice(0, 120)}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#0f7d46] px-6 py-3.5 text-[15px] font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* saved shortlist */}
      {showList && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-midnight/40 px-4 pb-4 sm:items-center" onClick={() => setShowList(false)}>
          <div role="dialog" aria-modal="true" aria-label="Saved activities" onClick={(e) => e.stopPropagation()} className="rise w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-display text-[21px] font-bold text-heading">Saved activities ({picked.length})</h3>
              <button onClick={() => setShowList(false)} aria-label="Close" className="rounded-full p-2 hover:bg-line">
                <X className="h-5 w-5" />
              </button>
            </div>
            {picked.length ? (
              <>
                <ul className="max-h-[50vh] divide-y divide-line overflow-y-auto px-6">
                  {picked.map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-4 py-4">
                      <span className="text-[15px]">
                        <span className="mr-2 font-mono text-[13px] font-semibold text-bronze">{a.sub}</span>
                        {a.name}
                      </span>
                      <button onClick={() => toggle(a.id)} aria-label={`Remove ${a.sub}`} className="shrink-0 text-body hover:text-heading">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="grid gap-3 border-t border-line p-6 sm:grid-cols-2">
                  <a href={whatsappLink(shortlistMessage)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#0f7d46] px-5 py-3.5 text-[15px] font-bold text-white">
                    <MessageCircle className="h-4 w-4" />
                    Send on WhatsApp
                  </a>
                  <a href="/contact" className="gold-gradient btn-shine flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-bold text-midnight">
                    Request a call back <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </>
            ) : (
              <p className="px-6 py-12 text-center text-[15px] text-body">You haven&apos;t saved any activities yet. Use the + button on a row to add one.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
