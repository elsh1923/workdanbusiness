"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { CONTACT, OFFICES, whatsappLink } from "@/lib/config";
import { fullPhone } from "@/lib/countries";
import PhoneField from "./PhoneField";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";
import { useFormSubmit } from "./useFormSubmit";

const interests = ["Company formation", "Licensing & approvals", "Visas & PRO", "Accounting & VAT", "Not sure yet"];
const channels = ["WhatsApp", "Email"];

const input =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[16px] text-heading outline-none transition placeholder:text-body/50 hover:border-heading/30 focus:border-navy focus:ring-4 focus:ring-navy/10 disabled:opacity-60";
const label = "mb-2 block text-[13px] font-bold text-heading";

const mapsLink = (lines: string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(", "))}`;

function Action({ href, icon: Icon, title, detail, external }: { href: string; icon: typeof Phone; title: string; detail: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.07] p-4 transition hover:border-gold-light/60 hover:bg-white/[0.14]"
    >
      <span className="gold-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-midnight">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-white/80">{title}</span>
        <span className="block text-[16px] font-bold text-white [overflow-wrap:anywhere]">{detail}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-gold-light transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Contact() {
  const [channel, setChannel] = useState("WhatsApp");
  const { status, message, whatsapp, sending, submit, reset } = useFormSubmit("Contact form enquiry");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    await submit(
      [
        { label: "Full name", value: get("name") },
        { label: "Phone / WhatsApp", value: fullPhone(get("phoneDial"), get("phone")), type: "tel" },
        { label: "Email", value: get("email"), type: "email" },
        { label: "Needs help with", value: get("interest") },
        { label: "Message", value: get("message") },
        { label: "Preferred contact", value: channel },
      ],
      get("website"),
    );
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-white px-6 py-28 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">
              Let&apos;s set up your business <em className="gold-text italic">properly.</em>
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed">
              Tell us what you are planning. We will reply with the right structure, the approvals involved and a written quotation.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-14 grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl border border-line shadow-[0_40px_90px_-50px_rgba(20,63,143,0.55)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* contact details */}
            <aside className="hero-bg grain relative isolate overflow-clip p-8 text-white sm:p-12">
              <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

              <h3 className="font-display text-[26px] font-bold leading-tight">Talk to us directly</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/90">Choose the way that suits you. We reply on every channel.</p>

              <div className="mt-8 space-y-3">
                <Action
                  href={whatsappLink("Hello Workdane, I'd like to discuss company setup.")}
                  icon={MessageCircle}
                  title="Chat on WhatsApp"
                  detail={CONTACT.phone}
                  external
                />
                <Action href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} icon={Phone} title="Call us" detail={CONTACT.phone} />
                <Action href={`mailto:${CONTACT.email}`} icon={Mail} title="Email us" detail={CONTACT.email} />
              </div>

              <div className="mt-10 grid gap-6 border-t border-white/20 pt-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {OFFICES.map((o) => (
                  <div key={o.name}>
                    <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-[#ffd96b]">
                      <MapPin className="h-4 w-4" />
                      {o.name} office
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/90">{o.lines.join(", ")}</p>
                    <a
                      href={o.mapUrl ?? mapsLink(o.lines)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-white underline decoration-gold-light decoration-2 underline-offset-4 hover:text-gold-light"
                    >
                      Get directions <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[13px] leading-relaxed text-white/70">
                {CONTACT.legalName} · Business licence no. {CONTACT.licenceNo}
              </p>
            </aside>

            {/* form */}
            <div className="bg-white p-8 sm:p-12">
              {status === "sent" ? (
                <div role="status" className="flex min-h-[480px] flex-col items-start justify-center">
                  <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <p className="font-display text-[34px] font-bold text-heading">Thank you.</p>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed">
                    We have received your enquiry and will get back to you via {channel}. For anything urgent, message us on WhatsApp.
                  </p>
                  <button onClick={reset} className="mt-8 rounded-full border border-navy px-6 py-3 text-[15px] font-semibold text-navy transition hover:bg-navy hover:text-white">
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative" aria-busy={sending}>
                  <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                  <h3 className="font-display text-[26px] font-bold leading-tight text-heading">Request a call back</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">Fields marked * are required.</p>

                  <fieldset disabled={sending} className="mt-8 min-w-0 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className={label}>Full name *</span>
                        <input required minLength={2} maxLength={100} name="name" autoComplete="name" placeholder="Your full name" className={input} />
                      </label>
                      <label className="block">
                        <span className={label}>Phone / WhatsApp *</span>
                        <PhoneField name="phone" required className={input} />
                      </label>
                    </div>

                    <label className="block">
                      <span className={label}>Email *</span>
                      <input required type="email" name="email" autoComplete="email" placeholder="you@company.com" className={input} />
                    </label>

                    <label className="block">
                      <span className={label}>What do you need help with?</span>
                      <select name="interest" className={input}>
                        {interests.map((i) => (
                          <option key={i}>{i}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className={label}>Message (optional)</span>
                      <textarea name="message" rows={4} maxLength={2000} placeholder="Tell us a little about your business" className={`${input} resize-none`} />
                    </label>

                    <div role="group" aria-labelledby="channel-label">
                      <span id="channel-label" className={label}>
                        How should we reach you?
                      </span>
                      <div className="inline-flex rounded-full border border-line bg-tint p-1">
                        {channels.map((c) => (
                          <button
                            key={c}
                            type="button"
                            aria-pressed={channel === c}
                            onClick={() => setChannel(c)}
                            className={`rounded-full px-6 py-2 text-[14px] font-bold transition ${
                              channel === c ? "bg-navy text-white shadow" : "text-heading hover:text-navy"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 text-[13px] leading-relaxed text-body">
                      <input required type="checkbox" className="mt-0.5 h-4 w-4 accent-[#07399d]" />
                      <span>I agree to be contacted by Workdane about my enquiry by email, phone or WhatsApp.</span>
                    </label>

                    {status === "error" && (
                      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] leading-relaxed text-red-900">
                        {message}
                        {whatsapp && (
                          <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 block font-bold underline">
                            Send this message on WhatsApp instead
                          </a>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                      <button
                        type="submit"
                        disabled={sending}
                        data-magnetic
                        className="gold-gradient btn-shine flex items-center justify-center gap-3 rounded-full px-10 py-4 text-[15px] font-bold text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 max-sm:w-full"
                      >
                        {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {sending ? "Sending..." : "Request a call back"}
                      </button>
                      <p className="flex items-center gap-2 text-[13px] text-body">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Your details are only used to reply to you.
                      </p>
                    </div>
                  </fieldset>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
