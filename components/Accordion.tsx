import { Plus } from "lucide-react";

export type QA = { q: string; a: string };

// Question list built on <details>, so it works without JavaScript and is keyboard accessible.
export default function Accordion({ items }: { items: QA[] }) {
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <li key={f.q} className="group overflow-hidden rounded-2xl border border-line bg-white transition open:border-gold/50">
          <details>
            <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="flex-1 font-display text-[17px] font-bold leading-snug text-heading sm:text-[19px]">{f.q}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-heading/25 text-heading transition group-open:rotate-45 group-open:border-gold group-open:bg-gold group-open:text-midnight">
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <p className="px-6 pb-6 text-[15px] leading-relaxed">{f.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
