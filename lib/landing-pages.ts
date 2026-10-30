import type { QA } from "@/components/Accordion";

export type Landing = {
  slug: string;
  label: string;
  title: string;
  accent: string;
  intro: string;
  why: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  faqs: QA[];
};

const commonSteps = (extra: string): Landing["steps"] => [
  { title: "Talk to an adviser", text: `A short call to understand your plan.${extra}` },
  { title: "Choose activities and structure", text: "We recommend the licence type, activities and approvals that fit your business." },
  { title: "Prepare and submit", text: "We prepare your documents, submit the application and follow each approval." },
  { title: "Visas and bank account", text: "Once your licence is issued we help with residence visas and opening a bank account." },
];

export const landings: Landing[] = [
  {
    slug: "dubai",
    label: "Business setup in Dubai",
    title: "Business setup in",
    accent: "Dubai.",
    intro: "Dubai is one of the busiest trading and service hubs in the region. We help you choose the right structure and licence, and we have an office in Deira so you can meet us in person.",
    why: [
      { title: "An office in Dubai", text: "Meet your adviser at our Deira office, or work with us remotely." },
      { title: "A choice of structures", text: "We compare mainland and free zone options so you choose on facts, not guesses." },
      { title: "Everything in one place", text: "Licensing, visas, bank account, tax registration and renewals through one team." },
    ],
    steps: commonSteps(" You can do it in person in Dubai or by phone."),
    faqs: [
      { q: "Do I need an office to set up in Dubai?", a: "It depends on the structure and activity. Some options allow flexible or virtual arrangements and others need dedicated premises. We confirm what applies to you." },
      { q: "Can I own 100% of my company?", a: "Ownership rules depend on your activity and structure. Many activities now allow full foreign ownership. We confirm the position for your case." },
      { q: "Can I live in Dubai on my company’s visa?", a: "Yes. Once your company is licensed, owners and employees can apply for residence visas." },
    ],
  },
  {
    slug: "sharjah",
    label: "Business setup in Sharjah",
    title: "Business setup in",
    accent: "Sharjah.",
    intro: "Sharjah offers a practical base close to Dubai and the northern emirates. Our Sharjah office is in Sharjah Publishing City, so you can start your setup close to where your business will be.",
    why: [
      { title: "A Sharjah office", text: "We are based in Sharjah Publishing City and can meet you there." },
      { title: "Close to Dubai", text: "Reach customers across the emirates while keeping your base in Sharjah." },
      { title: "A wide choice of activities", text: "Search more than two thousand licensable activities and see which need approvals." },
    ],
    steps: commonSteps(" Visit our Sharjah office or speak to us remotely."),
    faqs: [
      { q: "Why choose Sharjah?", a: "Many founders choose Sharjah for its location and the range of licence options. We compare it with other places for your particular plan." },
      { q: "Can I live in Dubai and have a Sharjah company?", a: "Yes. Owners may live in any emirate. Visa and address requirements depend on the licence." },
      { q: "How long does setup take?", a: "It depends on your activity and any approvals it needs. We confirm the expected timing in writing before you start." },
    ],
  },
  {
    slug: "from-the-uk",
    label: "Business setup from the UK",
    title: "Set up in the UAE",
    accent: "from the UK.",
    intro: "If you live in the United Kingdom, you can start a UAE company without moving first. We handle the paperwork with you remotely and arrange the in-person steps when you are ready to travel.",
    why: [
      { title: "Start from where you are", text: "Calls, documents and signatures can mostly be handled online." },
      { title: "Clear document guidance", text: "We tell you which UK documents need attesting or translating, and in what order." },
      { title: "Plan your travel once", text: "We group the steps that need you in the UAE, such as the medical screening and Emirates ID." },
    ],
    steps: commonSteps(" We can speak outside UK office hours where possible."),
    faqs: [
      { q: "Can I own a UAE company while living in the UK?", a: "Yes. Owners do not need to live in the UAE. Some steps, such as residence visas, need a visit." },
      { q: "Will UK documents need attestation?", a: "Some do, especially when a shareholder is a company. We list exactly what is needed for your case." },
      { q: "Can I keep my UK job or business?", a: "A UAE company does not stop you running other business. Your own tax and employment position is a matter for your advisers." },
    ],
  },
  {
    slug: "from-india",
    label: "Business setup from India",
    title: "Set up in the UAE",
    accent: "from India.",
    intro: "Many Indian entrepreneurs set up in the UAE to reach new markets. We guide you from the first call to your licence and, when you are ready, your residence visa.",
    why: [
      { title: "Guidance in your language", text: "Tell us your preferred language when you contact us, and we will do our best to match it." },
      { title: "Remote start", text: "Begin the application from India and travel only for the steps that need you." },
      { title: "Support after setup", text: "Visas, bank account, tax registration and renewals stay with the same team." },
    ],
    steps: commonSteps(" You can contact us on WhatsApp or by phone."),
    faqs: [
      { q: "Can I start the process from India?", a: "Yes. Most of the application can be completed remotely. Some visa steps need you in the UAE." },
      { q: "Which documents do I need?", a: "Usually passport copies and proof of address. We send the exact list after the first call." },
      { q: "Can my family join me?", a: "Once you hold a residence visa you can usually sponsor your spouse and children, subject to the immigration authority’s rules." },
    ],
  },
];

export const landingBySlug = (slug: string) => landings.find((l) => l.slug === slug);
