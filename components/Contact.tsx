"use client";

import { useState } from "react";
import { Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, OFFICES, whatsappLink } from "@/lib/config";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";
import { useFormSubmit } from "./useFormSubmit";

const interests = ["Company formation", "Licensing & approvals", "Visas & PRO", "Accounting & VAT", "Not sure yet"];
const channels = ["WhatsApp", "Phone call", "Email"];

const field =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold disabled:opacity-60";
const fieldLabel = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";
const contactLabel = "block text-[14px] font-bold uppercase tracking-widest text-bronze";

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
        { label: "Phone / WhatsApp", value: get("phone"), type: "tel" },
        { label: "Email", value: get("email"), type: "email" },
        { label: "Needs help with", value: get("interest") },
        { label: "Message", value: get("message") },
        { label: "Preferred contact", value: channel },
      ],
      get("website"),
    );
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-white px-5 py-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="font-display text-[40px] font-bold leading-[1.15] text-heading sm:text-[44px]">
            Let&apos;s set up your business <em className="gold-text italic">properly.</em>
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed">
            Tell us what you are planning. We will reply with the right structure, the approvals involved and a written quotation.
          </p>

          <ul className="mt-12 space-y-6 text-[16px]">
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className={contactLabel}>Phone</span>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-navy">
                  {CONTACT.phone}
                </a>
              </span>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className={contactLabel}>Email</span>
                <a href={`mailto:${CONTACT.email}`} className="block hover:text-navy">
                  {CONTACT.email}
                </a>
                <a href={`mailto:${CONTACT.emailSecondary}`} className="block hover:text-navy">
                  {CONTACT.emailSecondary}
                </a>
              </span>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className={contactLabel}>Offices</span>
                {OFFICES.map((o) => (
                  <span key={o.name} className="mt-1 block">
                    <span className="font-bold text-heading">{o.name}:</span> {o.lines.join(", ")}
                  </span>
                ))}
              </span>
            </li>
          </ul>

          <a
            href={whatsappLink("Hello Workdane, I'd like to discuss company setup.")}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-[16px] font-extrabold uppercase tracking-widest text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </Reveal>

        <Reveal delay={120}>
          {status === "sent" ? (
            <div role="status" className="flex min-h-[460px] flex-col justify-center">
              <p className="font-display text-[40px] font-bold text-heading">Thank you.</p>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed">
                We have received your enquiry and will get back to you via {channel}. For anything urgent, message us on WhatsApp.
              </p>
              <button onClick={reset} className="mt-8 self-start text-[16px] font-bold uppercase tracking-widest text-navy underline decoration-gold decoration-2 underline-offset-8">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="relative" aria-busy={sending}>
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              <fieldset disabled={sending} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>Full name *</span>
                    <input required minLength={2} maxLength={100} name="name" autoComplete="name" className={field} />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Phone / WhatsApp *</span>
                    <input
                      required
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern="[+()\d\s\-]{7,20}"
                      title="Enter a valid phone number, for example +971 56 537 4748"
                      className={field}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={fieldLabel}>Email *</span>
                  <input required type="email" name="email" autoComplete="email" className={field} />
                </label>
                <label className="block">
                  <span className={fieldLabel}>What do you need help with?</span>
                  <select name="interest" className={`${field} bg-white`}>
                    {interests.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={fieldLabel}>Message (optional)</span>
                  <textarea name="message" rows={3} maxLength={2000} className={`${field} resize-none`} />
                </label>

                <div role="group" aria-labelledby="channel-label">
                  <span id="channel-label" className={fieldLabel}>
                    Preferred contact
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {channels.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={channel === c}
                        onClick={() => setChannel(c)}
                        className={`rounded-full border px-4 py-2 text-[14px] font-bold transition ${
                          channel === c ? "border-navy bg-navy text-white" : "border-heading/25 text-heading hover:border-navy"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 text-[14px] leading-relaxed text-body">
                  <input required type="checkbox" className="mt-0.5 accent-[#0c2a55]" />
                  <span>I agree to be contacted by Workdane about my enquiry by email, phone or WhatsApp.</span>
                </label>

                {status === "error" && (
                  <div role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-[16px] leading-relaxed text-red-900">
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
                  className="gold-gradient btn-shine flex items-center gap-3 rounded-full px-8 py-4 text-[16px] font-extrabold uppercase tracking-widest text-midnight transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {sending ? "Sending..." : "Request a call back"}
                </button>
              </fieldset>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
