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

async function CategoryPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();

  const inCategory = activities.filter((a) => a.category === c.name);
  const step = Math.max(1, Math.floor(inCategory.length / 8));
  const examples = inCategory.filter((_, i) => i % step === 0).slice(0, 8);
  const needApproval = inCategory.filter((a) => a.authority).length;
  const groupMap = new Map<string, { count: number; industry: string }>();
  for (const a of inCategory) {
    const g = groupMap.get(a.group) ?? { count: 0, industry: a.industry };
    g.count += 1;
    groupMap.set(a.group, g);
  }
  const topGroups = [...groupMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 8);
  const faqs = [
    { q: `What is a ${c.name} licence?`, a: c.intro },
    { q: "How many activities can I choose?", a: "Many licences let you combine several related activities. The limit and the allowed combinations depend on the licensing authority, and we confirm them for you." },
    { q: "Do any of these activities need approval?", a: `Some do. In this category ${needApproval.toLocaleString("en-US")} of ${inCategory.length.toLocaleString("en-US")} activities need approval from another authority. The activity list shows which ones.` },
    { q: "Can I set up without visiting the UAE?", a: "Much of the process can be completed remotely. Some steps, such as the residence visa medical test, need you to be in the UAE." },
    { q: "How much will it cost?", a: "The cost depends on your activities, licence length, visas and extras. Use the cost calculator for an indicative estimate. Your written quotation confirms the final figure." },
  ];
  const steps = [
    { title: "Choose your trade name and activities", text: "Tell us your plan. We help you pick activities that match what you will actually sell." },
    { title: "Submit your documents", text: "We tell you exactly which documents are needed and check them before we submit." },
    { title: "Get your licence", text: "We follow the application and any approvals until your licence is issued." },
    { title: "Add visas and banking", text: "Once licensed, we arrange residence visas and help you open a bank account." },
  ];
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

      <section className="border-b border-line bg-white px-6 py-20 sm:px-12 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Key facts</Eyebrow>
            <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">{c.name} at a glance</h2>
            <dl className="mt-8 border-t border-heading/15">
              {[
                ["Activities in this category", inCategory.length.toLocaleString("en-US")],
                ["Activity groups", String(groupMap.size)],
                ["Activities needing approval", needApproval.toLocaleString("en-US")],
                ["Licence lengths", "1 to 10 years"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-heading/15 py-4 text-[15px]">
                  <dt>{k}</dt>
                  <dd className="font-bold text-heading">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/cost-calculator" className="group mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-navy">
              <span className="underline decoration-gold decoration-2 underline-offset-4">Estimate your setup costs</span>
              <ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-10">
            <h2 className="font-display text-[24px] font-bold text-heading">Make an enquiry about {c.name}</h2>
            <div className="mt-6">
              <EnquiryForm
                fields={[
                  { name: "name", label: "Full name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
                  { name: "message", label: "Your business plan (optional)", type: "textarea" },
                ]}
                submitLabel="Send enquiry"
                formName={`${c.name} licence enquiry`}
              />
            </div>
          </div>
        </div>
      </section>

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

      <section className="bg-surface px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>Explore activity groups</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">The largest groups in this category</h2>
          <ul className="mt-10 grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
            {topGroups.map(([g, info]) => (
              <li key={g}>
                <Link
                  href={`/business-activities?category=${encodeURIComponent(c.name)}&q=${g}`}
                  className="group flex items-center gap-4 border-b border-heading/15 row-wipe py-5 sm:px-2"
                >
                  <span className="w-14 shrink-0 font-mono text-[14px] font-bold text-bronze">{g}</span>
                  <span className="flex-1 text-[15px] leading-snug text-heading">
                    {info.industry}
                    <span className="block text-[13px] text-body">{info.count.toLocaleString("en-US")} activities</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Get your {c.name.toLowerCase()} licence in four steps</h2>
          <ol className="mt-10 grid border-t border-heading/15 md:grid-cols-2 md:gap-x-16">
            {steps.map((st, i) => (
              <li key={st.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-7">
                <span className="font-display text-[24px] text-heading/25">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[19px] font-bold text-heading">{st.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tint px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mb-8 font-display text-[28px] font-bold leading-snug text-heading sm:text-[32px]">Frequently asked questions</h2>
          <Accordion items={faqs} />
        </div>
      </section>

      <section className="border-t border-line bg-white px-6 py-24 sm:px-12 lg:px-16">
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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}
