import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import { postBySlug, posts } from "@/lib/blogs";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  return p ? { title: `${p.title} | Workdane`, description: p.summary } : {};
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();

  return (
    <>
      <PageHero eyebrow="Blogs" title={<>{p.title}</>} intro={p.summary} />
      <article className="bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {p.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-[24px] font-bold text-heading">{s.heading}</h2>
              {s.body.map((t) => (
                <p key={t} className="mt-4 text-[16px] leading-relaxed">
                  {t}
                </p>
              ))}
            </div>
          ))}
          <p className="border-t border-line pt-8 text-[13px] leading-relaxed text-body">
            This article is general information, not legal or financial advice. Requirements change, so we confirm them for your case in writing.
          </p>
          <Link href="/blogs" className="group inline-flex items-center gap-2 text-[15px] font-bold text-navy">
            <ArrowLeft className="h-4 w-4 text-gold transition group-hover:-translate-x-1" />
            <span className="underline decoration-gold decoration-2 underline-offset-4">All articles</span>
          </Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
