"use client";

import { useState } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea";
  options?: readonly string[];
  required?: boolean;
};

const fieldCls =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold";
const labelCls = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";

export default function EnquiryForm({
  fields,
  submitLabel,
  note,
  successTitle = "Thank you.",
  successText = "We have received your request and will be in touch.",
}: {
  fields: Field[];
  submitLabel: string;
  note?: string;
  successTitle?: string;
  successText?: string;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex min-h-[320px] flex-col justify-center">
        <p className="font-display text-[40px] font-bold text-heading">{successTitle}</p>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed">{successText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-7"
    >
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className={labelCls}>
            {f.label}
            {f.required ? " *" : ""}
          </span>
          {f.type === "select" ? (
            <select name={f.name} required={f.required} className={`${fieldCls} bg-white`}>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea name={f.name} rows={3} required={f.required} className={`${fieldCls} resize-none`} />
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} className={fieldCls} />
          )}
        </label>
      ))}
      {note && <p className="text-[14px] leading-relaxed text-body">{note}</p>}
      <button data-magnetic className="gold-gradient btn-shine rounded-full px-8 py-4 text-[16px] font-extrabold uppercase tracking-widest text-midnight transition hover:brightness-105">
        {submitLabel}
      </button>
    </form>
  );
}
