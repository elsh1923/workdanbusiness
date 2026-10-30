import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import { activities } from "@/lib/activity-data";
import { categoryBySlug, categoryPages } from "@/lib/service-pages";

export function generateStaticParams() {
  return categoryPages.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return {};
  return { title: `${c.name} Licence | Workdane Management Consultancy`, description: c.intro };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();

  const inCategory = activities.filter((a) => a.category === c.name);
  const step = Math.max(1, Math.floor(inCategory.length / 8));
  const examples = inCategory.filter((_, i) => i % step === 0).slice(0, 8);
  const needApproval = inCategory.filter((a) => a.authority).length;
  const browse = `/business-activities?category=${encodeURIComponent(c.name)}`;

  return (
    <>
      <PageHero
        eyebrow={c.name}
        title={
          <>
            {c.name} <em className="gold-text italic">licence.</em>
          </>
        }
        intro={c.intro}
      >
        <div className="flex flex-wrap gap-4">
          <Link href="/home#contact" className="gold-gradient btn-shine rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight">
            Book a consultation
          </Link>
          <Link href={browse} className="rounded-full border-2 border-white/40 px-7 py-3.5 text-[15px] font-bold text-white transition hover:border-gold-light hover:bg-white/10">
            Browse {inCategory.length.toLocaleString("en-US")} activities
          </Link>
        </div>
      </PageHero>

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Who it suits</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">{c.tagline}</h2>
            <ul className="mt-8 space-y-4">
              {c.suits.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>What it covers</Eyebrow>
            <ul className="border-t border-heading/15">
              {c.covers.map((s, i) => (
                <li key={s} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-5">
                  <span className="font-display text-[21px] text-heading/25">0{i + 1}</span>
                  <span className="text-[15px] leading-relaxed text-heading">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>Example activities</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">
            A few of the {inCategory.length.toLocaleString("en-US")} activities in this category
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">
            {needApproval.toLocaleString("en-US")} of them need approval from another authority. The activity list shows which.
          </p>
          <ul className="mt-10 border-t border-heading/15">
            {examples.map((a) => (
              <li key={a.id} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-heading/15 py-5 sm:grid-cols-[8rem_1fr_auto]">
                <span className="font-mono text-[14px] font-bold text-bronze">{a.sub}</span>
                <span className="text-[15px] leading-relaxed text-heading">{a.name}</span>
                {a.authority && <span className="col-start-2 text-[13px] font-bold uppercase tracking-widest text-bronze sm:col-start-auto">Approval needed</span>}
              </li>
            ))}
          </ul>
          <Link href={browse} className="group mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-navy">
            <span className="underline decoration-gold decoration-2 underline-offset-4">Search all {c.name} activities</span>
            <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Before you apply</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {c.considerations.map((s) => (
              <li key={s} className="rounded-2xl border border-line bg-white p-6 text-[15px] leading-relaxed">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[13px] leading-relaxed text-body">Fees and requirements are confirmed in your written quotation.</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
