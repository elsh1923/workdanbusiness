import Link from "next/link";
import Eyebrow from "./Eyebrow";
import Skyline from "./Skyline";

export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-bg grain relative isolate overflow-clip px-6 pb-52 pt-32 text-white sm:px-12 lg:px-16 sm:pt-40">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="drift pointer-events-none absolute -right-20 top-24 -z-10 h-[340px] w-[340px] rounded-full bg-gold/15 blur-3xl" />
      <Skyline className="parallax-b pointer-events-none absolute bottom-0 left-[-4rem] -z-10 h-[170px] w-[calc(100%+8rem)] opacity-70" />
      <div className="mx-auto max-w-[1840px]">
        <nav aria-label="Breadcrumb" className="rise mb-10 flex items-center gap-2 text-[15px] text-white/80">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="font-semibold text-white">{eyebrow}</span>
        </nav>
        <div className="rise">
          <Eyebrow light>{eyebrow}</Eyebrow>
        </div>
        <h1 className="rise max-w-4xl font-display text-[34px] font-bold leading-[1.2] sm:text-[48px]">{title}</h1>
        {intro && (
          <p className="rise mt-8 max-w-2xl text-[18px] leading-relaxed text-white/90" style={{ animationDelay: "0.15s" }}>
            {intro}
          </p>
        )}
        {children && (
          <div className="rise mt-10" style={{ animationDelay: "0.25s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
