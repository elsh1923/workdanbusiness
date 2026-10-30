import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { posts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs | Workdane Management Consultancy",
  description: "Practical guides on choosing activities, mainland or free zone, documents and life after your licence.",
};

export default function Blogs() {
  return (
    <>
      <PageHero
        eyebrow="Blogs"
        title={
          <>
            Practical guides, <em className="gold-text italic">written for founders.</em>
          </>
        }
        intro="Short, plain-language articles on setting up and running a business in the UAE."
      />
      <section className="bg-surface px-6 pb-28 pt-4 sm:px-12 lg:px-16">
        <ol className="mx-auto max-w-[1320px] border-t border-heading/15">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/blogs/${p.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-4 border-b border-heading/15 py-8 row-wipe sm:grid-cols-[4rem_1fr_2.5rem] sm:gap-6 sm:px-4"
              >
                <span className="font-display text-[21px] text-heading/25 transition-colors group-hover:text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[19px] font-bold text-heading sm:text-[23px]">{p.title}</span>
                  <span className="mt-2 block max-w-2xl text-[15px] leading-relaxed">{p.summary}</span>
                  <span className="mt-3 block text-[13px] font-bold uppercase tracking-widest text-bronze">{p.readMinutes} min read</span>
                </span>
                <span className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-heading/25 transition group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
