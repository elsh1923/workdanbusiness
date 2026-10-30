import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, CONTACT, LOGO_LIGHT, OFFICES } from "@/lib/config";
import { startItems } from "@/lib/content";
import RollText from "./RollText";

const company = [
  { label: "Workdane Plus", href: "/workdane-plus" },
  { label: "Insights", href: "/insights" },
  { label: "Partners", href: "/partners" },
  { label: "Resource Hub", href: "/resource-hub" },
  { label: "Contact", href: "/contact" },
];

const heading = "mb-5 text-[13px] font-extrabold uppercase tracking-[0.3em] text-gold-light";

export default function Footer() {
  return (
    <footer className="bg-midnight text-white/70">
      <div className="mx-auto grid max-w-[1840px] gap-14 px-5 py-20 sm:px-9 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <div className="inline-block">
            <Image src={LOGO_LIGHT.src} alt={COMPANY.name} width={LOGO_LIGHT.width} height={LOGO_LIGHT.height} className="h-28 w-auto" />
          </div>
          <p className="mt-8 max-w-xs font-display text-[21px] italic leading-snug text-white">Set up right. Stay compliant. Grow with confidence.</p>
        </div>

        <nav aria-label="Start your business">
          <h2 className={heading}>Start your business</h2>
          <ul className="space-y-3 text-[15px]">
            {startItems.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="transition hover:text-white">
                  <RollText>{n.label}</RollText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className={heading}>Company</h2>
          <ul className="space-y-3 text-[15px]">
            {company.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="transition hover:text-white">
                  <RollText>{n.label}</RollText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>Contact</h2>
          <ul className="space-y-4 text-[15px]">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {CONTACT.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="flex flex-col gap-1">
                <span>{CONTACT.email}</span>
                <span>{CONTACT.emailSecondary}</span>
              </span>
            </li>
          </ul>
          <ul className="mt-6 space-y-5 text-[15px]">
            {OFFICES.map((o) => (
              <li key={o.name} className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  <span className="block text-[13px] font-bold uppercase tracking-widest text-gold-light">{o.name} office</span>
                  {o.lines.join(", ")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] leading-relaxed text-white/45">
            {CONTACT.legalName}
            <br />
            Business licence no. {CONTACT.licenceNo}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1840px] flex-wrap justify-between gap-4 px-5 pb-24 pt-6 text-[13px] text-white/45 sm:px-9 sm:pb-6 sm:pr-28">
          <span>© 2026 {COMPANY.name}. All rights reserved.</span>
          <span>Company setup and business services, UAE</span>
        </div>
      </div>
    </footer>
  );
}
