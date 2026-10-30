"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Check, Loader2, Lock, Minus, Plus, Printer, Search, X } from "lucide-react";
import { activities, type Activity } from "@/lib/activity-data";
import { calc, popularCodes } from "@/lib/calculator-config";
import { INDICATIVE_NOTE } from "@/lib/config";
import { countries } from "@/lib/countries";
import { useFormSubmit } from "./useFormSubmit";

const fmt = (n: number) => n.toLocaleString("en-US");
const aed = (n: number) => `AED ${fmt(Math.round(n))}`;

const stepTitle = "font-display text-[26px] font-bold text-heading";
const stepNo = "mb-3 text-[13px] font-extrabold uppercase tracking-[0.25em] text-bronze";
const field =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold";
const label = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";

function Stepper({ value, onChange, min = 0, max, name }: { value: number; onChange: (n: number) => void; min?: number; max: number; name: string }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label={`Fewer ${name}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-heading/25 text-heading transition hover:border-navy disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="w-8 text-center font-display text-[24px] font-bold text-heading">
        {value}
      </span>
      <button
        type="button"
        aria-label={`More ${name}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-heading/25 text-heading transition hover:border-navy disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Toggle({ on, onClick, children, hint, price }: { on: boolean; onClick: () => void; children: React.ReactNode; hint?: string; price: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${on ? "border-gold bg-gold/5" : "border-line bg-white hover:border-heading/30"}`}
    >
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-gold bg-gold text-midnight" : "border-heading/30"}`}>
        {on && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-heading">{children}</span>
        {hint && <span className="mt-1 block text-[13px] leading-relaxed text-body">{hint}</span>}
      </span>
      <span className="shrink-0 text-[15px] font-bold text-navy">{price}</span>
    </button>
  );
}

type Details = { name: string; email: string; dial: string; phone: string; nationality: string; website: string };

export default function CostCalculator() {
  const [details, setDetails] = useState<Details>({ name: "", email: "", dial: "+971", phone: "", nationality: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [picked, setPicked] = useState<Activity[]>([]);

  const [shareholders, setShareholders] = useState(1);
  const [termIndex, setTermIndex] = useState(0);

  const [needVisa, setNeedVisa] = useState(false);
  const [investor, setInvestor] = useState(1);
  const [employee, setEmployee] = useState(0);
  const [statusChange, setStatusChange] = useState(0);

  const [bank, setBank] = useState(false);
  const [taxPackage, setTaxPackage] = useState(false);
  const [stamp, setStamp] = useState(false);
  const [vat, setVat] = useState(false);
  const [receptionist, setReceptionist] = useState(0);
  const [dependents, setDependents] = useState(0);

  const { status, message, whatsapp, sending, submit } = useFormSubmit("Cost calculator quote");

  const popular = useMemo(() => popularCodes.map((c) => activities.find((a) => a.sub === c)).filter((a): a is Activity => !!a), []);

  const results = useMemo(() => {
    const words = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length || deferredQuery.trim().length < 2) return [];
    const taken = new Set(picked.map((p) => p.id));
    const out: Activity[] = [];
    for (const a of activities) {
      if (taken.has(a.id)) continue;
      if (words.every((w) => a.search.includes(w))) {
        out.push(a);
        if (out.length === 8) break;
      }
    }
    return out;
  }, [deferredQuery, picked]);

  const add = (a: Activity) => {
    setPicked((p) => (p.some((x) => x.id === a.id) ? p : [...p, a]));
    setQuery("");
  };
  const remove = (id: string) => setPicked((p) => p.filter((x) => x.id !== id));

  // Estimate -------------------------------------------------------------
  const groupCounts = new Map<string, number>();
  for (const a of picked) groupCounts.set(a.group, (groupCounts.get(a.group) ?? 0) + 1);
  const largestGroups = [...groupCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, calc.includedGroups).map(([g]) => g);
  const extraActivities = picked.filter((a) => !largestGroups.includes(a.group));
  const groupsUsed = groupCounts.size;

  const term = calc.terms[termIndex];
  const annualLicence = picked.length ? Math.max(...picked.map((a) => calc.licence[a.category])) : 0;
  const licenceFull = annualLicence * term.years;
  const licenceDiscount = Math.round((licenceFull * term.discount) / 100);
  const extraHolders = Math.max(0, shareholders - calc.includedShareholders);
  const visaCount = needVisa ? investor + employee : 0;

  const lines: { label: string; amount: number; note?: string }[] = [];
  if (picked.length) {
    lines.push({ label: `Licence, ${term.years} ${term.years === 1 ? "year" : "years"}`, amount: licenceFull });
    if (term.discount) lines.push({ label: `Multi-year saving (${term.discount}%)`, amount: -licenceDiscount });
    if (extraActivities.length)
      lines.push({ label: `${extraActivities.length} activities beyond ${calc.includedGroups} groups`, amount: extraActivities.length * calc.extraGroupActivity });
    if (extraHolders) lines.push({ label: `${extraHolders} additional ${extraHolders === 1 ? "shareholder" : "shareholders"}`, amount: extraHolders * calc.extraShareholder });
    if (needVisa && (visaCount || statusChange)) {
      lines.push({ label: "Establishment card", amount: calc.visa.establishmentCard });
      lines.push({ label: "E-channel registration", amount: calc.visa.eChannel });
    }
    if (needVisa && investor) lines.push({ label: `Investor or partner visa × ${investor}`, amount: investor * calc.visa.investor });
    if (needVisa && employee) lines.push({ label: `Employee visa × ${employee}`, amount: employee * calc.visa.employee });
    if (needVisa && statusChange) lines.push({ label: `Change of status × ${statusChange}`, amount: statusChange * calc.visa.changeOfStatus });
    if (bank) lines.push({ label: "Bank account assistance", amount: calc.extras.bank });
    if (taxPackage) lines.push({ label: "Corporate tax startup package", amount: calc.extras.taxPackage });
    if (stamp) lines.push({ label: "Company stamp", amount: calc.extras.stamp });
    if (vat) lines.push({ label: "VAT registration", amount: calc.extras.vat });
    if (receptionist) lines.push({ label: `Virtual receptionist × ${receptionist} ${receptionist === 1 ? "year" : "years"}`, amount: receptionist * calc.extras.receptionistPerYear });
    if (dependents) lines.push({ label: `Dependent visa × ${dependents}`, amount: dependents * calc.extras.dependentVisa });
  }
  const total = lines.reduce((s, l) => s + l.amount, 0);

  const detailsOk = details.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(details.email) && /^[\d\s\-()]{6,15}$/.test(details.phone) && consent;

  const emailQuote = async () => {
    await submit(
      [
        { label: "Name", value: details.name },
        { label: "Email", value: details.email, type: "email" },
        { label: "Phone", value: `${details.dial} ${details.phone}`, type: "tel" },
        { label: "Nationality", value: details.nationality },
        { label: "Website", value: details.website },
        { label: "Activities", value: picked.map((a) => `${a.sub} ${a.name}`).join("; ") },
        { label: "Shareholders", value: String(shareholders) },
        { label: "Licence term", value: `${term.years} year(s)` },
        { label: "Visas", value: needVisa ? `Investor ${investor}, employee ${employee}, change of status ${statusChange}` : "None" },
        { label: "Estimate", value: lines.map((l) => `${l.label}: ${aed(l.amount)}`).join(" | ") },
        { label: "Estimated total", value: aed(total) },
      ],
      "",
    );
  };

  const minLicence = Math.min(...Object.values(calc.licence));
  const [step, setStep] = useState(1);
  const reach = (n: number) => unlocked && n <= step;
  const go = (n: number) => document.getElementById(`calc-step-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const advance = (n: number) => {
    setStep((s) => Math.max(s, n));
    setTimeout(() => go(n), 60);
  };

  const railSteps = [
    { n: 1, label: "Details", hint: "Required to continue" },
    { n: 2, label: "Activities", hint: unlocked ? "Choose your activities" : "Locked until your details are saved" },
    { n: 3, label: "Structure", hint: picked.length ? "Shareholders and licence length" : "Locked until you choose a business activity" },
    { n: 4, label: "Visas", hint: picked.length ? "Your visa requirements" : "Locked until you choose a business activity" },
    { n: 5, label: "Extras", hint: picked.length ? "Value-added services" : "Locked until you choose a business activity" },
    { n: 6, label: "Final quote", hint: picked.length ? "Your full estimate" : "Locked until you choose a business activity" },
  ];
  const progress = unlocked ? Math.min(step, 6) : 1;
  const [today, setToday] = useState("");

  const sectionCls = (n: number) =>
    `scroll-mt-28 rounded-3xl border bg-white p-7 shadow-[0_24px_60px_-40px_rgba(12,42,85,0.35)] transition sm:p-10 ${reach(n) ? "border-line" : "pointer-events-none select-none border-line opacity-50"}`;
  const nextBtn = "gold-gradient btn-shine rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60";

  const summary = (
    <aside
      className="h-fit rounded-3xl border border-line bg-white p-7 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.4)] lg:sticky lg:top-28 print:static print:shadow-none"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze">Your estimated cost</p>
        <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${unlocked ? "bg-[#0f7d46]/10 text-[#0f7d46]" : "bg-navy/10 text-navy"}`}>{unlocked ? "Live" : "Locked"}</span>
      </div>

      {!unlocked ? (
        <>
          <dl className="mt-5 space-y-3 text-[15px]">
            <div className="flex justify-between"><dt>Business licence</dt><dd className="font-bold text-heading">From {aed(minLicence)}</dd></div>
            <div className="flex justify-between"><dt>Visa fees</dt><dd className="select-none text-body blur-sm">AED 0,000</dd></div>
            <div className="flex justify-between"><dt>Value-added services</dt><dd className="select-none text-body blur-sm">AED 0,000</dd></div>
          </dl>
          <div className="mt-5 flex justify-between border-t border-line pt-4 font-display text-[18px] font-bold text-heading">
            <span>Estimated total</span>
            <span className="select-none blur-sm">AED 00,000</span>
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl bg-navy/5 px-4 py-3.5 text-left text-[14px] font-bold text-navy transition hover:bg-navy/10"
          >
            Share your details to unlock the full quote!
            <ArrowDown className="h-4 w-4 shrink-0" />
          </button>
        </>
      ) : picked.length === 0 ? (
        <>
          <p className="mt-5 font-display text-[22px] font-bold leading-snug text-heading">Let’s calculate your business setup cost</p>
          <p className="mt-3 text-[14px] leading-relaxed">Free to use. No payment. No obligation.</p>
          <div className="mt-5 flex justify-between border-t border-line pt-4 text-[15px]">
            <span>Licence from</span>
            <span className="font-bold text-heading">{aed(minLicence)}</span>
          </div>
          <p className="mt-2 text-[13px] text-body">Nothing selected yet</p>
          <button type="button" onClick={() => go(2)} className="mt-5 w-full rounded-full border border-heading/25 py-3 text-[15px] font-bold text-heading transition hover:border-navy">
            Choose an activity
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 font-display text-[34px] font-bold leading-none text-navy">{aed(total)}</p>
          <p className="mt-1 text-[13px] text-body">Updates as you change your choices</p>
          <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-[14px]">
            {lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-3">
                <span>{l.label}</span>
                <span className={`shrink-0 font-bold ${l.amount < 0 ? "text-[#0f7d46]" : "text-heading"}`}>{l.amount < 0 ? `− ${aed(-l.amount)}` : aed(l.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-line pt-4 font-display text-[18px] font-bold text-heading">
            <span>Estimated total</span>
            <span>{aed(total)}</span>
          </div>
          <button
            type="button"
            onClick={() => (step >= 6 ? go(6) : advance(Math.max(step, 6)))}
            className="mt-5 w-full rounded-full bg-navy py-3.5 text-[15px] font-bold text-white transition hover:bg-slate-accent"
          >
            See my full estimate
          </button>
        </>
      )}
      <p className="mt-5 text-[12px] leading-relaxed text-body">{INDICATIVE_NOTE}</p>
    </aside>
  );

  return (
    <section id="calculator" className="scroll-mt-24 bg-tint px-6 py-16 sm:px-12 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[230px_minmax(0,1fr)_320px]">
        {/* progress rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze">Progress</p>
              <p className="text-[13px] font-bold text-heading">{progress}/6</p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${(progress / 6) * 100}%` }} />
            </div>
            <ol className="mt-6 space-y-2">
              {railSteps.map((r) => {
                const open = reach(r.n) || (r.n === 1);
                const done = unlocked && step > r.n && (r.n < 3 || picked.length > 0);
                const current = (unlocked ? step : 1) === r.n;
                return (
                  <li key={r.n}>
                    <button
                      type="button"
                      disabled={!open}
                      onClick={() => go(r.n)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${current ? "border-navy bg-navy/5" : "border-transparent"} ${open ? "hover:bg-navy/5" : "cursor-not-allowed opacity-60"}`}
                    >
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${done ? "bg-[#0f7d46] text-white" : current ? "bg-navy text-white" : "bg-line text-body"}`}>
                        {done ? <Check className="h-4 w-4" /> : open ? r.n : <Lock className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-heading">{r.label}</span>
                        <span className="block text-[12px] leading-snug text-body">{r.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed">
              <p className="font-bold text-heading">Need help?</p>
              <p className="mt-1">A business setup adviser can verify all details before you make a payment.</p>
              <Link href="/book-appointment" className="mt-2 inline-block font-bold text-navy">
                Talk to an adviser →
              </Link>
            </div>
          </div>
        </aside>

        {/* steps */}
        <div className="min-w-0 space-y-6">
          <p className="text-[13px] font-bold text-heading lg:hidden">
            Step {progress} of 6
          </p>

          {/* 01 details */}
          <div id="calc-step-1" className={`${sectionCls(1)} !pointer-events-auto !opacity-100`}>
            <p className={stepNo}>01</p>
            <h2 className={stepTitle}>First, a few quick details!</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed">Let’s get started by sharing some basic information about yourself. Nothing is sent until you ask for the quote.</p>
            {unlocked ? (
              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-tint p-5 text-[15px]">
                <Check className="h-5 w-5 text-[#0f7d46]" />
                <span className="font-bold text-heading">{details.name}</span>
                <span>{details.email}</span>
                <span>
                  {details.dial} {details.phone}
                </span>
                <button type="button" onClick={() => setUnlocked(false)} className="ml-auto text-[15px] font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                  Edit details
                </button>
              </div>
            ) : (
              <form
                className="mt-8 grid gap-7 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!detailsOk) return;
                  setUnlocked(true);
                  setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
                  setStep((s) => Math.max(s, 2));
                  setTimeout(() => go(2), 60);
                }}
              >
                <label className="block">
                  <span className={label}>Full name *</span>
                  <input value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} required maxLength={100} autoComplete="name" className={field} />
                </label>
                <label className="block">
                  <span className={label}>Email *</span>
                  <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} required maxLength={150} autoComplete="email" className={field} />
                </label>
                <div className="block">
                  <span className={label}>Phone *</span>
                  <div className="flex gap-3">
                    <select value={details.dial} onChange={(e) => setDetails({ ...details, dial: e.target.value })} aria-label="Country code" className={`${field} w-[8.5rem] shrink-0 bg-white`}>
                      {countries.map((c) => (
                        <option key={c.name} value={c.dial}>
                          {c.dial} {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      required
                      maxLength={15}
                      pattern="[\d\s\-()]{6,15}"
                      title="Enter the number without the country code"
                      className={`${field} min-w-0 flex-1`}
                    />
                  </div>
                </div>
                <label className="block">
                  <span className={label}>Nationality (optional)</span>
                  <select value={details.nationality} onChange={(e) => setDetails({ ...details, nationality: e.target.value })} className={`${field} bg-white`}>
                    <option value="">Select your nationality</option>
                    {countries.map((c) => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className={label}>Website (optional)</span>
                  <input value={details.website} onChange={(e) => setDetails({ ...details, website: e.target.value })} maxLength={150} className={field} />
                </label>
                <label className="flex items-start gap-3 text-[14px] leading-relaxed sm:col-span-2">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#07399d]" />
                  I consent to receiving my quote by email, phone or WhatsApp. An adviser may contact me to follow up on my enquiry.
                </label>
                <button type="submit" disabled={!detailsOk} className={`${nextBtn} sm:col-span-2 sm:justify-self-start`}>
                  Unlock my estimate
                </button>
              </form>
            )}
          </div>

          {/* 02 activities */}
          <div id="calc-step-2" className={sectionCls(2)} aria-disabled={!reach(2)}>
            <p className={stepNo}>02</p>
            <h2 className={stepTitle}>Choose your business activities</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed">
              Your {calc.includedGroups} largest activity groups are included in the licence. Activities from any further group are charged separately and shown as their own line.
            </p>

            <div className="relative mt-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by activity name or code"
                aria-label="Search activities"
                className="w-full rounded-full border border-line bg-white py-4 pl-12 pr-5 text-[16px] outline-none focus:border-gold"
              />
              {results.length > 0 && (
                <ul className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-line bg-white shadow-xl">
                  {results.map((a) => (
                    <li key={a.id}>
                      <button type="button" onClick={() => add(a)} className="flex w-full items-start gap-4 border-b border-line px-5 py-3 text-left text-[15px] hover:bg-tint">
                        <span className="w-20 shrink-0 font-mono text-[13px] font-bold text-bronze">{a.sub}</span>
                        <span className="flex-1">{a.name}</span>
                        <Plus className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-3 text-[13px] text-body">
              Not sure which to pick? Browse the <Link href="/business-activities" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">full activity list</Link>. Want to check a trade name first? Use the{" "}
              <Link href="/name-check" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">name check</Link>.
            </p>

            {picked.length === 0 ? (
              <div className="mt-8">
                <p className="text-[13px] font-bold uppercase tracking-widest text-bronze">A shortlist to start from</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {popular.map((a) => (
                    <button key={a.id} type="button" onClick={() => add(a)} className="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy transition hover:border-gold">
                      {a.name.length > 38 ? `${a.name.slice(0, 36)}…` : a.name} <span className="text-body">+</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-[13px] font-bold uppercase tracking-widest text-bronze">
                  Your chosen activities · {groupsUsed} {groupsUsed === 1 ? "group" : "groups"}
                </p>
                <ul className="mt-4 border-t border-heading/15">
                  {picked.map((a) => (
                    <li key={a.id} className="flex items-start gap-4 border-b border-heading/15 py-4 text-[15px]">
                      <span className="w-20 shrink-0 font-mono text-[13px] font-bold text-bronze">{a.sub}</span>
                      <span className="flex-1 leading-relaxed">
                        {a.name}
                        {!largestGroups.includes(a.group) && <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[12px] font-bold text-bronze">Extra group</span>}
                        {a.authority && <span className="mt-1 block text-[13px] text-body">Needs approval from {a.authority}</span>}
                      </span>
                      <button type="button" onClick={() => remove(a.id)} aria-label={`Remove ${a.sub}`} className="shrink-0 text-body hover:text-heading">
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
                {groupsUsed > calc.includedGroups && (
                  <p className="mt-4 rounded-xl bg-gold/10 p-4 text-[14px] leading-relaxed text-heading">
                    You have gone past {calc.includedGroups} activity groups. That is fine: your {calc.includedGroups} largest groups stay included and each activity in the other groups is added to the estimate.
                  </p>
                )}
              </div>
            )}
            {step <= 2 && (
              <button type="button" disabled={!picked.length} onClick={() => advance(3)} className={`${nextBtn} mt-8`}>
                {picked.length ? "Next: Company details ↓" : "Pick an activity first ↓"}
              </button>
            )}
          </div>

          {/* 03 structure */}
          <div id="calc-step-3" className={sectionCls(3)}>
            <p className={stepNo}>03</p>
            <h2 className={stepTitle}>Company details</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed">Choose the structure that fits your goals.</p>
            <div className="mt-8">
              <p className={label}>Number of shareholders</p>
              <Stepper value={shareholders} onChange={setShareholders} min={1} max={calc.maxShareholders} name="shareholders" />
              <p className="mt-3 text-[13px] leading-relaxed text-body">
                Up to {calc.includedShareholders} shareholders are included. Each additional shareholder is {aed(calc.extraShareholder)}.
              </p>
            </div>
            <fieldset className="mt-10">
              <legend className={label}>Licence validity</legend>
              <p className="mb-4 max-w-xl text-[14px] leading-relaxed text-body">Enjoy long-term savings with a multi-year licence.</p>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {calc.terms.map((t, i) => (
                  <button
                    key={t.years}
                    type="button"
                    aria-pressed={termIndex === i}
                    onClick={() => setTermIndex(i)}
                    className={`rounded-2xl border p-4 text-left transition ${termIndex === i ? "border-navy bg-navy/5" : "border-line bg-white hover:border-heading/30"}`}
                  >
                    <span className="block font-display text-[19px] font-bold text-heading">
                      {t.years} {t.years === 1 ? "year" : "years"}
                    </span>
                    <span className="mt-1 block text-[13px] text-body">{t.discount ? `Save ${t.discount}%` : "Standard rate"}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="mt-6 text-[13px] leading-relaxed text-body">Looking for a different length? An adviser can price any term between 1 and 10 years.</p>
            {step <= 3 && (
              <button type="button" onClick={() => advance(4)} className={`${nextBtn} mt-8`}>
                Next: Visas ↓
              </button>
            )}
          </div>

          {/* 04 visas */}
          <div id="calc-step-4" className={sectionCls(4)}>
            <p className={stepNo}>04</p>
            <h2 className={stepTitle}>Share your visa requirements</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed">Choose how many visas you need for yourself, your team and your dependants.</p>
            <p className={`${label} mt-8`}>Do you need a residence visa?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle on={needVisa} onClick={() => setNeedVisa(true)} hint="Visa fees apply per visa." price="">
                Yes, I need visas
              </Toggle>
              <Toggle on={!needVisa} onClick={() => setNeedVisa(false)} hint="No visa or immigration fees apply." price="">
                No, licence only
              </Toggle>
            </div>
            {needVisa && (
              <div className="mt-8 space-y-6">
                <p className="text-[14px] leading-relaxed text-body">
                  The establishment card ({aed(calc.visa.establishmentCard)}) and e-channel registration ({aed(calc.visa.eChannel)}) are added once if you need any visa. Medical insurance is not included.
                </p>
                {(
                  [
                    ["Investor or partner visa", investor, setInvestor, calc.visa.investor, "visas"],
                    ["Employee visa", employee, setEmployee, calc.visa.employee, "employee visas"],
                    ["Change of status", statusChange, setStatusChange, calc.visa.changeOfStatus, "status changes"],
                  ] as const
                ).map(([name, value, set, price, unit]) => (
                  <div key={name} className="flex flex-wrap items-center justify-between gap-4 border-b border-heading/15 pb-6">
                    <div>
                      <p className="text-[16px] font-bold text-heading">{name}</p>
                      <p className="text-[13px] text-body">
                        {aed(price)} each{name === "Change of status" ? ". Required if you are already in the UAE." : ""}
                      </p>
                    </div>
                    <Stepper value={value} onChange={set} max={calc.visa.maxEach} name={unit} />
                  </div>
                ))}
                <p className="text-[14px]">
                  Need your visa faster?{" "}
                  <Link href="/book-appointment" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                    Talk to an adviser
                  </Link>
                  .
                </p>
              </div>
            )}
            {step <= 4 && (
              <button type="button" onClick={() => advance(5)} className={`${nextBtn} mt-8`}>
                {needVisa ? "Next: Extras ↓" : "No visas · Next: Extras ↓"}
              </button>
            )}
          </div>

          {/* 05 extras */}
          <div id="calc-step-5" className={sectionCls(5)}>
            <p className={stepNo}>05</p>
            <h2 className={stepTitle}>Value-added services</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed">Optional concierge services to help you launch faster. Add only what you need.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Toggle on={bank} onClick={() => setBank((v) => !v)} hint="Help opening a corporate bank account." price={aed(calc.extras.bank)}>
                Bank account assistance
              </Toggle>
              <Toggle on={taxPackage} onClick={() => setTaxPackage((v) => !v)} hint="Corporate tax registration and a first set of bookkeeping." price={aed(calc.extras.taxPackage)}>
                Corporate tax startup package
              </Toggle>
              <Toggle on={stamp} onClick={() => setStamp((v) => !v)} hint="Often requested by banks and authorities." price={aed(calc.extras.stamp)}>
                Company stamp
              </Toggle>
              <Toggle on={vat} onClick={() => setVat((v) => !v)} hint="Required once your turnover passes the VAT threshold." price={aed(calc.extras.vat)}>
                VAT registration
              </Toggle>
            </div>
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-heading/15 pb-6">
                <div>
                  <p className="text-[16px] font-bold text-heading">Virtual receptionist</p>
                  <p className="text-[13px] text-body">{aed(calc.extras.receptionistPerYear)} per year. For how many years?</p>
                </div>
                <Stepper value={receptionist} onChange={setReceptionist} max={10} name="years" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-heading/15 pb-6">
                <div>
                  <p className="text-[16px] font-bold text-heading">Dependent visa</p>
                  <p className="text-[13px] text-body">{aed(calc.extras.dependentVisa)} each, for a spouse, child or parent.</p>
                </div>
                <Stepper value={dependents} onChange={setDependents} max={10} name="dependent visas" />
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-body">We recommend the services that keep your company compliant and running smoothly.</p>
            {step <= 5 && (
              <button type="button" onClick={() => advance(6)} className={`${nextBtn} mt-8`}>
                See my total estimate ↓
              </button>
            )}
          </div>

          {/* 06 final quote */}
          <div id="calc-step-6" className={sectionCls(6)}>
            <p className={stepNo}>06</p>
            <h2 className={stepTitle}>Your total estimate</h2>
            <div className="mt-8 rounded-2xl border border-line bg-tint p-6 sm:p-8">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze">Workdane Management Consultancy</p>
              <p className="mt-1 font-display text-[22px] font-bold text-heading">Business setup quote</p>
              <dl className="mt-5 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-2">
                <div><dt className="text-body">Prepared for</dt><dd className="font-bold text-heading">{details.name || "—"}</dd></div>
                <div><dt className="text-body">Date</dt><dd className="font-bold text-heading">{today}</dd></div>
                <div><dt className="text-body">Email</dt><dd className="break-all font-bold text-heading">{details.email || "—"}</dd></div>
                <div><dt className="text-body">Phone</dt><dd className="font-bold text-heading">{details.phone ? `${details.dial} ${details.phone}` : "—"}</dd></div>
              </dl>
              <p className="mt-6 text-[13px] font-bold uppercase tracking-widest text-bronze">Your estimated business setup cost</p>
              <p className="font-display text-[40px] font-bold leading-tight text-navy">{aed(total)}</p>
              <p className="text-[13px] text-body">All selections included.</p>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-[15px]">
                {lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-4">
                    <span>{l.label}</span>
                    <span className={`shrink-0 font-bold ${l.amount < 0 ? "text-[#0f7d46]" : "text-heading"}`}>{l.amount < 0 ? `− ${aed(-l.amount)}` : aed(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-between border-t border-line pt-4 font-display text-[19px] font-bold text-heading">
                <span>Estimated total</span>
                <span>{aed(total)}</span>
              </div>
              <p className="mt-5 text-[13px] leading-relaxed text-body">
                The quoted amount is an estimate based on your selections. The final amount is confirmed by your business setup adviser before any payment is made. Government fees are subject to change without notice.
              </p>
            </div>

            {status === "sent" ? (
              <div role="status" className="mt-6 rounded-xl bg-[#0f7d46]/10 p-4 text-[15px] leading-relaxed text-heading">
                <p className="font-bold">On its way.</p>
                We have your selections and will email you the full breakdown. An adviser will follow up shortly.
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={emailQuote}
                  disabled={!unlocked || picked.length === 0 || sending}
                  className={`${nextBtn} flex items-center gap-2`}
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {sending ? "Sending..." : "Email me this quote"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={picked.length === 0}
                  className="flex items-center gap-2 rounded-full border border-heading/25 px-6 py-3.5 text-[15px] font-bold text-heading transition hover:border-navy disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Printer className="h-4 w-4" />
                  Save as PDF
                </button>
                <p className="w-full text-[14px] sm:w-auto sm:ml-2">
                  Prefer to split your costs?{" "}
                  <Link href="/pay-as-you-go" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                    Explore pay-as-you-go
                  </Link>
                </p>
              </div>
            )}
            {status === "error" && (
              <div role="alert" className="mt-4 border-l-4 border-red-500 bg-red-50 p-3 text-[14px] text-red-900">
                {message}
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-1 block font-bold underline">
                    Send it on WhatsApp instead
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="lg:hidden">{summary}</div>
        </div>

        <div className="hidden lg:block">{summary}</div>
      </div>
    </section>
  );
}
