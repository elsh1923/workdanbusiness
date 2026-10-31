"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { countries } from "@/lib/countries";

// The countries people pick most often, shown first.
const POPULAR = ["AE", "SA", "IN", "PK", "GB", "US", "EG", "ET", "PH", "BD"];

// A searchable country-code picker. Type a country name or a code ("india", "91") to find it quickly.
export default function DialSelect({
  value,
  onChange,
  name,
  className = "",
}: {
  value: string;
  onChange?: (dial: string) => void;
  name?: string; // when set, the chosen code is also submitted as a hidden field
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [iso, setIso] = useState(() => countries.find((c) => c.dial === value)?.iso ?? "AE");
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Several countries can share one code (+1, +7), so the chosen country is remembered separately.
  const current = countries.find((c) => c.iso === iso && c.dial === value) ?? countries.find((c) => c.dial === value) ?? countries[0];

  const items = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (q) return countries.filter((c) => c.name.toLowerCase().includes(q) || c.dial.replace("+", "").startsWith(q) || c.iso.toLowerCase() === q);
    const top = POPULAR.map((i) => countries.find((c) => c.iso === i)!).filter(Boolean);
    return [...top, ...countries.filter((c) => !POPULAR.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name))];
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (c: (typeof countries)[number]) => {
    setIso(c.iso);
    onChange?.(c.dial);
    setOpen(false);
    setQuery("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[active]) choose(items[active]);
    }
  };

  return (
    <div ref={root} className="relative shrink-0" onKeyDown={onKey}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Country code, ${current.name} ${current.dial}`}
        onClick={() => {
          setOpen((o) => !o);
          setActive(0);
          setTimeout(() => search.current?.focus(), 30);
        }}
        className={`flex w-[7.5rem] items-center gap-2 text-left ${className}`}
      >
        <span className="rounded bg-navy/10 px-1.5 py-0.5 text-[11px] font-extrabold tracking-wide text-navy">{current.iso}</span>
        <span className="flex-1 text-[16px] font-semibold text-heading">{current.dial}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-body transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[300px] max-w-[85vw] overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="relative border-b border-line p-2">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
            <input
              ref={search}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Search country or code"
              aria-label="Search country or code"
              className="w-full rounded-lg bg-tint py-2.5 pl-9 pr-3 text-[15px] outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {items.length === 0 && <li className="px-4 py-3 text-[14px] text-body">No country found</li>}
            {items.map((c, i) => {
              const on = c.iso === current.iso && c.dial === current.dial;
              return (
                <li key={c.iso + c.dial} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => choose(c)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-[15px] ${i === active ? "bg-navy/10" : ""}`}
                  >
                    <span className="w-9 shrink-0 rounded bg-navy/10 px-1.5 py-0.5 text-center text-[11px] font-extrabold tracking-wide text-navy">{c.iso}</span>
                    <span className="flex-1 truncate text-heading">{c.name}</span>
                    <span className="shrink-0 text-body">{c.dial}</span>
                    {on && <Check className="h-4 w-4 shrink-0 text-navy" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
