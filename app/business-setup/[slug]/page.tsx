import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Accordion from "@/components/Accordion";
import CtaBand from "@/components/CtaBand";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import { landingBySlug, landings } from "@/lib/landing-pages";

export function generateStaticParams() {
  return landings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = landingBySlug(slug);
  return l ? { title: `${l.label} | Workdane Management Consultancy`, description: l.intro } : {};
}

async function LandingContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = landingBySlug(slug);
  if (!l) notFound();

  return (
    <>
      <PageHero
        eyebrow={l.label}
        title={
          <>
            {l.title} <em className="gold-text italic">{l.accent}</em>
          </>
        }
        intro={l.intro}
      >
        <div className="flex flex-wrap gap-4">
          <Link href="/book-appointment" className="gold-gradient btn-shine rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight">
            Book an appointment
          </Link>
          <Link href="/cost-calculator" className="rounded-full border-2 border-white/40 px-7 py-3.5 text-[15px] font-bold text-white transition hover:border-gold-light hover:bg-white/10">
            Estimate your costs
          </Link>
        </div>
      </PageHero>

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>Why Workdane</Eyebrow>
          <ul className="grid gap-6 md:grid-cols-3">
            {l.why.map((w) => (
              <li key={w.title} className="rounded-2xl border border-line bg-white p-7">
                <h2 className="font-display text-[19px] font-bold text-heading">{w.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>How it works</Eyebrow>
          <ol className="grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
            {l.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-7">
                <span className="font-display text-[24px] text-heading/25">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[19px] font-bold text-heading">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="mb-8 font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Common questions</h2>
          <Accordion items={l.faqs} />
          <p className="mt-8 text-[15px]">
            More answers in our <Link href="/faqs" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">FAQs</Link> and the{" "}
            <Link href="/business-setup-guide" className="font-bold text-navy underline decoration-gold decoration-2 underline-offset-4">setup guide</Link>.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default function Landing({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <LandingContent params={params} />
    </Suspense>
  );
}
