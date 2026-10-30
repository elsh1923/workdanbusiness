import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function CtaBand() {
  return (
    <section className="hero-bg grain relative isolate overflow-clip px-6 py-20 text-white sm:px-12 lg:px-16">
      <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />
      <span aria-hidden className="float absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full border border-gold-light/25" />
      <span aria-hidden className="float absolute -right-8 -top-8 -z-10 h-64 w-64 rounded-full border border-gold-light/25" style={{ animationDelay: "-3s" }} />
      <span aria-hidden className="absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-10">
        <Image
          src="/support-agent.png"
          alt="A friendly Workdane consultant at the support desk giving a thumbs up"
          width={351}
          height={626}
          className="hidden h-52 w-40 rounded-2xl object-cover object-top ring-2 ring-gold/60 lg:block"
        />
        <div className="flex-1 basis-80">
          <h2 className="font-display text-[34px] font-bold leading-[1.15] sm:text-[38px]">Ready to start your business?</h2>
          <p className="mt-3 max-w-xl text-[18px] leading-relaxed text-white/90">
            Tell us your plan and we will reply with the right structure and a written quotation.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            data-magnetic
            href="/#contact"
            className="gold-gradient btn-shine rounded-full px-8 py-4 text-[15px] font-bold text-midnight shadow-[0_12px_30px_-10px_rgba(217,154,11,0.6)] transition hover:-translate-y-0.5"
          >
            Book a consultation
          </Link>
          <a
            href={whatsappLink("Hello Workdane, I'd like to discuss company setup.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-[15px] font-bold text-white transition hover:border-gold-light hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
