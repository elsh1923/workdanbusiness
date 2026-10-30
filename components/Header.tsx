"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calculator, ChevronDown, Menu, X } from "lucide-react";
import { COMPANY, LOGO } from "@/lib/config";
import { navGroups } from "@/lib/content";
import RollText from "./RollText";

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const active = navGroups.find((g) => g.label === open);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md" onMouseLeave={() => setOpen(null)}>
      <div className="mx-auto flex h-[68px] max-w-[1840px] items-center gap-5 px-5 sm:px-9">
        <Link href="/" aria-label={`${COMPANY.name} home`} className="shrink-0">
          <Image src={LOGO.src} alt={COMPANY.name} width={LOGO.width} height={LOGO.height} priority className="h-[54px] w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center 2xl:flex">
          <Link href="/resource-hub" className="px-2.5 py-2 text-[16px] font-semibold text-heading transition hover:text-navy">
            <RollText>Resource Hub</RollText>
          </Link>
          {navGroups.map((g) => (
            <button
              key={g.label}
              type="button"
              onMouseEnter={() => setOpen(g.label)}
              onFocus={() => setOpen(g.label)}
              onClick={() => setOpen(open === g.label ? null : g.label)}
              aria-expanded={open === g.label}
              className={`relative flex items-center gap-1 px-2.5 py-2 text-[16px] font-semibold transition hover:text-navy ${
                open === g.label ? "text-navy" : "text-heading"
              }`}
            >
              <RollText>{g.label}</RollText>
              <ChevronDown className={`h-3.5 w-3.5 transition ${open === g.label ? "rotate-180" : ""}`} />
              <span
                className={`absolute inset-x-2.5 -bottom-0.5 h-0.5 bg-gold transition-transform duration-300 ${
                  open === g.label ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
          <Link href="/contact" className="px-2.5 py-2 text-[16px] font-semibold text-heading transition hover:text-navy">
            <RollText>Contact</RollText>
          </Link>
        </nav>

        <Link
          href="/cost-calculator"
          className="group hidden items-center gap-3 rounded-full bg-navy py-1 pl-5 pr-1 text-[16px] font-bold text-white transition hover:bg-slate-accent 2xl:flex"
        >
          Cost Calculator
          <span className="gold-gradient flex h-8 w-8 items-center justify-center rounded-full text-midnight transition duration-700 group-hover:rotate-[360deg]">
            <Calculator className="h-4 w-4" />
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-label="Menu"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy 2xl:hidden"
        >
          {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {active && (
        <div className="rise absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_30px_60px_-30px_rgba(11,37,69,0.25)] 2xl:block">
          <div className="mx-auto grid max-w-[1840px] grid-cols-[1fr_1fr_340px] gap-x-8 px-9 py-10">
            <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-1">
              {active.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(null)}
                    className="rise card-wipe group flex gap-4 overflow-hidden rounded-2xl p-4" style={{ animationDelay: `${idx * 75}ms` }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy transition group-hover:bg-navy group-hover:text-gold-light">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[18px] font-bold text-heading">{item.label}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-body">{item.desc}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href={active.promo.href}
              onClick={() => setOpen(null)}
              className="hero-bg group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-white"
            >
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[0.25em] text-gold-light">{active.promo.eyebrow}</p>
                <p className="mt-3 font-display text-2xl font-bold leading-snug">{active.promo.title}</p>
                <p className="mt-3 text-[16px] leading-relaxed text-white/70">{active.promo.text}</p>
              </div>
              <span className="mt-8 flex items-center gap-2 text-[16px] font-bold text-gold-light">
                {active.promo.cta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      )}

      {menu && (
        <nav aria-label="Mobile" className="rise max-h-[80vh] overflow-y-auto border-t border-line bg-white px-5 py-2 2xl:hidden">
          <Link href="/resource-hub" onClick={() => setMenu(false)} className="block border-b border-line py-4 text-[16px] font-bold text-heading">
            Resource Hub
          </Link>
          {navGroups.map((g) => (
            <div key={g.label} className="border-b border-line">
              <button
                type="button"
                onClick={() => setExpanded(expanded === g.label ? null : g.label)}
                aria-expanded={expanded === g.label}
                className="flex w-full items-center justify-between py-4 text-left text-[16px] font-bold text-heading"
              >
                {g.label}
                <ChevronDown className={`h-4 w-4 transition ${expanded === g.label ? "rotate-180" : ""}`} />
              </button>
              {expanded === g.label && (
                <ul className="rise pb-4">
                  {g.items.map((i) => (
                    <li key={i.label}>
                      <Link href={i.href} onClick={() => setMenu(false)} className="block py-2 pl-2 text-[16px] text-body hover:text-navy">
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Link href="/contact" onClick={() => setMenu(false)} className="block border-b border-line py-4 text-[16px] font-bold text-heading">
            Contact
          </Link>
          <Link
            href="/cost-calculator"
            onClick={() => setMenu(false)}
            className="gold-gradient btn-shine my-5 block rounded-full py-3.5 text-center text-[16px] font-bold text-midnight"
          >
            Cost Calculator
          </Link>
        </nav>
      )}
    </header>
  );
}
