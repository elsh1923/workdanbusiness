"use client";

import { Cog, Compass, FileText, Rocket } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { Reveal } from "./motion";

const steps = [
  { icon: Compass, title: "Discover", text: "A short consultation to understand your activity, your owners and what you want to achieve." },
  { icon: FileText, title: "Plan", text: "We recommend the right structure and approvals, then send a clear written quotation." },
  { icon: Cog, title: "Set up", text: "We prepare the documents, submit each application and track every approval for you." },
  { icon: Rocket, title: "Launch & support", text: "We hand over your licence and records, then keep renewals, visas and compliance on schedule." },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 bg-white px-5 py-28 sm:px-9">
      <div className="mx-auto max-w-[1840px]">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="max-w-3xl font-display text-[40px] font-bold leading-[1.15] text-heading sm:text-[44px]">
            From first call to <em className="gold-text italic">fully running.</em>
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <svg aria-hidden className="absolute inset-x-0 top-0 hidden h-14 w-full lg:block" viewBox="0 0 1000 56" preserveAspectRatio="none" fill="none">
            <path d="M0 28 H1000" stroke="#c28500" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 8" vectorEffect="non-scaling-stroke" />
            <path className="draw" d="M0 28 H1000" stroke="#c28500" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>

          <ol className="grid gap-14 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="group">
                  <Reveal delay={i * 120}>
                    <span className="gold-gradient relative flex h-14 w-14 items-center justify-center rounded-full text-midnight shadow-[0_14px_30px_-12px_rgba(217,154,11,0.8)] ring-8 ring-white transition duration-500 group-hover:-translate-y-2 group-hover:scale-125">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="mt-6 block text-[14px] font-bold uppercase tracking-[0.2em] text-bronze">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-heading">{s.title}</h3>
                    <p className="mt-3 max-w-xs text-[16px] leading-relaxed">{s.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
