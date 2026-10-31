"use client";

import { Building2, CalendarDays, CheckCircle2, ChevronDown, Loader2, Mail, User, type LucideIcon } from "lucide-react";
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
  "w-full rounded-xl border border-heading/20 bg-white px-4 py-3.5 text-[16px] text-heading outline-none transition placeholder:text-body/45 hover:border-heading/40 focus:border-navy focus:ring-4 focus:ring-navy/10 disabled:opacity-60";
const labelCls = "mb-2 block text-[13px] font-bold text-heading";

// A small icon in front of the fields people recognise by name.
function iconFor(f: Field): LucideIcon | undefined {
  if (f.type === "email") return Mail;
  if (/date/i.test(f.name)) return CalendarDays;
  if (/company/i.test(f.name)) return Building2;
  if (/name/i.test(f.name)) return User;
  return undefined;
}

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
      <div role="status" className="flex min-h-[320px] flex-col items-start justify-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0f7d46]/10 text-[#0f7d46]">
          <CheckCircle2 className="h-9 w-9" />
        </span>
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
      <fieldset disabled={sending} className="space-y-6">
        {fields.map((f) => {
          const Icon = f.type === "tel" || f.type === "select" || f.type === "textarea" ? undefined : iconFor(f);
          return (
            <label key={f.name} className="block">
              <span className={labelCls}>
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
              </span>
              {f.type === "select" ? (
                <span className="relative block">
                  <select name={f.name} required={f.required} className={`${fieldCls} appearance-none pr-11`}>
                    {f.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
                </span>
              ) : f.type === "textarea" ? (
                <textarea name={f.name} rows={4} maxLength={2000} required={f.required} className={`${fieldCls} resize-none`} />
              ) : f.type === "tel" ? (
                <PhoneField name={f.name} required={f.required} className={fieldCls} />
              ) : (
                <span className="relative block">
                  {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-navy/60" />}
                  <input name={f.name} type={f.type ?? "text"} required={f.required} maxLength={200} className={Icon ? `${fieldCls} pl-11` : fieldCls} />
                </span>
              )}
            </label>
          );
        })}

        {note && <p className="text-[13px] leading-relaxed text-body">{note}</p>}

        {status === "error" && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-50 p-4 text-[15px] leading-relaxed text-red-900">
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
          className="gold-gradient btn-shine flex items-center gap-3 rounded-full px-9 py-4 text-[16px] font-bold text-midnight shadow-[0_14px_30px_-14px_rgba(217,154,11,0.8)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Sending..." : submitLabel}
        </button>
      </fieldset>
    </form>
  );
}
