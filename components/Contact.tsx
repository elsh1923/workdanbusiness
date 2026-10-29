"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, OFFICES, whatsappLink } from "@/lib/config";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

const interests = ["Company formation", "Licensing & approvals", "Visas & PRO", "Accounting & VAT", "Not sure yet"];
const channels = ["WhatsApp", "Phone call", "Email"];

const field =
  "w-full border-b border-heading/25 bg-transparent py-3 text-[16px] text-heading outline-none transition placeholder:text-body/50 focus:border-gold";
const fieldLabel = "mb-1 block text-[12px] font-extrabold uppercase tracking-[0.2em] text-bronze";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [channel, setChannel] = useState("WhatsApp");

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-white px-5 py-28 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="font-display text-[40px] font-bold leading-[1.05] text-heading sm:text-[44px]">
            Let&apos;s set up your business <em className="gold-text italic">properly.</em>
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed">
            Tell us what you are planning. We will reply with the right structure, the approvals involved and a written quotation.
          </p>

          <ul className="mt-12 space-y-6 text-[16px]">
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className="block text-[14px] font-bold uppercase tracking-widest text-bronze">Phone</span>
                {CONTACT.phone}
              </span>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className="block text-[14px] font-bold uppercase tracking-widest text-bronze">Email</span>
                <span className="block">{CONTACT.email}</span>
                <span className="block">{CONTACT.emailSecondary}</span>
              </span>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                <span className="block text-[14px] font-bold uppercase tracking-widest text-bronze">Office</span>
                {OFFICES.map((o) => (
                  <span key={o.name} className="block">
                    {o.name}: {o.lines.join(", ")}
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
          {sent ? (
            <div className="flex min-h-[460px] flex-col justify-center">
              <p className="font-display text-[40px] font-bold text-heading">Thank you.</p>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed">
                We have received your enquiry and will contact you using your preferred method.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-8"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>Full name</span>
                  <input required name="name" autoComplete="name" className={field} />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Phone / WhatsApp</span>
                  <input required type="tel" name="phone" autoComplete="tel" className={field} />
                </label>
              </div>
              <label className="block">
                <span className={fieldLabel}>Email</span>
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
                <textarea name="message" rows={3} className={`${field} resize-none`} />
              </label>

              <fieldset>
                <legend className={fieldLabel}>Preferred contact</legend>
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
              </fieldset>

              <label className="flex items-start gap-3 text-[14px] leading-relaxed text-body">
                <input required type="checkbox" className="mt-0.5 accent-[#0c2a55]" />
                <span>I agree to be contacted by Workdane about my enquiry by email, phone or WhatsApp.</span>
              </label>

              <button data-magnetic className="gold-gradient btn-shine rounded-full px-8 py-4 text-[16px] font-extrabold uppercase tracking-widest text-midnight transition hover:brightness-105">
                Request a call back
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
