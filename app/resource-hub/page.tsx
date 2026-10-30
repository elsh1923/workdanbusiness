import { BookOpen, Calculator, ClipboardList, HelpCircle, Newspaper, Search } from "lucide-react";
import LinkRows from "@/components/LinkRows";
import PageHero from "@/components/PageHero";
import type { Item } from "@/lib/content";

const resources: Item[] = [
  { label: "Business Setup Guide", href: "/business-setup-guide", desc: "Step-by-step guide from idea to licence.", icon: BookOpen },
  { label: "Cost Calculator", href: "/cost-calculator", desc: "Estimate your setup costs before you commit.", icon: Calculator },
  { label: "Business Activities", href: "/business-activities", desc: "Search licensable activities and build a shortlist.", icon: ClipboardList },
  { label: "Name Check", href: "/name-check", desc: "Request a check on your preferred trade names.", icon: Search },
  { label: "FAQs", href: "/insights#faqs", desc: "Quick answers to the questions we hear most.", icon: HelpCircle },
  { label: "Blogs", href: "/insights#blogs", desc: "Guides and articles, being prepared now.", icon: Newspaper },
];

export default function ResourceHub() {
  return (
    <>
      <PageHero
        eyebrow="Resource hub"
        title={
          <>
            Everything you need, <em className="gold-text italic">in one place.</em>
          </>
        }
        intro="Tools and guides to help you plan, price and prepare your business setup."
      />
      <section className="bg-surface px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <LinkRows items={resources} />
        </div>
      </section>
    </>
  );
}
