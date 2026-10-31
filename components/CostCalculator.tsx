"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Globe, Link2, LockOpen, Mail, User, ArrowRight, ArrowLeftRight, Briefcase, Building2, Check, ChevronDown, ClipboardList, FileDown, HeartPulse, IdCard, Landmark, LayoutGrid, Loader2, Lock, Minus, Newspaper, Package, Percent, PhoneCall, Plus, Receipt, ScanFace, Search, ShieldCheck, Stamp, Truck, Users, Wrench, X } from "lucide-react";
import Image from "next/image";
import { activities, type Activity } from "@/lib/activity-data";
import { calc, employeeVisaTotal, investorVisaTotal, popularCodes } from "@/lib/calculator-config";
import { ACTIVITY_COUNT } from "@/lib/activities";
import { CONTACT, INDICATIVE_NOTE, LOGO_LIGHT, OFFICES } from "@/lib/config";
import { countries, fullPhone } from "@/lib/countries";
import { PREFILL_KEY, type Prefill } from "@/lib/registration";
import DialSelect from "./DialSelect";
import { useFormSubmit } from "./useFormSubmit";

const fmt = (n: number) => n.toLocaleString("en-US");
const aed = (n: number) => `AED ${fmt(Math.round(n))}`;

const stepTitle = "font-display text-[26px] font-bold text-heading";
const box =
  "w-full rounded-xl border border-heading/20 bg-white py-3.5 pl-11 pr-4 text-[16px] text-heading outline-none transition placeholder:text-body/45 hover:border-heading/40 focus:border-navy focus:ring-4 focus:ring-navy/10";
const boxLabel = "mb-2 block text-[13px] font-bold text-heading";

function Stepper({ value, onChange, min = 0, max, name }: { value: number; onChange: (n: number) => void; min?: number; max: number; name: string }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2 py-1.5">
      <button
        type="button"
        aria-label={`Fewer ${name}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full text-heading transition hover:bg-tint disabled:text-body/40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="w-8 text-center text-[16px] font-bold text-heading">
        {value}
      </span>
      <button
        type="button"
        aria-label={`More ${name}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full text-heading transition hover:bg-tint disabled:text-body/40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? "bg-navy" : "bg-navy/15"}`}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

const groupOf = (label: string) =>
  /^(Licence|Trade licence|Office lease|Management fee|Multi-year|\d+ activities|\d+ additional)/.test(label)
    ? "Business licence"
    : /^(Establishment|E-channel|Visa allocation|Investor|Employee|Emirates ID|Medical test|Change of status)/.test(label)
      ? "Visa fees"
      : "Value-added services";

type Bucket = "Popular" | "Trading" | "Media & Publishing" | "Professional" | "Business Services" | "Industry & Transport" | "Health, Education & Leisure" | "Regulated" | "All";

const buckets: { id: Bucket; label: string; icon: typeof Package }[] = [
  { id: "Popular", label: "Popular", icon: LayoutGrid },
  { id: "Trading", label: "Trading", icon: Package },
  { id: "Media & Publishing", label: "Media & Publishing", icon: Newspaper },
  { id: "Professional", label: "Professional", icon: Briefcase },
  { id: "Business Services", label: "Business Services", icon: Wrench },
  { id: "Industry & Transport", label: "Industry & Transport", icon: Truck },
  { id: "Health, Education & Leisure", label: "Health, Education & Leisure", icon: HeartPulse },
  { id: "Regulated", label: "Regulated", icon: ShieldCheck },
];

const bucketByIndustry: Record<string, Bucket> = {
  "Wholesale and retail trade and repair of motor vehicles and motorcycles": "Trading",
  "Electronic publishing activities": "Media & Publishing",
  Publishing: "Media & Publishing",
  "Professional, scientific and technical activities": "Professional",
  "Financial and insurance activities": "Professional",
  "Real estate activities": "Professional",
  "Administrative and support service activities": "Business Services",
  "Other service activities": "Business Services",
  Manufacturing: "Industry & Transport",
  Construction: "Industry & Transport",
  "Transportation and storage": "Industry & Transport",
};
const bucketOf = (a: Activity): Bucket => bucketByIndustry[a.industry] ?? (a.industry.startsWith("Activities of households") ? "Business Services" : "Health, Education & Leisure");

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

  const [bucket, setBucket] = useState<Bucket>("Popular");
  const [shown, setShown] = useState(40);

  const bucketCounts = useMemo(() => {
    const c: Record<string, number> = { Popular: popular.length, All: activities.length, Regulated: 0 };
    for (const b of buckets) if (b.id !== "Popular" && b.id !== "Regulated") c[b.id] = 0;
    for (const a of activities) {
      c[bucketOf(a)] = (c[bucketOf(a)] ?? 0) + 1;
      if (a.authority) c.Regulated += 1;
    }
    return c;
  }, [popular]);

  const listItems = useMemo(() => {
    const words = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const base = words.length
      ? activities
      : bucket === "Popular"
        ? popular
        : bucket === "All"
          ? activities
          : bucket === "Regulated"
            ? activities.filter((a) => a.authority)
            : activities.filter((a) => bucketOf(a) === bucket);
    return words.length ? base.filter((a) => words.every((w) => a.search.includes(w))) : base;
  }, [deferredQuery, bucket, popular]);

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
    lines.push({ label: `Trade licence, MOA and certificate of formation (${term.years} ${term.years === 1 ? "year" : "years"})`, amount: licenceFull });
    lines.push({ label: "Office lease agreement", amount: calc.officeLease });
    lines.push({ label: "Management fee", amount: calc.managementFee });
    if (term.discount) lines.push({ label: `Multi-year saving (${term.discount}%)`, amount: -licenceDiscount });
    if (extraActivities.length)
      lines.push({ label: `${extraActivities.length} activities beyond ${calc.includedGroups} groups`, amount: extraActivities.length * calc.extraGroupActivity });
    if (extraHolders) lines.push({ label: `${extraHolders} additional ${extraHolders === 1 ? "shareholder" : "shareholders"}`, amount: extraHolders * calc.extraShareholder });
    if (needVisa && (visaCount || statusChange)) {
      lines.push({ label: "Establishment card", amount: calc.visa.establishmentCard });
      lines.push({ label: "E-channel registration", amount: calc.visa.eChannel });
    }
    if (needVisa && visaCount) {
      lines.push({ label: `Visa allocation × ${visaCount}`, amount: visaCount * calc.visa.allocation });
      if (investor) lines.push({ label: `Investor/partner visa (2 years) × ${investor}`, amount: investor * calc.visa.investor });
      if (employee) lines.push({ label: `Employee visa × ${employee}`, amount: employee * calc.visa.employee });
      lines.push({ label: `Emirates ID × ${visaCount}`, amount: visaCount * calc.visa.emiratesId });
      lines.push({ label: `Medical test × ${visaCount}`, amount: visaCount * calc.visa.medicalTest });
    }
    if (needVisa && statusChange) lines.push({ label: `Change of status × ${statusChange}`, amount: statusChange * calc.visa.changeOfStatus });
    if (bank) lines.push({ label: "Bank account assistance", amount: calc.extras.bank });
    if (taxPackage) lines.push({ label: "Corporate tax startup package", amount: calc.extras.taxPackage });
    if (stamp) lines.push({ label: "Company stamp", amount: calc.extras.stamp });
    if (vat) lines.push({ label: "VAT registration", amount: calc.extras.vat });
    if (receptionist) lines.push({ label: `Virtual receptionist × ${receptionist} ${receptionist === 1 ? "year" : "years"}`, amount: receptionist * calc.extras.receptionistPerYear });
    if (dependents) lines.push({ label: `Dependent visa × ${dependents}`, amount: dependents * calc.extras.dependentVisa });
  }
  const total = lines.reduce((s, l) => s + l.amount, 0);

  const detailsOk = details.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(details.email) && (details.phone.replace(/\D/g, "").length >= 6 && details.phone.replace(/\D/g, "").length <= 15) && consent;

  const emailQuote = async () => {
    const ok = await submit(
      [
        { label: "Name", value: details.name },
        { label: "Email", value: details.email, type: "email" },
        { label: "Phone", value: fullPhone(details.dial, details.phone), type: "tel" },
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
    if (ok) {
      // Lets the registration form start from what the visitor chose here.
      const prefill: Prefill = {
        name: details.name,
        email: details.email,
        dial: details.dial,
        phone: details.phone,
        nationality: details.nationality,
        activities: picked.map((a) => ({ code: a.sub, name: a.name })),
        shareholders,
        investorVisas: needVisa ? investor : 0,
        employeeVisas: needVisa ? employee : 0,
      };
      try {
        localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
        localStorage.removeItem("workdane-registration-draft");
      } catch {}
    }
  };

  const minLicence = Math.min(...Object.values(calc.licence));
  const [step, setStep] = useState(1);
  const [showFees, setShowFees] = useState(false);
  const breakdown = ["Business licence", "Visa fees", "Value-added services"]
    .map((name) => {
      const items = lines.filter((l) => groupOf(l.label) === name);
      return { name, items, total: items.reduce((t, l) => t + l.amount, 0) };
    })
    .filter((g) => g.items.length);
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
  const [quoteRef, setQuoteRef] = useState("");

  const sectionCls = (n: number) =>
    `scroll-mt-28 rounded-3xl border bg-white p-7 shadow-[0_24px_60px_-40px_rgba(12,42,85,0.35)] transition sm:p-10 ${reach(n) ? "border-line" : "pointer-events-none select-none border-line opacity-50"}`;
  const nextBtn = "gold-gradient btn-shine rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60";

  const sumOf = (pred: (label: string) => boolean) => lines.filter((l) => pred(l.label)).reduce((t, l) => t + l.amount, 0);
  // The office lease and management fee are added when the visitor reaches the final estimate.
  const otherFees = sumOf((l) => /^(Office lease|Management fee)/.test(l));
  const finalReached = step >= 6;
  const summaryTotal = finalReached ? total : total - otherFees;
  const summaryRows = [
    { label: "Business licence", amount: sumOf((l) => groupOf(l) === "Business licence" && !/^(Office lease|Management fee)/.test(l)) },
    ...(finalReached ? [{ label: "Other fees", amount: otherFees }] : []),
    { label: "Visa fees", amount: sumOf((l) => groupOf(l) === "Visa fees") },
    { label: "Value-added services", amount: sumOf((l) => groupOf(l) === "Value-added services") },
  ].filter((r) => r.amount !== 0);

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
          <dl className="mt-5 space-y-4 text-[16px]">
            {summaryRows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4">
                <dt className="font-semibold text-body">{r.label}</dt>
                <dd className="shrink-0 font-bold text-heading">{aed(r.amount)}</dd>
              </div>
            ))}
          </dl>
          <hr className="my-5 border-line" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-bold text-heading">Estimated total</p>
            <p className="font-display text-[28px] font-extrabold leading-none text-heading">{aed(summaryTotal)}</p>
          </div>
          <p className="mt-4 text-[14px] text-body">
            Prefer to split your costs?{" "}
            <Link href="/pay-as-you-go" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
              Pay-as-you-go
            </Link>
          </p>
          <button
            type="button"
            onClick={() => (step >= 6 ? go(6) : advance(Math.max(step, 6)))}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-navy py-4 text-[16px] font-bold text-white transition hover:bg-slate-accent"
          >
            Review the full estimate <ArrowRight className="h-5 w-5" />
          </button>
        </>
      )}
      <p className="mt-5 text-[12px] leading-relaxed text-body">{INDICATIVE_NOTE}</p>
    </aside>
  );

  return (
    <section id="calculator" className="scroll-mt-24 bg-tint px-6 py-16 sm:px-12 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[230px_minmax(0,1fr)_320px]">
        {/* progress rail */}
        <aside className="hidden xl:block">
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
          <p className="text-[13px] font-bold text-heading xl:hidden">
            Step {progress} of 6
          </p>

          {/* 01 details */}
          <div id="calc-step-1" className={`${sectionCls(1)} !pointer-events-auto !opacity-100`}>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-[15px] font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(7,57,157,0.8)]">01</span>
              <div>
                <h2 className={stepTitle}>First, a few quick details!</h2>
                <p className="mt-1 max-w-xl text-[15px] leading-relaxed">Tell us who you are so we can prepare your estimate. Nothing is sent until you ask for the quote.</p>
              </div>
            </div>
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
                className="mt-8 grid gap-6 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!detailsOk) return;
                  setUnlocked(true);
                  setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
                  setQuoteRef(`WQ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`);
                  setStep((s) => Math.max(s, 2));
                  setTimeout(() => go(2), 60);
                }}
              >
                <label className="block">
                  <span className={boxLabel}>
                    Full name <span className="text-red-500">*</span>
                  </span>
                  <span className="relative block">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-navy/60" />
                    <input value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} required maxLength={100} autoComplete="name" placeholder="Your full name" className={box} />
                  </span>
                </label>
                <label className="block">
                  <span className={boxLabel}>
                    Email <span className="text-red-500">*</span>
                  </span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-navy/60" />
                    <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} required maxLength={150} autoComplete="email" placeholder="you@company.com" className={box} />
                  </span>
                </label>
                <div className="block md:col-span-2">
                  <span className={boxLabel}>
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </span>
                  <div className="flex gap-3">
                    <DialSelect
                      value={details.dial}
                      onChange={(dial) => setDetails({ ...details, dial })}
                      className="rounded-xl border border-heading/20 bg-white px-3.5 py-3.5 transition hover:border-heading/40 focus:border-navy focus:ring-4 focus:ring-navy/10"
                    />
                    <input
                      type="tel"
                      inputMode="tel"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      required
                      maxLength={20}
                      pattern="[\d\s\-()+]{6,20}"
                      title="Enter the number without the country code"
                      autoComplete="tel-national"
                      placeholder="5X XXX XXXX"
                      className={`${box} min-w-0 flex-1 !pl-4`}
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-body">We may contact you here to follow up on your quote.</p>
                </div>
                <label className="block">
                  <span className={boxLabel}>
                    Nationality <span className="font-normal text-body">(optional)</span>
                  </span>
                  <span className="relative block">
                    <Globe className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-navy/60" />
                    <select value={details.nationality} onChange={(e) => setDetails({ ...details, nationality: e.target.value })} className={`${box} appearance-none`}>
                      <option value="">Select nationality</option>
                      {countries.map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
                  </span>
                </label>
                <label className="block">
                  <span className={boxLabel}>
                    Website <span className="font-normal text-body">(optional)</span>
                  </span>
                  <span className="relative block">
                    <Link2 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-navy/60" />
                    <input value={details.website} onChange={(e) => setDetails({ ...details, website: e.target.value })} maxLength={150} placeholder="yourcompany.com" className={box} />
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-tint p-4 text-[14px] leading-relaxed md:col-span-2">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#07399d]" />
                  <span>I consent to receiving my quote by email, phone or WhatsApp. An adviser may contact me to follow up on my enquiry.</span>
                </label>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-2">
                  <button type="submit" className="gold-gradient btn-shine flex items-center gap-2.5 rounded-full px-9 py-4 text-[16px] font-bold text-midnight shadow-[0_14px_30px_-14px_rgba(217,154,11,0.8)] transition hover:-translate-y-0.5">
                    <LockOpen className="h-5 w-5" />
                    Unlock my estimate
                  </button>
                  <p className="flex items-center gap-2 text-[13px] text-body">
                    <Check className="h-4 w-4 text-[#0f7d46]" />
                    Free to use. No payment. No obligation.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* 02 activities */}
          <div id="calc-step-2" className={sectionCls(2)} aria-disabled={!reach(2)}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[14px] font-extrabold tracking-widest text-navy">02</span>
                <h2 className={stepTitle}>Choose your business activities</h2>
              </div>
              {step <= 2 && (
                <button
                  type="button"
                  disabled={!picked.length}
                  onClick={() => advance(3)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition ${picked.length ? "bg-navy text-white hover:bg-slate-accent" : "bg-navy/10 text-navy/70"}`}
                >
                  {picked.length ? "Next: Company details" : "Pick an activity first"} <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed">
              Choose any {calc.includedGroups} business activity groups from a pool of {ACTIVITY_COUNT.toLocaleString("en-US")} activities. Mix and match activities from different groups freely!
            </p>

            <p className="mt-8 text-[15px] font-bold text-heading">Browse activities</p>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-body" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShown(40);
                }}
                placeholder="Explore business activity groups"
                aria-label="Search activities"
                className="w-full rounded-2xl border border-heading/30 bg-white py-4 pl-14 pr-5 text-[16px] outline-none focus:border-navy"
              />
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-body">
              Not sure your preferred trade name is available? Check our{" "}
              <Link href="/name-check" className="font-semibold text-navy underline underline-offset-4">Company Name Check</Link> tool. Browse our{" "}
              <Link href="/business-activities" className="font-semibold text-navy underline underline-offset-4">complete list of business activities</Link>.
            </p>
            <hr className="my-6 border-line" />

            <div className="@container"><div className="grid overflow-hidden rounded-2xl border border-line @xl:grid-cols-[220px_1fr]">
              <ul className="max-h-[420px] space-y-1 overflow-y-auto border-b border-line p-3 @xl:border-b-0 @xl:border-r" role="tablist" aria-label="Activity groups">
                {buckets.map((b) => {
                  const Icon = b.icon;
                  const active = !query.trim() && bucket === b.id;
                  return (
                    <li key={b.id}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setBucket(b.id);
                          setQuery("");
                          setShown(40);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-navy/10" : "hover:bg-tint"}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-navy text-white" : "bg-navy/10 text-navy"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-bold leading-tight text-heading">{b.label}</span>
                          <span className="block text-[13px] text-body">{b.id === "Popular" ? "Most chosen" : b.id === "Regulated" ? `Needs approval · ${bucketCounts[b.id]}` : bucketCounts[b.id]}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="max-h-[420px] overflow-y-auto p-3">
                {listItems.length === 0 ? (
                  <p className="p-6 text-[15px]">No activities match “{query}”. Try fewer words.</p>
                ) : (
                  <ul className="space-y-3">
                    {listItems.slice(0, shown).map((a) => {
                      const on = picked.some((p) => p.id === a.id);
                      return (
                        <li key={a.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
                          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy sm:flex">
                            <Newspaper className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-bold leading-snug text-heading">{a.name.length > 90 ? `${a.name.slice(0, 88)}…` : a.name}</span>
                            <span className="block text-[13px] text-body">
                              Code {a.sub} · {a.type} licence{a.authority ? " · Needs approval" : ""}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => (on ? remove(a.id) : add(a))}
                            aria-pressed={on}
                            className={`shrink-0 rounded-xl border px-4 py-2 text-[14px] font-bold transition ${on ? "border-[#0f7d46] bg-[#0f7d46]/10 text-[#0f7d46]" : "border-navy text-navy hover:bg-navy hover:text-white"}`}
                          >
                            {on ? "Added ✓" : "Add +"}
                          </button>
                        </li>
                      );
                    })}
                    {listItems.length > shown && (
                      <li>
                        <button type="button" onClick={() => setShown((n) => n + 60)} className="w-full rounded-xl border border-line py-3 text-[14px] font-bold text-navy hover:border-navy">
                          Show more ({(listItems.length - shown).toLocaleString("en-US")} left)
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div></div>

            <button
              type="button"
              onClick={() => {
                setBucket("All");
                setQuery("");
                setShown(60);
              }}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-navy py-4 text-[15px] font-bold text-navy transition hover:bg-navy/5"
            >
              <ClipboardList className="h-5 w-5" />
              Browse all {ACTIVITY_COUNT.toLocaleString("en-US")} activities
            </button>

            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[15px] font-bold text-heading">Your chosen activities</p>
              <p className="text-[13px] text-body">
                {groupsUsed} {groupsUsed === 1 ? "group" : "groups"} · {Math.max(0, calc.includedGroups - groupsUsed)} more included
              </p>
            </div>
            {picked.length === 0 ? (
              <p className="mt-6 text-[14px] text-body">No activities selected. Search above to add your first activity.</p>
            ) : (
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
            )}
            {groupsUsed === calc.includedGroups && (
              <p className="mt-4 rounded-xl bg-navy/5 p-4 text-[14px] leading-relaxed text-heading">
                <strong>That is your last included group.</strong> Your {calc.includedGroups} largest groups come with the licence. Anything you add from a further group is charged at {aed(calc.extraGroupActivity)} per activity, shown as its own line on the estimate.
              </p>
            )}
            {groupsUsed > calc.includedGroups && (
              <p className="mt-4 rounded-xl bg-gold/10 p-4 text-[14px] leading-relaxed text-heading">
                <strong>You have gone past {calc.includedGroups} activity groups.</strong> That is fine: your {calc.includedGroups} largest groups stay included and each activity in the groups beyond them adds {aed(calc.extraGroupActivity)}. The estimate shows it as its own line.
              </p>
            )}
            {step <= 2 && (
              <button type="button" disabled={!picked.length} onClick={() => advance(3)} className={`${nextBtn} mt-8`}>
                {picked.length ? "Next: Company details ↓" : "Pick an activity first ↓"}
              </button>
            )}
          </div>

          {/* 03 structure */}
          <div id="calc-step-3" className={sectionCls(3)}>
            <div className="flex items-baseline gap-3">
              <span className="text-[14px] font-extrabold tracking-widest text-navy">03</span>
              <h2 className={stepTitle}>Company details</h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">Choose the structure that aligns with your goals.</p>

            <p className="mt-8 text-[15px] font-bold text-heading">No. of shareholders</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={shareholders === n}
                  onClick={() => setShareholders(n)}
                  className={`h-14 w-14 rounded-xl border text-[17px] font-bold transition ${shareholders === n ? "border-navy bg-navy text-white" : "border-navy/40 bg-white text-heading hover:border-navy"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={shareholders >= 6}
                onClick={() => setShareholders((n) => Math.max(6, n))}
                className={`h-14 min-w-[4.5rem] rounded-xl border px-4 text-[17px] font-bold transition ${shareholders >= 6 ? "border-navy bg-navy text-white" : "border-navy/40 bg-white text-heading hover:border-navy"}`}
              >
                6+
              </button>
            </div>
            {shareholders >= 6 && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="text-[14px] text-body">Total shareholders</span>
                <Stepper value={shareholders} onChange={setShareholders} min={6} max={calc.maxShareholders} name="shareholders" />
              </div>
            )}
            <p className="mt-4 text-[14px] leading-relaxed text-body">
              Add up to {calc.includedShareholders} shareholders at no additional cost. {aed(calc.extraShareholder)} per additional shareholder is applicable.
            </p>

            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[22px] font-bold text-heading">Licence validity</p>
              <p className="text-[14px] text-body">Enjoy long-term savings on annual renewal costs with a multi-year licence.</p>
            </div>
            <fieldset className="mt-5 min-w-0">
              <legend className="sr-only">Licence validity</legend>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4">
                {calc.terms.map((t, i) => {
                  const price = Math.round((annualLicence || minLicence) * t.years * (1 - t.discount / 100));
                  const on = termIndex === i;
                  return (
                    <button
                      key={t.years}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTermIndex(i)}
                      className={`w-[200px] shrink-0 snap-start rounded-2xl border p-5 text-left transition ${on ? "border-navy bg-navy/5 ring-2 ring-navy" : "border-navy/30 bg-white hover:border-navy"}`}
                    >
                      <span className="flex items-center justify-between">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${on ? "border-navy bg-navy text-white" : "border-navy/40"}`}>{on && <Check className="h-3.5 w-3.5" />}</span>
                        {t.discount > 0 && <span className="rounded-full bg-[#0f7d46]/10 px-3 py-1 text-[13px] font-bold text-[#0f7d46]">Save {t.discount}%</span>}
                      </span>
                      <span className="mt-4 block font-display text-[22px] font-bold text-heading">
                        {t.years} {t.years === 1 ? "year" : "years"}
                      </span>
                      <span className="block text-[14px] text-body">{t.discount ? "Locks today’s fees" : "Standard rate"}</span>
                      <span className="mt-3 block text-[18px] font-bold text-navy">{aed(price)}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p className="text-[14px] text-body">Looking for a different length? An adviser can price any term between 1 and 10 years.</p>
            <hr className="my-6 border-line" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[16px] font-bold text-heading">
                <Check className="h-5 w-5 text-[#0f7d46]" />
                {term.years} {term.years === 1 ? "year" : "years"} · {shareholders} {shareholders === 1 ? "shareholder" : "shareholders"}
              </p>
              {step <= 3 && (
                <button type="button" onClick={() => advance(4)} className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-[15px] font-bold text-white transition hover:bg-slate-accent">
                  Next: Visas <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 04 visas */}
          <div id="calc-step-4" className={sectionCls(4)}>
            <div className="flex items-baseline gap-3">
              <span className="text-[14px] font-extrabold tracking-widest text-navy">04</span>
              <h2 className={stepTitle}>Share your visa requirements</h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">Choose how many visas you need for yourself, your team and your dependants.</p>

            <p className="mt-8 text-[15px] font-bold text-heading">Do you need a residence visa?</p>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-navy/5 p-2">
              <button
                type="button"
                aria-pressed={needVisa}
                onClick={() => setNeedVisa(true)}
                className={`rounded-xl px-4 py-3 text-center transition ${needVisa ? "bg-navy text-white shadow-lg" : "text-body hover:bg-white"}`}
              >
                <span className="flex items-center justify-center gap-2 text-[16px] font-bold">
                  {needVisa && <Check className="h-4 w-4" />} Yes, I need visa(s)
                </span>
                <span className="block text-[12px] font-semibold">Visa fees apply per visa</span>
              </button>
              <button
                type="button"
                aria-pressed={!needVisa}
                onClick={() => setNeedVisa(false)}
                className={`rounded-xl px-4 py-3 text-center transition ${!needVisa ? "bg-navy text-white shadow-lg" : "text-body hover:bg-white"}`}
              >
                <span className="flex items-center justify-center gap-2 text-[16px] font-bold">
                  {!needVisa && <Check className="h-4 w-4" />} No, licence only
                </span>
                <span className={`block text-[12px] font-semibold ${!needVisa ? "text-white/80" : "text-[#0f7d46]"}`}>No visa or immigration fees apply</span>
              </button>
            </div>

            {needVisa && (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-dashed border-heading/25 bg-tint/60 p-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <Building2 className="h-5 w-5 text-body" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold text-heading">Establishment card and e-channel</p>
                      <p className="text-[13px] text-body">These charges only apply if you need visas.</p>
                    </div>
                    <p className="text-[17px] font-bold text-heading">{aed(calc.visa.establishmentCard + calc.visa.eChannel)}</p>
                    <button type="button" onClick={() => setShowFees((v) => !v)} aria-expanded={showFees} className="flex items-center gap-1 text-[14px] font-bold text-navy">
                      {showFees ? "Hide" : "View"} breakdown <ChevronDown className={`h-4 w-4 transition ${showFees ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {showFees && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-line bg-white p-4">
                        <p className="text-[12px] font-extrabold uppercase tracking-widest text-navy">Establishment card</p>
                        <p className="mt-1 text-[17px] font-bold text-heading">{aed(calc.visa.establishmentCard)}</p>
                      </div>
                      <div className="rounded-xl border border-line bg-white p-4">
                        <p className="text-[12px] font-extrabold uppercase tracking-widest text-navy">E-channel registration</p>
                        <p className="mt-1 text-[17px] font-bold text-heading">{aed(calc.visa.eChannel)}</p>
                      </div>
                    </div>
                  )}
                </div>
                {(
                  [
                    ["Investor / partner visa", investor, setInvestor, investorVisaTotal, "visas", IdCard, false],
                    ["Employee visa", employee, setEmployee, employeeVisaTotal, "employee visas", ScanFace, false],
                    ["Change of status", statusChange, setStatusChange, calc.visa.changeOfStatus, "status changes", ArrowLeftRight, true],
                  ] as const
                ).map(([name, value, set, price, unit, Icon, dashed]) => (
                  <div key={name} className={`flex flex-wrap items-center gap-4 rounded-2xl border p-5 ${dashed ? "border-dashed border-heading/25 bg-tint/60" : "border-line bg-white"}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dashed ? "text-body" : "bg-navy/10 text-navy"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold text-heading">{name}</p>
                      <p className="text-[13px] text-body">
                        {aed(price)} each{name === "Change of status" ? ". Required if you are already in the UAE." : ", including visa allocation, Emirates ID and medical test"}
                      </p>
                    </div>
                    <Stepper value={value} onChange={set} max={calc.visa.maxEach} name={unit} />
                  </div>
                ))}
                <p className="text-[13px] leading-relaxed text-body">Health insurance is not included.</p>
                <p className="pt-2 text-[14px]">
                  Need your visa faster?{" "}
                  <Link href="/book-appointment" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                    Speak to an adviser
                  </Link>
                  .
                </p>
              </div>
            )}
            <hr className="my-6 border-line" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-start gap-2 text-[16px] font-bold text-heading">
                <Check className="mt-0.5 h-5 w-5 text-[#0f7d46]" />
                <span>
                  {needVisa && investor + employee + statusChange > 0 ? `${investor + employee} ${investor + employee === 1 ? "visa" : "visas"} added` : "No visas added"}
                  <span className="block text-[14px] font-normal text-body">Scroll down, you’re almost done!</span>
                </span>
              </p>
              {step <= 4 && (
                <button type="button" onClick={() => advance(5)} className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-[15px] font-bold text-white transition hover:bg-slate-accent">
                  Next: Extras <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 05 extras */}
          <div id="calc-step-5" className={sectionCls(5)}>
            <div className="flex items-baseline gap-3">
              <span className="text-[14px] font-extrabold tracking-widest text-navy">05</span>
              <h2 className={stepTitle}>Value-added services</h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">Optional concierge services to help you launch faster.</p>

            <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {[
                { icon: Landmark, title: "Business bank account opening assistance", badge: "Popular", tone: "bg-gold/20 text-bronze", text: "Help opening a corporate bank account. Not included in the licence. Personal bank account assistance is free.", price: calc.extras.bank, on: bank, toggle: () => setBank((v) => !v) },
                {
                  icon: Receipt,
                  title: "Corporate tax startup package",
                  badge: "Recommended",
                  tone: "bg-navy/10 text-navy",
                  bullets: ["Corporate tax registration", "Bookkeeping for a first set of transactions", "Profit and loss, balance sheet and cash flow statements", "Confirmation of corporate tax filing"],
                  price: calc.extras.taxPackage,
                  on: taxPackage,
                  toggle: () => setTaxPackage((v) => !v),
                },
                { icon: Stamp, title: "Company stamp", text: "Commonly requested by banks and government entities.", price: calc.extras.stamp, on: stamp, toggle: () => setStamp((v) => !v) },
                { icon: Percent, title: "VAT registration", text: "Mandatory once your turnover passes the VAT threshold.", price: calc.extras.vat, on: vat, toggle: () => setVat((v) => !v) },
                {
                  icon: PhoneCall,
                  title: "Virtual receptionist",
                  text: "A dedicated UAE landline and a virtual assistant to answer your calls.",
                  price: calc.extras.receptionistPerYear,
                  per: "per year",
                  on: receptionist > 0,
                  toggle: () => setReceptionist((v) => (v > 0 ? 0 : 1)),
                  stepper: (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[14px]">
                      For how many years?
                      <Stepper value={receptionist} onChange={setReceptionist} min={1} max={10} name="years" />
                    </div>
                  ),
                },
                {
                  icon: Users,
                  title: "Dependent visa",
                  text: "For spouses, children or parents you wish to sponsor.",
                  price: calc.extras.dependentVisa,
                  on: dependents > 0,
                  toggle: () => setDependents((v) => (v > 0 ? 0 : 1)),
                  stepper: (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[14px]">
                      How many?
                      <Stepper value={dependents} onChange={setDependents} min={1} max={10} name="dependent visas" />
                    </div>
                  ),
                },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.title} className="flex items-start gap-4 bg-white p-5 sm:p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-bold leading-snug text-heading">
                        {r.title}
                        {r.badge && <span className={`ml-3 rounded-full px-3 py-0.5 align-middle text-[12px] font-bold ${r.tone}`}>{r.badge}</span>}
                      </p>
                      {r.text && <p className="mt-1 text-[14px] leading-relaxed text-body">{r.text}</p>}
                      {r.bullets && (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-body">
                          {r.bullets.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      )}
                      {r.on && r.stepper}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[17px] font-bold text-heading">{aed(r.price)}</p>
                      {r.per && <p className="text-[12px] text-body">{r.per}</p>}
                    </div>
                    <Switch on={r.on} onClick={r.toggle} label={`Add ${r.title}`} />
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[14px] leading-relaxed text-body">We strongly recommend selecting the services that keep your company compliant and running smoothly.</p>
            {step <= 5 && (
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={() => advance(6)} className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-[15px] font-bold text-white transition hover:bg-slate-accent">
                  See my total estimate <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* 06 final quote */}
          <div id="calc-step-6" className={`${sectionCls(6)} !p-0 overflow-hidden`}>
            <div className="bg-[#06132a] p-7 text-white sm:p-10">
              <div className="flex items-baseline gap-3">
                <span className="text-[14px] font-extrabold tracking-widest text-gold-light">06</span>
                <h2 className="font-display text-[26px] font-bold">Your total estimate</h2>
              </div>
              <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] text-white/70">Your estimated business setup cost</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-4 font-display text-[44px] font-bold leading-none sm:text-[56px]">
                {aed(total)} <span className="text-[15px] font-normal text-white/70">All selections included.</span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[14px]">
                <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white/70">
                  Activities <strong className="ml-1 text-white">{picked.length} selected</strong>
                </span>
                <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white/70">
                  Licence <strong className="ml-1 text-white">{term.years} {term.years === 1 ? "year" : "years"}</strong>
                </span>
                <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white/70">
                  Shareholders <strong className="ml-1 text-white">{shareholders}</strong>
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <p className="font-display text-[22px] font-bold text-heading">Cost breakdown</p>
              <div className="mt-4 space-y-3">
                {breakdown.map((g) => (
                  <details key={g.name} open className="group rounded-2xl border border-line">
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <ChevronDown className="h-4 w-4 text-body transition group-open:rotate-0 -rotate-90" />
                      <span className="flex-1 text-[16px] font-bold text-heading">
                        {g.name}
                        {g.name === "Business licence" && <span className="ml-3 rounded-full bg-tint px-3 py-0.5 text-[12px] font-bold text-body">{term.years} {term.years === 1 ? "year" : "years"}</span>}
                      </span>
                      <span className="text-[16px] font-bold text-heading">{aed(g.total)}</span>
                    </summary>
                    <ul className="space-y-2 border-t border-line px-5 py-4 text-[15px]">
                      {g.items.map((l) => (
                        <li key={l.label} className="flex justify-between gap-4">
                          <span>{l.label}</span>
                          <span className={l.amount < 0 ? "text-[#0f7d46]" : ""}>{l.amount < 0 ? `− ${aed(-l.amount)}` : aed(l.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#06132a] px-6 py-5 text-white">
                <span className="text-[16px] font-bold">Estimated total</span>
                <span className="font-display text-[26px] font-bold">{aed(total)}</span>
              </div>
              <p className="mt-6 text-[15px]">
                Prefer to split your costs? Explore our{" "}
                <Link href="/pay-as-you-go" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">
                  pay-as-you-go
                </Link>{" "}
                option.
              </p>
              <p className="mt-6 rounded-xl border-l-4 border-navy bg-navy/5 p-4 text-[14px] leading-relaxed text-heading">
                The quoted amount is an estimate based on your selections. The final amount is confirmed by your business setup adviser before any payment is made. Government fees are subject to change without prior notice.
              </p>

              {status === "sent" ? (
                <div role="status" className="mt-6 rounded-xl bg-[#0f7d46]/10 p-4 text-[15px] leading-relaxed text-heading">
                  <p className="font-bold">On its way.</p>
                  We have your selections and will email you the full breakdown. An adviser will follow up shortly.
                  <Link href="/company-registration" className="gold-gradient btn-shine mt-4 flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight">
                    Continue to the registration form <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-2 text-[13px] text-body">Your activities, visas and contact details are filled in for you.</p>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap items-center gap-3 print:hidden">
                  <button
                    type="button"
                    onClick={emailQuote}
                    disabled={!unlocked || picked.length === 0 || sending}
                    className="flex items-center gap-2 rounded-full bg-navy px-8 py-4 text-[15px] font-bold text-white transition hover:bg-slate-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {sending ? "Sending..." : "Email me this quote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    disabled={picked.length === 0}
                    className="flex items-center gap-2 rounded-full border border-navy px-7 py-4 text-[15px] font-bold text-navy transition hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FileDown className="h-4 w-4" />
                    Save as PDF
                  </button>
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
          </div>

          <div className="lg:hidden">{summary}</div>
        </div>

        <div className="hidden lg:block">{summary}</div>
      </div>
      <div className="quote-sheet hidden print:block" aria-hidden>
        {/* header band */}
        <div style={{ background: "linear-gradient(110deg,#022364 0%,#063798 60%,#0b52d6 100%)" }} className="relative overflow-hidden px-10 pb-8 pt-8 text-white">
          <div style={{ background: "radial-gradient(circle,rgba(255,198,61,.35),transparent 70%)" }} className="absolute -right-16 -top-20 h-64 w-64 rounded-full" />
          <div className="relative flex items-center justify-between">
            <Image src={LOGO_LIGHT.src} alt="Workdane Management Consultancy" width={LOGO_LIGHT.width} height={LOGO_LIGHT.height} className="h-24 w-auto" />
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#ffc63d" }}>Business setup</p>
              <p className="text-[30px] font-bold leading-tight">Quotation</p>
              <p className="mt-1 text-[12px] opacity-80">Ref {quoteRef || "WQ"} · {today}</p>
            </div>
          </div>
        </div>
        <div style={{ height: 5, background: "linear-gradient(90deg,#ffc63d,#d99a0b)" }} />

        <div className="px-10 pb-8 pt-7 text-[#0b1730]">
          {/* parties */}
          <div className="grid grid-cols-2 gap-6">
            <div style={{ border: "1px solid #dbe3f3", background: "#f6f8fd" }} className="rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "#07399d" }}>Prepared for</p>
              <p className="mt-2 text-[17px] font-bold">{details.name}</p>
              <p className="mt-1 text-[12px]" style={{ color: "#4b5563" }}>{details.email}</p>
              <p className="text-[12px]" style={{ color: "#4b5563" }}>{fullPhone(details.dial, details.phone)}</p>
              {details.nationality && <p className="text-[12px]" style={{ color: "#4b5563" }}>{details.nationality}</p>}
            </div>
            <div style={{ border: "1px solid #dbe3f3" }} className="rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "#07399d" }}>Prepared by</p>
              <p className="mt-2 text-[17px] font-bold">Workdane Management Consultancy</p>
              <p className="mt-1 text-[12px]" style={{ color: "#4b5563" }}>{CONTACT.phone}</p>
              <p className="text-[12px]" style={{ color: "#4b5563" }}>{CONTACT.email}</p>
            </div>
          </div>

          {/* headline total */}
          <div style={{ background: "linear-gradient(110deg,#eef3ff,#fff7e0)", border: "1px solid #dbe3f3" }} className="mt-6 flex items-end justify-between rounded-2xl px-7 py-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: "#07399d" }}>Your estimated business setup cost</p>
              <p className="mt-1 text-[40px] font-bold leading-none" style={{ color: "#07399d" }}>{aed(total)}</p>
              <p className="mt-1 text-[11px]" style={{ color: "#6b7280" }}>All selections included</p>
            </div>
            <div className="flex gap-3 text-[11px]">
              {[
                ["Activities", `${picked.length}`],
                ["Licence", `${term.years} ${term.years === 1 ? "year" : "years"}`],
                ["Shareholders", `${shareholders}`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "#fff", border: "1px solid #dbe3f3" }} className="rounded-lg px-3 py-2 text-center">
                  <p style={{ color: "#6b7280" }}>{k}</p>
                  <p className="text-[15px] font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* activities */}
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#07399d" }}>Your selected activities</p>
          <div className="mt-2" style={{ borderTop: "2px solid #07399d" }}>
            {picked.map((p) => (
              <div key={p.id} className="flex gap-4 py-1.5 text-[12px]" style={{ borderBottom: "1px solid #e5e7eb" }}>
                <span className="w-16 shrink-0 font-bold" style={{ color: "#8f5a00" }}>{p.sub}</span>
                <span className="flex-1">{p.name}</span>
                {p.authority && <span className="shrink-0 text-[10px] font-bold uppercase" style={{ color: "#8f5a00" }}>Approval needed</span>}
              </div>
            ))}
          </div>

          {/* breakdown */}
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#07399d" }}>Cost breakdown</p>
          <div className="mt-2" style={{ borderTop: "2px solid #07399d" }}>
            {breakdown.map((g) => (
              <div key={g.name} className="break-inside-avoid">
                <div className="flex justify-between px-3 py-2 text-[13px] font-bold" style={{ background: "#f1f4fb" }}>
                  <span>{g.name}</span>
                  <span>{aed(g.total)}</span>
                </div>
                {g.items.map((l) => (
                  <div key={l.label} className="flex justify-between px-3 py-1.5 text-[12px]" style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <span>{l.label}</span>
                    <span style={{ color: l.amount < 0 ? "#0f7d46" : undefined }}>{l.amount < 0 ? `− ${aed(-l.amount)}` : aed(l.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ background: "linear-gradient(110deg,#022364,#063798)" }} className="mt-4 flex items-center justify-between rounded-xl px-6 py-4 text-white">
            <span className="text-[14px] font-bold">Estimated total</span>
            <span className="text-[24px] font-bold">{aed(total)}</span>
          </div>

          {/* next steps */}
          <div className="mt-7 grid grid-cols-3 gap-4 break-inside-avoid">
            {[
              ["1", "Review", "Check this estimate and tell us what to change."],
              ["2", "Confirm", "An adviser confirms your activities and requirements, then sends a written quotation."],
              ["3", "Start", "Approve the quotation and we begin your application."],
            ].map(([n, t, d]) => (
              <div key={n} style={{ border: "1px solid #dbe3f3" }} className="rounded-xl p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ background: "#07399d" }}>{n}</span>
                <p className="mt-2 text-[13px] font-bold">{t}</p>
                <p className="mt-1 text-[11px] leading-snug" style={{ color: "#4b5563" }}>{d}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[10px] leading-relaxed" style={{ color: "#6b7280" }}>
            {INDICATIVE_NOTE} The quoted amount is an estimate based on your selections. The final amount is confirmed by your business setup adviser before any payment is made. Government fees are subject to change without prior notice.
          </p>
        </div>

        {/* footer */}
        <div style={{ borderTop: "3px solid #ffc63d", background: "#022364" }} className="px-10 py-4 text-[10px] leading-relaxed text-white">
          <div className="flex justify-between gap-6">
            <div>
              <p className="font-bold">{CONTACT.legalName}</p>
              <p style={{ opacity: 0.8 }}>Business licence no. {CONTACT.licenceNo}</p>
            </div>
            {OFFICES.map((o) => (
              <div key={o.name} style={{ opacity: 0.85 }}>
                <p className="font-bold" style={{ color: "#ffc63d" }}>{o.name} office</p>
                <p>{o.lines.slice(0, 2).join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
