"use client";

import { Loader2 } from "lucide-react";
import { fullPhone } from "@/lib/countries";
import PhoneField from "./PhoneField";
import { useFormSubmit } from "./useFormSubmit";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea";
  options?: readonly string[];
  required?: boolean;
};

const fieldCls =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold disabled:opacity-60";
const labelCls = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";

export default function EnquiryForm({
  fields,
  submitLabel,
  note,
  formName,
  successTitle = "Thank you.",
  successText = "We have received your request and will be in touch.",
}: {
  fields: Field[];
  submitLabel: string;
  note?: string;
  formName?: string;
  successTitle?: string;
  successText?: string;
}) {
  const { status, message, whatsapp, sending, submit, reset } = useFormSubmit(formName ?? submitLabel);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const valueOf = (f: Field) => (f.type === "tel" && get(f.name) ? fullPhone(get(`${f.name}Dial`), get(f.name)) : get(f.name));
    await submit(
      fields.map((f) => ({
        label: f.label,
        value: valueOf(f),
        type: f.type === "email" || f.type === "tel" ? f.type : undefined,
      })),
      get("website"),
    );
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-[320px] flex-col justify-center">
        <p className="font-display text-[34px] font-bold text-heading">{successTitle}</p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed">{successText}</p>
        <button onClick={reset} className="mt-8 self-start text-[15px] font-semibold text-navy underline decoration-gold decoration-2 underline-offset-8">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative" aria-busy={sending}>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      <fieldset disabled={sending} className="space-y-7">
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
              <textarea name={f.name} rows={3} maxLength={2000} required={f.required} className={`${fieldCls} resize-none`} />
            ) : f.type === "tel" ? (
              <PhoneField name={f.name} required={f.required} className={fieldCls} />
            ) : (
              <input name={f.name} type={f.type ?? "text"} required={f.required} maxLength={200} className={fieldCls} />
            )}
          </label>
        ))}

        {note && <p className="text-[13px] leading-relaxed text-body">{note}</p>}

        {status === "error" && (
          <div role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-[15px] leading-relaxed text-red-900">
            {message}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 block font-bold underline">
                Send this message on WhatsApp instead
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          data-magnetic
          className="gold-gradient btn-shine flex items-center gap-3 rounded-full px-8 py-4 text-[15px] font-bold text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Sending..." : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}
