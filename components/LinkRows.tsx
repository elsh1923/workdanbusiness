import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Item } from "@/lib/content";

export default function LinkRows({ items }: { items: Item[] }) {
  return (
    <ol className="border-t border-heading/15">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group grid grid-cols-[2.5rem_2.75rem_1fr_2.5rem] items-center gap-4 border-b border-heading/15 py-7 row-wipe sm:grid-cols-[4rem_3rem_1fr_2.5rem] sm:gap-6 sm:px-4"
            >
              <span className="font-display text-2xl text-heading/25 transition-colors group-hover:text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy transition group-hover:bg-navy group-hover:text-gold-light">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-bold text-heading transition-transform duration-500 group-hover:translate-x-4 sm:text-2xl">
                  {item.label}
                </span>
                <span className="mt-1 block text-[16px] leading-relaxed">{item.desc}</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-heading/25 transition group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
