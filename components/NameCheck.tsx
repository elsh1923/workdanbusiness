"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { countries } from "@/lib/countries";
import { useFormSubmit } from "./useFormSubmit";

const field =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold";
const label = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";

// Words that usually need special approval before a company can use them in its name.
const RESTRICTED = ["bank", "insurance", "takaful", "government", "ministry", "federal", "national", "royal", "sheikh", "emirates", "police", "army", "military", "municipality", "islamic", "holy", "quran", "allah", "university", "college", "school", "chamber", "authority", "united nations", "olympic"];

type Verdict = { tone: "good" | "warn" | "bad"; title: string; points: string[] };

function precheck(raw: string): Verdict {
  const name = raw.trim().replace(/\s+/g, " ");
  const lower = name.toLowerCase();
  const problems: string[] = [];
  if (name.length < 3) problems.push("Use at least 3 characters.");
  if (name.length > 60) problems.push("Keep the name to 60 characters or fewer.");
  if (/^\d+$/.test(name)) problems.push("A name cannot be only numbers.");
  if (/[^\p{L}\p{N}\s&.,'\-()]/u.test(name)) problems.push("Use letters, numbers and simple punctuation only.");
  if (problems.length) return { tone: "bad", title: "This name needs changes", points: problems };

  const hits = RESTRICTED.filter((w) => new RegExp(`(^|[^a-z])${w}([^a-z]|$)`).test(lower));
  if (hits.length)
    return {
      tone: "warn",
      title: "This name may need special approval",
      points: [`Names containing “${hits.join("”, “")}” are usually restricted or need an extra approval. We can still submit it, or suggest an alternative.`],
    };
  return {
    tone: "good",
    title: "This name looks suitable to submit",
    points: ["It passes our format and restricted-word check. The authority confirms whether the name is actually available."],
  };
}

export default function NameCheck() {
  const [name, setName] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", dial: "+971", phone: "" });
  const [consent, setConsent] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const { status, message, whatsapp, sending, submit, reset } = useFormSubmit("Name check request");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = precheck(name);
    setVerdict(v);
    if (v.tone === "bad") return;
    await submit(
      [
        { label: "Proposed company name", value: name.trim() },
        { label: "Instant check", value: v.title },
        { label: "Full name", value: form.fullName },
        { label: "Email", value: form.email, type: "email" },
        { label: "Phone", value: `${form.dial} ${form.phone}`, type: "tel" },
      ],
      "",
    );
  };

  const icon = verdict?.tone === "good" ? <CheckCircle2 className="h-6 w-6 text-[#0f7d46]" /> : verdict?.tone === "warn" ? <AlertTriangle className="h-6 w-6 text-bronze" /> : <XCircle className="h-6 w-6 text-red-600" />;

  return (
    <form onSubmit={onSubmit} aria-busy={sending} className="space-y-7">
      <label className="block">
        <span className={label}>Proposed company name *</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setVerdict(null);
            if (status !== "idle") reset();
          }}
          required
          maxLength={80}
          className={field}
        />
      </label>
      <label className="block">
        <span className={label}>Your full name *</span>
        <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className={label}>Email *</span>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={150} autoComplete="email" className={field} />
      </label>
      <div>
        <span className={label}>Phone *</span>
        <div className="flex gap-3">
          <select value={form.dial} onChange={(e) => setForm({ ...form, dial: e.target.value })} aria-label="Country code" className={`${field} w-[8.5rem] shrink-0 bg-white`}>
            {countries.map((c) => (
              <option key={c.name} value={c.dial}>
                {c.dial} {c.name}
              </option>
            ))}
          </select>
          <input
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            maxLength={15}
            pattern="[\d\s\-()]{6,15}"
            title="Enter the number without the country code"
            className={`${field} min-w-0 flex-1`}
          />
        </div>
      </div>
      <label className="flex items-start gap-3 text-[14px] leading-relaxed">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#07399d]" />
        I agree that Workdane may contact me by email, phone or WhatsApp about this request.
      </label>

      {verdict && (
        <div role="status" className="flex gap-4 rounded-2xl border border-line bg-tint p-5">
          <span className="mt-0.5 shrink-0">{icon}</span>
          <div>
            <p className="font-display text-[18px] font-bold text-heading">{verdict.title}</p>
            {verdict.points.map((p) => (
              <p key={p} className="mt-2 text-[15px] leading-relaxed">
                {p}
              </p>
            ))}
            {status === "sent" && <p className="mt-3 text-[15px] font-bold text-heading">We have your request and will confirm availability with you.</p>}
          </div>
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-[15px] leading-relaxed text-red-900">
          {message}
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 block font-bold underline">
              Send this on WhatsApp instead
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={sending || status === "sent"}
        className="gold-gradient btn-shine flex items-center gap-3 rounded-full px-8 py-4 text-[15px] font-bold text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending && <Loader2 className="h-4 w-4 animate-spin" />}
        {sending ? "Checking..." : status === "sent" ? "Request sent" : "Check my name"}
      </button>
      <p className="text-[13px] leading-relaxed text-body">The instant result checks the format and restricted words only. No name is reserved until the authority approves it.</p>
    </form>
  );
}
