import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const links = [
  { label: "Business activities", href: "/business-activities" },
  { label: "Licence categories", href: "/license-categories" },
  { label: "Cost calculator", href: "/cost-calculator" },
  { label: "Name check", href: "/name-check" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact us", href: "/contact" },
];

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Page not found"
        title={
          <>
            We could not find <em className="gold-text italic">that page.</em>
          </>
        }
        intro="The address may have changed or been typed incorrectly. Try one of these instead."
      />
      <section className="bg-surface px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <ul className="mx-auto grid max-w-[1320px] border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-center gap-4 border-b border-heading/15 row-wipe py-6 sm:px-2">
                <span className="flex-1 font-display text-[18px] font-bold text-heading">{l.label}</span>
                <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
