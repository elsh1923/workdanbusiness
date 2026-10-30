import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function CtaBand() {
  return (
    <section className="gold-gradient relative isolate overflow-clip px-5 py-20 sm:px-9">
      <span aria-hidden className="float absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full border border-midnight/15" />
      <span aria-hidden className="float absolute -right-8 -top-8 -z-10 h-64 w-64 rounded-full border border-midnight/15" style={{ animationDelay: "-3s" }} />
      <span aria-hidden className="absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-white/20 blur-3xl" />

      <div className="mx-auto flex max-w-[1840px] flex-wrap items-center justify-between gap-10">
        <div>
          <h2 className="font-display text-[40px] font-bold leading-[1.15] text-midnight sm:text-[44px]">Ready to start your business?</h2>
          <p className="mt-3 max-w-xl text-[20px] leading-relaxed text-midnight/75">
            Tell us your plan and we will reply with the right structure and a written quotation.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link data-magnetic href="/#contact" className="rounded-full bg-midnight px-8 py-4 text-[16px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-navy">
            Book a consultation
          </Link>
          <a
            href={whatsappLink("Hello Workdane, I'd like to discuss company setup.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border-2 border-midnight px-8 py-4 text-[16px] font-bold text-midnight transition hover:bg-midnight hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
