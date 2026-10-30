import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import EnquiryForm from "@/components/EnquiryForm";
import PageHero from "@/components/PageHero";
import { OFFICES } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book an Appointment | Workdane Management Consultancy",
  description: "Book a face-to-face or online appointment with a Workdane business setup adviser in Dubai or Sharjah.",
};

const benefits = [
  { title: "Speak to an adviser", text: "Talk through your plan with someone who handles setups every day." },
  { title: "A clear recommendation", text: "Leave with a suggested structure, the approvals you need and the next steps." },
  { title: "A written quotation", text: "We send the scope and fees in writing so you can decide in your own time." },
  { title: "Dubai and Sharjah", text: "Meet us at either office, or take the appointment by phone or video." },
];

export default function BookAppointment() {
  return (
    <>
      <PageHero
        eyebrow="Book an appointment"
        title={
          <>
            Meet a setup <em className="gold-text italic">adviser.</em>
          </>
        }
        intro="Choose when and how you would like to talk, and we will confirm your slot."
      />
      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>What to expect</Eyebrow>
            <ol className="border-t border-heading/15">
              {benefits.map((b, i) => (
                <li key={b.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-7">
                  <span className="font-display text-[21px] text-heading/25">0{i + 1}</span>
                  <div>
                    <h2 className="font-display text-[19px] font-bold text-heading">{b.title}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed">{b.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className="mt-10 space-y-4 text-[15px] leading-relaxed">
              {OFFICES.map((o) => (
                <li key={o.name}>
                  <span className="block text-[13px] font-bold uppercase tracking-widest text-bronze">{o.name} office</span>
                  {o.lines.join(", ")}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-12">
            <h2 className="font-display text-[26px] font-bold text-heading">Request an appointment</h2>
            <div className="mt-8">
              <EnquiryForm
                fields={[
                  { name: "name", label: "Full name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
                  { name: "office", label: "Where would you like to meet?", type: "select", options: ["Dubai office", "Sharjah office", "By phone or video call"] },
                  { name: "date", label: "Preferred date (for example 12 June)", required: true },
                  { name: "time", label: "Preferred time", type: "select", options: ["Morning (9am to 12pm)", "Afternoon (12pm to 4pm)", "Late afternoon (4pm to 6pm)"] },
                  { name: "message", label: "What would you like to discuss?", type: "textarea" },
                ]}
                submitLabel="Request appointment"
                formName="Appointment request"
                successTitle="Request received."
                successText="We will confirm your appointment by email or WhatsApp."
                note="This is a request. Your appointment is confirmed once we reply."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
