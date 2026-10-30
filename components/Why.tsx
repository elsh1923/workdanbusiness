import { BadgeCheck, FileText, MapPin, UserCheck } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

const reasons = [
  { icon: UserCheck, title: "One point of contact", text: "A single consultant follows your file from the first application to the renewal reminder." },
  { icon: FileText, title: "Written quotation first", text: "You see the scope and fees in writing before you commit to anything." },
  { icon: MapPin, title: "Dubai and Sharjah offices", text: "Meet the team in person in either emirate, or work with us remotely." },
  { icon: BadgeCheck, title: "Support after setup", text: "Renewals, visas, VAT and bookkeeping stay on schedule long after your licence is issued." },
];

export default function Why() {
  return (
    <section className="hero-bg grain relative isolate overflow-clip px-6 py-28 text-white sm:px-12 lg:px-16">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="drift pointer-events-none absolute -right-24 top-10 -z-10 h-[380px] w-[380px] rounded-full bg-gold/15 blur-3xl" />
      <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <Reveal>
          <Eyebrow light>Why Workdane</Eyebrow>
          <h2 className="font-display text-[34px] font-bold leading-[1.15] sm:text-[38px]">
            A calmer way to <em className="shimmer italic">start a business.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/90">
            Setting up involves many authorities and many documents. We take care of the moving parts so you can focus on your customers.
          </p>
        </Reveal>

        <ul className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={r.title} className="border-t border-white/15 pt-6">
                <Reveal delay={i * 100}>
                  <div className="flex items-center justify-between">
                    <span className="gold-gradient flex h-12 w-12 items-center justify-center rounded-xl text-midnight">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-[34px] font-extrabold leading-none text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[21px] font-bold">{r.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/90">{r.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
