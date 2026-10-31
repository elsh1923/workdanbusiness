"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Check, CircleAlert, FileCheck2, FileUp, Loader2, Minus, Plus, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import { countries } from "@/lib/countries";
import {
  AUTHORITY,
  CONSULTANT,
  CRIME_OPTIONS,
  NONE_CRIME,
  NONE_PEP,
  DRAFT_KEY,
  FILE_SLOTS,
  MAX_SHAREHOLDERS,
  PEP_OPTIONS,
  PREFILL_KEY,
  ROLES,
  holderNumber,
  questionNumber,
  WEALTH_SOURCES,
  emptyShareholder,
  isFullName,
  FULL_NAME_MESSAGE,
  type FileKey,
  type Prefill,
  type RegistrationData,
} from "@/lib/registration";

const input =
  "w-full rounded-xl border border-heading/20 bg-white px-4 py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-navy focus:ring-2 focus:ring-navy/15 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/15";
const labelCls = "mb-1.5 block text-[13px] font-bold text-heading";
const card = "rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(12,42,85,0.35)] sm:p-9";

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Shareholders", icon: UserRound },
  { id: 3, label: "Business", icon: FileCheck2 },
  { id: 4, label: "Declarations", icon: ShieldCheck },
] as const;

const blank = (): RegistrationData => ({
  authority: AUTHORITY,
  consultant: CONSULTANT,
  names: ["", "", ""],
  investorVisas: "0",
  employeeVisas: "0",
  activities: Array.from({ length: 5 }, () => ({ code: "", name: "" })),
  shareholders: [{ ...emptyShareholder(), percent: "100" }],
  turnover: "",
  experience: "",
  businessDescription: "",
  targetCountries: "",
  paymentFromCustomers: "",
  paymentToSuppliers: "",
  otherLicence: "",
  otherLicenceDetails: "",
  crime: [],
  crimeOther: "",
  pep: [],
  wealth: [],
  wealthOther: "",
  declaration: false,
});

const bytes = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const MAX_FILE = 6 * 1024 * 1024;

// Shrinks big photos so a full set of documents stays small enough to send.
async function prepare(file: File): Promise<File> {
  // WebP is converted too, because the combined PDF can only embed JPG and PNG.
  if (!file.type.startsWith("image/") || (file.type !== "image/webp" && file.size < 700 * 1024)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (blob && blob.size < file.size) return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {}
  return file;
}

function Field({ id, label, error, hint, children, className = "" }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className} data-field={id}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-body">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-red-600">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function Pills({ options, value, onChange, multi, invalid, id }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; invalid?: boolean; id: string }) {
  return (
    <div id={id} role={multi ? "group" : "radiogroup"} className={`flex flex-wrap gap-2.5 ${invalid ? "rounded-xl ring-2 ring-red-500/30 ring-offset-4" : ""}`}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : [o])}
            className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-left text-[14px] font-semibold transition ${on ? "border-navy bg-navy text-white" : "border-heading/20 bg-white text-heading hover:border-navy"}`}
          >
            {on && <Check className="h-4 w-4 shrink-0" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function FileField({ id, label, hint, required, file, error, onPick, onClear }: { id: string; label: string; hint: string; required: boolean; file?: File; error?: string; onPick: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div data-field={id}>
      <p className={labelCls}>
        {label}
        {required ? " *" : " (optional)"}
      </p>
      <input
        ref={ref}
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#0f7d46]/40 bg-[#0f7d46]/5 px-4 py-3">
          <FileCheck2 className="h-5 w-5 shrink-0 text-[#0f7d46]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-heading">{file.name}</p>
            <p className="text-[12px] text-body">{bytes(file.size)}</p>
          </div>
          <button type="button" onClick={onClear} aria-label={`Remove ${label}`} className="text-body hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-left transition hover:border-navy hover:bg-navy/5 ${error ? "border-red-500" : "border-heading/25"}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
            <FileUp className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[14px] font-bold text-navy">Choose a file</span>
            <span className="block text-[12px] text-body">{hint} · PDF, JPG or PNG</span>
          </span>
        </button>
      )}
      {error && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export default function RegistrationForm() {
  const [data, setData] = useState<RegistrationData>(blank);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [ref, setRef] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [ready, setReady] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  // Start from the draft if there is one, otherwise from what the visitor chose in the calculator.
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const d = JSON.parse(draft) as RegistrationData;
        setData({ ...blank(), ...d });
      } else {
        const p = JSON.parse(localStorage.getItem(PREFILL_KEY) ?? "null") as Prefill | null;
        if (p) {
          const n = Math.min(MAX_SHAREHOLDERS, Math.max(1, p.shareholders || 1));
          const acts = p.activities.slice(0, 10).map((a) => ({ code: a.code, name: a.name }));
          while (acts.length < 5) acts.push({ code: "", name: "" });
          const holders = Array.from({ length: n }, () => emptyShareholder());
          holders[0] = { ...holders[0], fullName: p.name, email: p.email, phone: `${p.dial} ${p.phone}`.trim(), nationality: p.nationality, percent: n === 1 ? "100" : "" };
          setData({ ...blank(), activities: acts, shareholders: holders, investorVisas: String(p.investorVisas), employeeVisas: String(p.employeeVisas) });
          setPrefilled(true);
        }
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || status === "sent") return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [data, ready, status]);

  const set = <K extends keyof RegistrationData>(k: K, v: RegistrationData[K]) => setData((d) => ({ ...d, [k]: v }));
  const setHolder = (i: number, patch: Partial<RegistrationData["shareholders"][number]>) =>
    setData((d) => ({ ...d, shareholders: d.shareholders.map((h, j) => (j === i ? { ...h, ...patch } : h)) }));
  const clearErr = (id: string) =>
    setErrors((e) => {
      if (!(id in e)) return e;
      const { [id]: _drop, ...rest } = e;
      void _drop;
      return rest;
    });

  const setCount = (n: number) => {
    const count = Math.min(MAX_SHAREHOLDERS, Math.max(1, n));
    setData((d) => {
      const list = d.shareholders.slice(0, count);
      while (list.length < count) list.push(emptyShareholder());
      if (count === 1) list[0] = { ...list[0], percent: "100" };
      else if (list[0].percent === "100") list[0] = { ...list[0], percent: "" };
      return { ...d, shareholders: list };
    });
    setFiles((f) => Object.fromEntries(Object.entries(f).filter(([k]) => Number(k.match(/^sh(\d+)_/)?.[1]) < count)));
  };

  const splitEqually = () => {
    const n = data.shareholders.length;
    const base = Math.floor((100 / n) * 100) / 100;
    setData((d) => ({ ...d, shareholders: d.shareholders.map((h, i) => ({ ...h, percent: String(i === 0 ? +(100 - base * (n - 1)).toFixed(2) : base) })) }));
    setErrors((e) => ({ ...e, "percent-total": "" }));
  };

  const total = useMemo(() => data.shareholders.reduce((t, h) => t + (parseFloat(h.percent) || 0), 0), [data.shareholders]);

  const pick = async (key: string, f: File) => {
    clearErr(key);
    const ready = await prepare(f);
    if (ready.size > MAX_FILE) {
      setErrors((e) => ({ ...e, [key]: "This file is larger than 6 MB. Please upload a smaller one." }));
      return;
    }
    setFiles((x) => ({ ...x, [key]: ready }));
  };

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    const need = (id: string, v: string, msg: string) => {
      if (!v.trim()) e[id] = msg;
    };
    if (s === 1) {
      data.names.forEach((n, i) => need(`name-${i}`, n, "Please give a company name"));
      if (!data.activities.some((a) => a.name.trim())) e["act-0"] = "Add at least one business activity";
    }
    if (s === 2) {
      data.shareholders.forEach((h, i) => {
        const p = `sh-${i}-`;
        if (!h.roles.length) e[`${p}roles`] = "Choose at least one role";
        need(`${p}percent`, h.percent, "Required");
        need(`${p}fullName`, h.fullName, "Required");
        if (h.fullName.trim() && !isFullName(h.fullName)) e[`${p}fullName`] = FULL_NAME_MESSAGE;
        need(`${p}phone`, h.phone, "Required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(h.email)) e[`${p}email`] = "Enter a valid email";
        need(`${p}address`, h.address, "Required");
        need(`${p}fatherName`, h.fatherName, "Required");
        if (h.fatherName.trim() && !isFullName(h.fatherName)) e[`${p}fatherName`] = FULL_NAME_MESSAGE;
        if (h.motherName.trim() && !isFullName(h.motherName)) e[`${p}motherName`] = FULL_NAME_MESSAGE;
        need(`${p}passportNo`, h.passportNo, "Required");
        need(`${p}nationality`, h.nationality, "Required");
        need(`${p}passportExpiry`, h.passportExpiry, "Required");
        if (!h.uaeResident) e[`${p}uaeResident`] = "Please choose";
        FILE_SLOTS.forEach((slot) => {
          if (slot.required && !files[`sh${i}_${slot.key}`]) e[`sh${i}_${slot.key}`] = "Please upload this document";
        });
      });
      if (Math.abs(total - 100) > 0.01) e["percent-total"] = `The percentages add up to ${+total.toFixed(2)}%. They must add up to 100%.`;
    }
    if (s === 3) {
      need("businessDescription", data.businessDescription, "Please describe your intended business");
      need("paymentFromCustomers", data.paymentFromCustomers, "Required");
      need("paymentToSuppliers", data.paymentToSuppliers, "Required");
    }
    if (s === 4) {
      if (!data.otherLicence) e["otherLicence"] = "Please choose";
      if (!data.crime.length) e["crime"] = "Please choose an option";
      if (!data.pep.length) e["pep"] = "Please choose an option";
      if (!data.wealth.length) e["wealth"] = "Choose at least one source";
      if (!data.declaration) e["declaration"] = "Please confirm the declaration";
    }
    return e;
  };

  const focusFirst = (e: Record<string, string>) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    setTimeout(() => (document.querySelector(`[data-field="${first}"]`) ?? document.getElementById(first))?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setStep((s) => s + 1);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async () => {
    for (let s = 1; s <= 4; s++) {
      const e = validate(s);
      if (Object.keys(e).length) {
        setStep(s);
        setErrors(e);
        return focusFirst(e);
      }
    }
    setStatus("sending");
    setServerMsg("");
    const fd = new FormData();
    fd.set("data", JSON.stringify({ ...data, activities: data.activities.filter((a) => a.name.trim()) }));
    fd.set("website", "");
    Object.entries(files).forEach(([k, f]) => fd.set(k, f));
    try {
      const res = await fetch("/api/registration", { method: "POST", body: fd });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; ref?: string };
      if (res.ok && j.ok) {
        setRef(j.ref ?? "");
        setStatus("sent");
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      setServerMsg(j.message || "Something went wrong. Please try again.");
    } catch {
      setServerMsg("We could not reach the server. Check your connection and try again.");
    }
    setStatus("error");
  };

  const qn = (b: number) => questionNumber(b);
  const errCount = Object.values(errors).filter(Boolean).length;

  if (status === "sent") {
    return (
      <section ref={top} className="bg-tint px-6 py-20 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 text-center shadow-xl sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0f7d46]/10 text-[#0f7d46]">
            <Check className="h-8 w-8" />
          </span>
          <h2 className="mt-6 font-display text-[30px] font-bold text-heading">Your form has been sent</h2>
          {ref && <p className="mt-2 text-[14px] font-bold tracking-wider text-bronze">Reference {ref}</p>}
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed">Thank you. Our team will review your details and documents and contact you about the next steps. Keep your reference number.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink(`Hello Workdane, I submitted my company registration form (${ref}).`)} target="_blank" rel="noreferrer" className="rounded-full bg-[#0f7d46] px-6 py-3.5 text-[15px] font-bold text-white">
              Message us on WhatsApp
            </a>
            <Link href="/home" className="rounded-full border border-heading/25 px-6 py-3.5 text-[15px] font-bold text-heading hover:border-navy">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={top} className="scroll-mt-24 bg-tint px-6 py-14 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-[1040px]">
        {/* stepper */}
        <ol className="mb-8 grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const current = step === s.id;
            return (
              <li key={s.id} className="relative">
                <div className={`flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left ${done || current ? "" : "opacity-60"}`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${done ? "bg-[#0f7d46] text-white" : current ? "bg-navy text-white ring-4 ring-navy/15" : "bg-white text-body ring-1 ring-line"}`}>
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-widest text-body">Step {s.id}</span>
                    <span className="block text-[14px] font-bold text-heading sm:text-[15px]">{s.label}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {prefilled && step === 1 && (
          <p className="mb-6 flex items-start gap-3 rounded-2xl border border-navy/20 bg-navy/5 p-4 text-[14px] leading-relaxed">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
            We filled in the activities, visas and your contact details from your quote. Check them and complete the rest. Your progress is saved on this device.
          </p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className={card}>
            <h2 className="font-display text-[26px] font-bold text-heading">Company details</h2>
            <p className="mt-2 text-[15px] leading-relaxed">Tell us what your company will be called and what it will do.</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field id="authority" label="1. Registration authority">
                <input id="authority" value={data.authority} readOnly className={`${input} bg-tint`} />
              </Field>
              <Field id="consultant" label="2. Business consultant name">
                <input id="consultant" value={data.consultant} readOnly className={`${input} bg-tint`} />
              </Field>
            </div>

            <h3 className="mt-10 font-display text-[19px] font-bold text-heading">3. Company name options *</h3>
            <p className="mt-1 text-[14px] text-body">Give three names in order of preference. We check them with the authority.</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              {data.names.map((n, i) => (
                <Field key={i} id={`name-${i}`} label={`Option ${i + 1}`} error={errors[`name-${i}`]}>
                  <input
                    id={`name-${i}`}
                    value={n}
                    maxLength={120}
                    aria-invalid={!!errors[`name-${i}`]}
                    onChange={(e) => {
                      set("names", data.names.map((x, j) => (j === i ? e.target.value : x)) as RegistrationData["names"]);
                      clearErr(`name-${i}`);
                    }}
                    className={input}
                  />
                </Field>
              ))}
            </div>

            <h3 className="mt-10 font-display text-[19px] font-bold text-heading">4. Number of visas *</h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {([["investorVisas", "Investor / partner visas"], ["employeeVisas", "Employment visas"]] as const).map(([k, l]) => (
                <div key={k}>
                  <p className={labelCls}>{l}</p>
                  <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2 py-1.5">
                    <button type="button" aria-label={`Fewer ${l}`} onClick={() => set(k, String(Math.max(0, (+data[k] || 0) - 1)))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-tint">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-[17px] font-bold">{data[k]}</span>
                    <button type="button" aria-label={`More ${l}`} onClick={() => set(k, String(Math.min(20, (+data[k] || 0) + 1)))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-tint">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[14px] text-body">Total number of visas: <strong className="text-heading">{(parseInt(data.investorVisas, 10) || 0) + (parseInt(data.employeeVisas, 10) || 0)}</strong></p>

            <h3 className="mt-10 font-display text-[19px] font-bold text-heading">5. Business activities including codes</h3>
            <p className="mt-1 text-[14px] text-body">Give each activity with its code. Additional activities are chargeable.</p>
            {errors["act-0"] && (
              <p data-field="act-0" role="alert" className="mt-2 text-[13px] font-semibold text-red-600">
                {errors["act-0"]}
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {data.activities.map((a, i) => (
                <li key={i} className="grid gap-3 sm:grid-cols-[130px_1fr_auto]">
                  <input
                    aria-label={`Activity ${i + 1} code`}
                    placeholder="Code"
                    value={a.code}
                    maxLength={20}
                    onChange={(e) => set("activities", data.activities.map((x, j) => (j === i ? { ...x, code: e.target.value } : x)))}
                    className={input}
                  />
                  <input
                    aria-label={`Business activity ${i + 1}`}
                    placeholder={`Business activity ${i + 1}`}
                    value={a.name}
                    maxLength={200}
                    onChange={(e) => {
                      set("activities", data.activities.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)));
                      clearErr("act-0");
                    }}
                    className={input}
                  />
                  {i >= 5 ? (
                    <button type="button" aria-label="Remove activity" onClick={() => set("activities", data.activities.filter((_, j) => j !== i))} className="px-2 text-body hover:text-red-600">
                      <X className="h-5 w-5" />
                    </button>
                  ) : (
                    <span className="hidden w-5 sm:block" />
                  )}
                </li>
              ))}
            </ul>
            {data.activities.length < 10 && (
              <button type="button" onClick={() => set("activities", [...data.activities, { code: "", name: "" }])} className="mt-4 flex items-center gap-2 text-[14px] font-bold text-navy">
                <Plus className="h-4 w-4" /> Add another activity (chargeable)
              </button>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className={card}>
              <h2 className="font-display text-[26px] font-bold text-heading">{holderNumber()}. Share holders</h2>
              <p className="mt-2 text-[15px] leading-relaxed">Add every shareholder. You can have up to {MAX_SHAREHOLDERS}. The percentages must add up to 100%.</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className={labelCls}>Number of shareholders</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: MAX_SHAREHOLDERS }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={data.shareholders.length === n}
                        onClick={() => setCount(n)}
                        className={`h-12 w-12 rounded-xl border text-[16px] font-bold transition ${data.shareholders.length === n ? "border-navy bg-navy text-white" : "border-navy/40 bg-white hover:border-navy"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {data.shareholders.length > 1 && (
                  <div data-field="percent-total" className="min-w-[220px]">
                    <div className="flex items-baseline justify-between text-[14px]">
                      <span className="font-bold text-heading">Total shareholding</span>
                      <span className={`font-bold ${Math.abs(total - 100) < 0.01 ? "text-[#0f7d46]" : "text-bronze"}`}>{+total.toFixed(2)}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                      <div className={`h-full rounded-full transition-all ${Math.abs(total - 100) < 0.01 ? "bg-[#0f7d46]" : total > 100 ? "bg-red-500" : "bg-gold"}`} style={{ width: `${Math.min(100, total)}%` }} />
                    </div>
                    <button type="button" onClick={splitEqually} className="mt-2 text-[13px] font-bold text-navy underline underline-offset-4">
                      Split equally
                    </button>
                    {errors["percent-total"] && <p role="alert" className="mt-1 text-[13px] font-semibold text-red-600">{errors["percent-total"]}</p>}
                  </div>
                )}
              </div>
            </div>

            {data.shareholders.map((h, i) => {
              const p = `sh-${i}-`;
              const er = (k: string) => errors[`${p}${k}`];
              const text = (k: keyof typeof h, label: string, opts: { type?: string; required?: boolean; autoComplete?: string; wide?: boolean; ph?: string } = {}) => (
                <Field id={`${p}${k}`} label={`${label}${opts.required === false ? "" : " *"}`} error={er(k)} className={opts.wide ? "sm:col-span-2" : ""}>
                  <input
                    id={`${p}${k}`}
                    type={opts.type ?? "text"}
                    value={h[k] as string}
                    maxLength={k === "address" ? 300 : 120}
                    autoComplete={opts.autoComplete}
                    placeholder={opts.ph}
                    aria-invalid={!!er(k)}
                    onChange={(e) => {
                      setHolder(i, { [k]: e.target.value } as Partial<typeof h>);
                      clearErr(`${p}${k}`);
                    }}
                    className={input}
                  />
                </Field>
              );
              return (
                <div key={i} className={card}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-[16px] font-bold text-white">{i + 1}</span>
                    <h3 className="font-display text-[22px] font-bold text-heading">Share holder {i + 1}</h3>
                  </div>

                  <div className="mt-6" data-field={`${p}roles`}>
                    <p className={labelCls}>Role * <span className="font-normal text-body">(choose all that apply)</span></p>
                    <Pills multi id={`${p}roles`} options={ROLES} value={h.roles} invalid={!!er("roles")} onChange={(v) => { setHolder(i, { roles: v }); clearErr(`${p}roles`); }} />
                    {er("roles") && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{er("roles")}</p>}
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field id={`${p}percent`} label="Shareholding percentage *" error={er("percent")} hint="From 100%">
                      <div className="relative">
                        <input
                          id={`${p}percent`}
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={100}
                          step="any"
                          disabled={data.shareholders.length === 1}
                          value={h.percent}
                          aria-invalid={!!er("percent")}
                          onChange={(e) => {
                            setHolder(i, { percent: e.target.value });
                            clearErr(`${p}percent`);
                            clearErr("percent-total");
                          }}
                          className={`${input} pr-10 disabled:bg-tint`}
                        />
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-body">%</span>
                      </div>
                    </Field>
                    {text("fullName", "Full name (as in passport)", { autoComplete: "name", ph: "First name and last name" })}
                    {text("phone", "Contact number", { type: "tel", autoComplete: "tel", ph: "+971 5X XXX XXXX" })}
                    {text("email", "Email", { type: "email", autoComplete: "email" })}
                    {text("address", "Home address", { wide: true })}
                    {text("fatherName", "Father’s full name", { ph: "First name and last name" })}
                    {text("motherName", "Mother’s full name", { required: false, ph: "First name and last name" })}
                    {text("passportNo", "Passport number")}
                    <Field id={`${p}nationality`} label="Nationality *" error={er("nationality")}>
                      <select
                        id={`${p}nationality`}
                        value={h.nationality}
                        aria-invalid={!!er("nationality")}
                        onChange={(e) => {
                          setHolder(i, { nationality: e.target.value });
                          clearErr(`${p}nationality`);
                        }}
                        className={input}
                      >
                        <option value="">Select nationality</option>
                        {countries.map((c) => (
                          <option key={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </Field>
                    {text("passportExpiry", "Passport expiry date", { type: "date" })}
                    <div data-field={`${p}uaeResident`}>
                      <p className={labelCls}>Are you a UAE resident? *</p>
                      <Pills id={`${p}uaeResident`} options={["Yes", "No"]} value={h.uaeResident ? [h.uaeResident] : []} invalid={!!er("uaeResident")} onChange={(v) => { setHolder(i, { uaeResident: (v[0] as "Yes" | "No") ?? "" }); clearErr(`${p}uaeResident`); }} />
                      {er("uaeResident") && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{er("uaeResident")}</p>}
                    </div>
                  </div>

                  <h4 className="mt-9 font-display text-[18px] font-bold text-heading">Documents to attach</h4>
                  <p className="mt-1 text-[13px] text-body">PDF, JPG or PNG, up to 6 MB each. Large photos are shrunk automatically.</p>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    {FILE_SLOTS.map((slot: (typeof FILE_SLOTS)[number]) => {
                      const key = `sh${i}_${slot.key as FileKey}`;
                      return (
                        <FileField
                          key={key}
                          id={key}
                          label={slot.label}
                          hint={slot.hint}
                          required={slot.required}
                          file={files[key]}
                          error={errors[key]}
                          onPick={(f) => pick(key, f)}
                          onClear={() => setFiles((x) => Object.fromEntries(Object.entries(x).filter(([k]) => k !== key)))}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={card}>
            <h2 className="font-display text-[26px] font-bold text-heading">About your business</h2>
            <p className="mt-2 text-[15px] leading-relaxed">A few questions so we can understand how your company will operate.</p>
            <div className="mt-8 grid gap-6">
              <Field id="turnover" label={`${qn(7)}. Expected annual turnover (AED)`}>
                <input id="turnover" inputMode="numeric" value={data.turnover} maxLength={20} onChange={(e) => set("turnover", e.target.value.replace(/[^\d,.]/g, ""))} placeholder="For example 500,000" className={input} />
              </Field>
              <Field id="experience" label={`${qn(8)}. Previous employment/business experience`} hint="A brief description of your previous work experience.">
                <textarea id="experience" rows={3} maxLength={1500} value={data.experience} onChange={(e) => set("experience", e.target.value)} className={input} />
              </Field>
              <Field id="businessDescription" label={`${qn(9)}. Brief description of your intended business in UAE *`} error={errors["businessDescription"]}>
                <textarea id="businessDescription" rows={4} maxLength={1500} value={data.businessDescription} aria-invalid={!!errors["businessDescription"]} onChange={(e) => { set("businessDescription", e.target.value); clearErr("businessDescription"); }} className={input} />
              </Field>
              <Field id="targetCountries" label={`${qn(10)}. List all the countries where your targeted customers will be based`} hint="Include the UAE and any international markets.">
                <textarea id="targetCountries" rows={2} maxLength={600} value={data.targetCountries} onChange={(e) => set("targetCountries", e.target.value)} className={input} />
              </Field>
              <Field id="paymentFromCustomers" label={`${qn(11)}. Mention the relevant payment methods you will be accepting from customers *`} error={errors["paymentFromCustomers"]} hint="For example cash, bank transfer, card.">
                <textarea id="paymentFromCustomers" rows={2} maxLength={600} value={data.paymentFromCustomers} aria-invalid={!!errors["paymentFromCustomers"]} onChange={(e) => { set("paymentFromCustomers", e.target.value); clearErr("paymentFromCustomers"); }} className={input} />
              </Field>
              <Field id="paymentToSuppliers" label={`${qn(12)}. Mention the primary payment method your company will use when transacting with suppliers *`} error={errors["paymentToSuppliers"]} hint="For example cash, bank transfer, card.">
                <textarea id="paymentToSuppliers" rows={2} maxLength={600} value={data.paymentToSuppliers} aria-invalid={!!errors["paymentToSuppliers"]} onChange={(e) => { set("paymentToSuppliers", e.target.value); clearErr("paymentToSuppliers"); }} className={input} />
              </Field>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className={card}>
            <h2 className="font-display text-[26px] font-bold text-heading">Declarations</h2>
            <p className="mt-2 text-[15px] leading-relaxed">These are standard compliance questions. Please answer honestly.</p>

            <div className="mt-8 space-y-9">
              <div data-field="otherLicence">
                <p className={labelCls}>{qn(13)}. Do you hold any other business licence in the UAE or other country? *</p>
                <Pills id="otherLicence" options={["Yes", "No"]} value={data.otherLicence ? [data.otherLicence] : []} invalid={!!errors["otherLicence"]} onChange={(v) => { set("otherLicence", (v[0] as "Yes" | "No") ?? ""); clearErr("otherLicence"); }} />
                {data.otherLicence === "Yes" && (
                  <input aria-label="Other licence details" placeholder="Company name and the country it is based in" value={data.otherLicenceDetails} maxLength={400} onChange={(e) => set("otherLicenceDetails", e.target.value)} className={`${input} mt-3`} />
                )}
                {errors["otherLicence"] && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{errors["otherLicence"]}</p>}
              </div>

              <div data-field="crime">
                <p className={labelCls}>{qn(14)}. Have you been involved in any of the below activities? *</p>
                <Pills multi id="crime" options={CRIME_OPTIONS} value={data.crime} invalid={!!errors["crime"]} onChange={(v) => { set("crime", v.includes(NONE_CRIME) && !data.crime.includes(NONE_CRIME) ? [NONE_CRIME] : v.filter((x) => x !== NONE_CRIME || v.length === 1)); clearErr("crime"); }} />
                {data.crime.includes("Other") && <input aria-label="Please specify" placeholder="Please specify" value={data.crimeOther} maxLength={300} onChange={(e) => set("crimeOther", e.target.value)} className={`${input} mt-3`} />}
                {errors["crime"] && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{errors["crime"]}</p>}
              </div>

              <div data-field="pep">
                <p className={labelCls}>{qn(15)}. Have you been involved in any of the below? *</p>
                <Pills multi id="pep" options={PEP_OPTIONS} value={data.pep} invalid={!!errors["pep"]} onChange={(v) => { set("pep", v.includes(NONE_PEP) && !data.pep.includes(NONE_PEP) ? [NONE_PEP] : v.filter((x) => x !== NONE_PEP || v.length === 1)); clearErr("pep"); }} />
                {errors["pep"] && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{errors["pep"]}</p>}
              </div>

              <div data-field="wealth">
                <p className={labelCls}>{qn(16)}. Source of wealth declaration * <span className="font-normal text-body">(choose all that apply)</span></p>
                <Pills multi id="wealth" options={WEALTH_SOURCES} value={data.wealth} invalid={!!errors["wealth"]} onChange={(v) => { set("wealth", v); clearErr("wealth"); }} />
                {data.wealth.includes("Other") && <input aria-label="Please specify" placeholder="Please specify" value={data.wealthOther} maxLength={300} onChange={(e) => set("wealthOther", e.target.value)} className={`${input} mt-3`} />}
                {errors["wealth"] && <p role="alert" className="mt-1.5 text-[13px] font-semibold text-red-600">{errors["wealth"]}</p>}
              </div>

              <div className="rounded-2xl border border-dashed border-heading/25 bg-tint/60 p-5">
                <p className="text-[15px] font-bold text-heading">{qn(17)} to {qn(20)} · The same four questions again</p>
                <p className="mt-1 text-[13px] leading-relaxed text-body">Our printed form repeats questions {qn(13)} to {qn(16)} as {qn(17)} to {qn(20)}. We copy your answers, so you do not need to answer twice.</p>
                <dl className="mt-4 space-y-3 text-[14px]">
                  {[
                    [qn(17), "Do you hold any other business licence?", data.otherLicence ? `${data.otherLicence}${data.otherLicence === "Yes" && data.otherLicenceDetails ? ` - ${data.otherLicenceDetails}` : ""}` : "-"],
                    [qn(18), "Involved in any of the below activities", data.crime.length ? `${data.crime.join(", ")}${data.crimeOther ? ` (${data.crimeOther})` : ""}` : "-"],
                    [qn(19), "Involved in any of the below", data.pep.length ? data.pep.join(", ") : "-"],
                    [qn(20), "Source of wealth declaration", data.wealth.length ? `${data.wealth.join(", ")}${data.wealthOther ? ` (${data.wealthOther})` : ""}` : "-"],
                  ].map(([n, q, a]) => (
                    <div key={String(n)} className="grid grid-cols-[2.5rem_1fr] gap-2">
                      <dt className="font-bold text-navy">{n}.</dt>
                      <dd>
                        <span className="block text-body">{q}</span>
                        <strong className="text-heading">{a}</strong>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div data-field="declaration" className={`rounded-2xl border p-5 ${errors["declaration"] ? "border-red-500 bg-red-50" : "border-line bg-tint"}`}>
                <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed">
                  <input type="checkbox" checked={data.declaration} onChange={(e) => { set("declaration", e.target.checked); clearErr("declaration"); }} className="mt-1 h-5 w-5 accent-[#07399d]" />
                  <span>
                    I confirm that the information and documents I have given are true and complete. I agree that Workdane may use them to prepare my company registration and may share them with the relevant authorities. I understand they contain personal information.
                  </span>
                </label>
                {errors["declaration"] && <p role="alert" className="mt-2 text-[13px] font-semibold text-red-600">{errors["declaration"]}</p>}
              </div>
            </div>
          </div>
        )}

        {errCount > 0 && (
          <p role="alert" className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-50 p-4 text-[14px] font-semibold text-red-700">
            <CircleAlert className="h-5 w-5 shrink-0" />
            Please complete {errCount} {errCount === 1 ? "item" : "items"} marked in red.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-6 rounded-xl border border-red-500/40 bg-red-50 p-4 text-[14px] text-red-800">
            {serverMsg}{" "}
            <a href={whatsappLink("Hello Workdane, I could not submit the company registration form online.")} target="_blank" rel="noreferrer" className="font-bold underline">
              Contact us on WhatsApp
            </a>
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button type="button" onClick={back} disabled={step === 1 || status === "sending"} className="flex items-center gap-2 rounded-full border border-heading/25 px-6 py-3.5 text-[15px] font-bold text-heading transition hover:border-navy disabled:invisible">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button type="button" onClick={next} className="gold-gradient btn-shine flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-bold text-midnight">
              Save and continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "sending"} className="gold-gradient btn-shine flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-bold text-midnight disabled:opacity-70">
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "sending" ? "Sending your documents..." : "Submit registration form"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
