"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Eyebrow from "./Eyebrow";
import Skyline from "./Skyline";

const questions = [
  {
    q: "Where will your business operate?",
    options: ["Across the UAE, mainland", "International trade, free zone", "Not sure yet"],
  },
  {
    q: "How many owners or partners?",
    options: ["Just me", "Two to four", "Five or more"],
  },
  {
    q: "What do you need most right now?",
    options: ["Company formation and licence", "Visas and PRO support", "Accounting and VAT"],
  },
];

const placeCopy = [
  "A mainland licence suits businesses selling directly to clients across the UAE.",
  "A free zone company suits trade and international clients.",
  "We will compare mainland and free zone options for your activity.",
];

const ownerCopy = [
  "A single-owner structure is usually the simplest place to start.",
  "A shareholder agreement protects everyone and sets out each role.",
  "A larger group benefits from a formal, documented ownership structure.",
];

const needHeadline = [
  "Company formation and licence first",
  "Visas and PRO support first",
  "Accounting and VAT set up first",
];

const assurances = ["Dubai & Sharjah offices", "One point of contact", "Written quotation first"];

function SetupFinder() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === questions.length;
  const [place, owners, need] = answers;

  return (
    <div data-spotlight data-tilt className="spotlight glass rounded-3xl border border-white/10 border-t-2 border-t-gold p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-10">
      <div className="flex items-center justify-between text-[13px] font-bold uppercase tracking-[0.25em] text-white/80">
        <span>Find your starting point</span>
        <span className="whitespace-nowrap">
          {Math.min(step + 1, questions.length)} / {questions.length}
        </span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div className="gold-gradient h-1 rounded-full transition-all duration-700" style={{ width: `${(step / questions.length) * 100}%` }} />
      </div>

      {!done ? (
        <div key={step} className="rise mt-8">
          <p className="font-display text-[26px] font-bold leading-tight sm:text-[34px]">{questions[step].q}</p>
          <ul className="mt-8 space-y-3">
            {questions[step].options.map((o, i) => (
              <li key={o}>
                <button
                  onClick={() => setAnswers([...answers, i])}
                  className="group flex w-full items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left text-[15px] transition hover:border-gold hover:bg-white/[0.08] hover:text-gold-light"
                >
                  <span className="gold-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-midnight">
                    {"ABC"[i]}
                  </span>
                  <span className="flex-1">{o}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
          {step > 0 && (
            <button onClick={() => setAnswers(answers.slice(0, -1))} className="mt-6 text-[15px] font-semibold text-white/75 hover:text-white">
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div className="rise mt-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-gold-light">Suggested starting point</p>
          <p className="mt-3 font-display text-[26px] font-bold leading-tight">{needHeadline[need]}</p>
          <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/90">
            <li className="flex gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-gold-light" />
              {placeCopy[place]}
            </li>
            <li className="flex gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-gold-light" />
              {ownerCopy[owners]}
            </li>
          </ul>
          <p className="mt-6 text-[15px] text-white/80">These are general pointers. Our consultants confirm the right route for your activity.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href="#contact" className="gold-gradient btn-shine rounded-full px-6 py-3 text-[15px] font-bold text-midnight">
              Discuss my setup
            </a>
            <button onClick={() => setAnswers([])} className="flex items-center gap-2 text-[15px] font-semibold text-white/80 hover:text-white">
              <RotateCcw className="h-3.5 w-3.5" />
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero-bg grain relative isolate overflow-clip pb-72 pt-36 text-white sm:pt-44">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="drift pointer-events-none absolute -left-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-slate-accent/40 blur-3xl" />
      <div aria-hidden className="drift pointer-events-none absolute right-0 top-10 -z-10 h-[360px] w-[360px] rounded-full bg-gold/20 blur-3xl" style={{ animationDelay: "-9s" }} />
      <svg aria-hidden className="parallax-a pointer-events-none absolute -right-56 top-10 -z-10 h-[760px] w-[760px] opacity-40" viewBox="0 0 400 400" fill="none">
        <g className="orbit" stroke="#ffc63d" strokeOpacity="0.5" strokeWidth="0.6">
          <circle cx="200" cy="200" r="180" />
          <ellipse cx="200" cy="200" rx="180" ry="70" />
          <ellipse cx="200" cy="200" rx="70" ry="180" />
          <ellipse cx="200" cy="200" rx="125" ry="180" />
          <circle cx="200" cy="200" r="130" strokeDasharray="2 6" />
        </g>
      </svg>
      <Skyline className="parallax-b pointer-events-none absolute bottom-0 left-[-4rem] -z-10 h-[220px] w-[calc(100%+8rem)]" />

      <div className="mx-auto grid max-w-[1320px] gap-16 px-6 sm:px-12 lg:px-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <div className="rise">
            <Eyebrow light>Company setup &amp; business services, UAE</Eyebrow>
          </div>
          <h1 className="rise font-display text-[34px] font-bold leading-[1.2] sm:text-[48px]">
            Set up right. <em className="shimmer font-medium italic">Stay compliant.</em>{" "}
            <span className="text-white/90">Grow with confidence.</span>
          </h1>
          <p className="rise mt-8 max-w-lg text-[18px] leading-relaxed text-white/90" style={{ animationDelay: "0.15s" }}>
            Company formation, licensing, visas, VAT and accounting, delivered by one team with one point of contact.
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" style={{ animationDelay: "0.25s" }}>
            <a data-magnetic href="#contact" className="gold-gradient btn-shine rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight shadow-[0_12px_30px_-10px_rgba(217,154,11,0.6)] transition hover:-translate-y-1 hover:brightness-110">
              Book a consultation
            </a>
            <a href="/business-activities" className="group flex items-center gap-2 text-[15px] font-bold text-white">
              Browse business activities
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
          <ul className="rise mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-semibold text-white/90" style={{ animationDelay: "0.35s" }}>
            {assurances.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold-light">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <SetupFinder />
      </div>
    </section>
  );
}
