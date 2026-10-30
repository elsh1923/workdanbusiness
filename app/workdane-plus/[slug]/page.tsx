import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Accordion from "@/components/Accordion";
import CtaBand from "@/components/CtaBand";
import EnquiryForm from "@/components/EnquiryForm";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import { plusServices } from "@/lib/content";
import { plusExtras, plusPageById, plusPages } from "@/lib/service-pages";

export function generateStaticParams() {
  return plusPages.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = plusServices.find((x) => x.id === slug);
  if (!s) return {};
  return { title: `${s.title} | Workdane Plus`, description: s.text };
}

async function PlusPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = plusServices.find((x) => x.id === slug);
  const p = plusPageById(slug);
  if (!s || !p) notFound();

  const extras = plusExtras[slug];
  const others = plusServices.filter((x) => x.id !== slug).slice(0, 4);

  return (
    <>
      <PageHero eyebrow={s.title} title={<>{s.title}</>} intro={p.intro}>
        <Link href="/home#contact" className="gold-gradient btn-shine inline-block rounded-full px-7 py-3.5 text-[15px] font-bold text-midnight">
          Ask about this service
        </Link>
      </PageHero>

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>What is included</Eyebrow>
            <ul className="space-y-4">
              {p.includes.map((i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <ol className="border-t border-heading/15">
              {p.steps.map((st, i) => (
                <li key={st.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-6">
                  <span className="font-display text-[21px] text-heading/25">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-[19px] font-bold text-heading">{st.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-[1320px] text-[13px] leading-relaxed text-body">{p.note}</p>
      </section>

      {extras && (
        <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
          <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <Eyebrow>Documents required</Eyebrow>
              <ul className="space-y-4">
                {extras.documents.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] leading-relaxed">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed text-body">We confirm the exact list for your case after your first message.</p>
            </div>
            <div className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-10">
              <h2 className="font-display text-[24px] font-bold text-heading">Let’s get started</h2>
              <div className="mt-6">
                <EnquiryForm
                  fields={[
                    { name: "name", label: "Full name", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
                    { name: "message", label: "Anything we should know? (optional)", type: "textarea" },
                  ]}
                  submitLabel="Send request"
                  formName={`${s.title} enquiry`}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {extras && (
        <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mb-8 font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Frequently asked questions</h2>
            <Accordion items={extras.faqs} />
          </div>
        </section>
      )}

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>More from Workdane Plus</Eyebrow>
          <ul className="grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/workdane-plus/${o.id}`} className="group flex items-center gap-4 border-b border-heading/15 row-wipe py-6 sm:px-2">
                  <span className="flex-1 font-display text-[18px] font-bold text-heading">{o.title}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default function PlusPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <PlusPageContent params={params} />
    </Suspense>
  );
}
