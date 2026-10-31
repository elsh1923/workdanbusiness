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
  seoTitle?: string;
  description?: string;
  sections?: { heading: string; paragraphs: string[] }[];
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
  {
    slug: "how-to-start-a-company-in-uae",
    label: "How to start a company in the UAE",
    seoTitle: "How to Start a Company in the UAE: Steps and Requirements | Workdane",
    description: "A plain guide to starting a company in the UAE: choosing a structure, activities, documents, approvals, visas and a bank account, with help from Workdane.",
    title: "How to start a company",
    accent: "in the UAE.",
    intro: "Starting a company in the UAE follows a clear order of steps. Here is what each one involves, and where a business consultant saves you time.",
    why: [
      { title: "One team for every step", text: "Licence, visas, bank account and renewals stay with the same advisers." },
      { title: "Plain explanations", text: "We explain each requirement and why it applies to you." },
      { title: "Cost estimate online", text: "Use the calculator for a starting figure, then we confirm it for your business." },
    ],
    steps: commonSteps(" Tell us what the business will do and where you want to be based."),
    sections: [
      { heading: "The main steps", paragraphs: [
        "First choose what the company will do. Every UAE licence lists the business activities it covers, and some activities need approval from another authority before the licence is issued.",
        "Next choose the structure: mainland or free zone. Mainland companies can usually trade across the UAE market. Free zone companies suit certain activities and clients. The right choice depends on who your customers are and what you sell.",
        "Then prepare the documents, usually passport copies and proof of address for each owner, and submit the application. After the licence is issued you can apply for residence visas and open a corporate bank account.",
      ] },
      { heading: "How a consultant helps", paragraphs: [
        "A business consultant checks the activity wording, compares structures, prepares the paperwork and follows each approval so you do not lose time to rejected applications.",
      ] },
    ],
    faqs: [
      { q: "How long does it take to start a company?", a: "It depends on the activity and any approvals it needs. We confirm the expected timing before you begin." },
      { q: "Do I need to live in the UAE first?", a: "No. Much of the process can be done remotely. Residence visa steps need a visit." },
      { q: "How much does it cost?", a: "Use our cost calculator for an estimate, then our team confirms the figures for your business." },
    ],
  },
  {
    slug: "company-formation-dubai-for-foreigners",
    label: "Company formation in Dubai for foreigners",
    seoTitle: "Company Formation in Dubai for Foreigners | Workdane",
    description: "How non-UAE residents and foreign investors can form a company in Dubai: ownership, structure, documents, visas and banking, explained by Workdane.",
    title: "Company formation in Dubai",
    accent: "for foreigners.",
    intro: "Foreign investors can form companies in Dubai. We explain the ownership options, the documents you need and what happens after the licence is issued.",
    why: [
      { title: "Guidance for non-residents", text: "You can start before you move. We tell you which steps need you present." },
      { title: "Ownership explained", text: "Rules depend on the activity and structure. We confirm what applies to you." },
      { title: "An office in Deira", text: "Meet us in person in Dubai, or work with us remotely." },
    ],
    steps: commonSteps(" We can speak by phone or WhatsApp if you are abroad."),
    sections: [
      { heading: "Can foreigners own a Dubai company?", paragraphs: [
        "Yes. Many activities now allow full foreign ownership, and others need a local partner or a particular structure. Ownership rules vary by activity, so the first job is to check yours.",
      ] },
      { heading: "What you will usually need", paragraphs: [
        "A clear passport copy for each owner, proof of address, and a description of the business activities. If a shareholder is a company, its own registration documents are needed, often attested.",
      ] },
    ],
    faqs: [
      { q: "Can I form a company without visiting Dubai?", a: "Most of the application can be done remotely. Residence visa steps, such as the medical screening, need you in the UAE." },
      { q: "Can I get a residence visa through my company?", a: "Yes. Once the company is licensed, owners and employees can apply for residence visas." },
      { q: "Can I open a bank account?", a: "We help with the application. Approval is up to the bank, which reviews each company." },
    ],
  },
  {
    slug: "business-consultant-deira-dubai",
    label: "Business consultant in Deira, Dubai",
    seoTitle: "Business Consultant in Deira, Dubai | Company Setup | Workdane",
    description: "Visit Workdane Management Consultancy in Port Saeed, Deira, Dubai for company setup, licences, visas and business support. Call +971 56 537 4748.",
    title: "Business consultant in",
    accent: "Deira, Dubai.",
    intro: "Our Dubai office is in Port Saeed, Deira. Visit us for company setup, licensing, visas and everyday business support, or speak to us by phone or WhatsApp.",
    why: [
      { title: "Find us in Port Saeed", text: "Al Khaimah Building, 3rd Floor, Office 34, Port Saeed, Deira, Dubai." },
      { title: "Speak to us directly", text: "Call or WhatsApp +971 56 537 4748 to arrange a visit." },
      { title: "Full support", text: "Licensing, visas, bank account, tax registration and renewals." },
    ],
    steps: commonSteps(" Book a time and visit our Deira office."),
    sections: [
      { heading: "What we help with in Dubai", paragraphs: [
        "We help new and existing businesses with company setup, choosing a licence and activities, residence visas, corporate banking applications, tax registration and renewals.",
      ] },
    ],
    faqs: [
      { q: "Do I need an appointment?", a: "We recommend booking so an adviser is free to meet you. You can book online or call us." },
      { q: "Can I meet you outside office hours?", a: "Ask when you contact us. We try to arrange a time that suits you." },
    ],
  },
  {
    slug: "uae-business-licence",
    label: "UAE business licence",
    seoTitle: "UAE Business Licence: Types, Activities and Cost | Workdane",
    description: "Understand UAE business licence types, activities and approvals, and estimate the cost of your licence with Workdane's calculator.",
    title: "Get your",
    accent: "UAE business licence.",
    intro: "A business licence lets your company operate legally in the UAE. We explain the licence types, help you choose activities and manage the approvals.",
    why: [
      { title: "2,000+ activities", text: "Search activities by name or code and see which need third-party approval." },
      { title: "Cost estimate online", text: "Use the calculator for a starting estimate. We confirm the final figures." },
      { title: "Approvals handled", text: "We follow each approval so your licence is not delayed." },
    ],
    steps: commonSteps(" Bring a list of what your business will do."),
    sections: [
      { heading: "Licence types", paragraphs: [
        "Common licence types include trading, professional, service, e-commerce and industrial. The type depends on the activities you want to carry out.",
        "Some activities need approval from another authority first. We check this at the start so there are no surprises later.",
      ] },
    ],
    faqs: [
      { q: "How much does a business licence cost?", a: "It depends on the licence and your choices. Use our cost calculator for an estimate." },
      { q: "Can I add activities later?", a: "Usually yes, by amending the licence. Fees and approvals may apply." },
      { q: "How long is a licence valid?", a: "Licences are renewed periodically. We remind you and handle the renewal." },
    ],
  },
  {
    slug: "mainland-company-setup-uae",
    label: "Mainland company setup in the UAE",
    seoTitle: "Mainland Company Setup in the UAE | Workdane",
    description: "What a UAE mainland company is, who it suits and how to set one up. Compare mainland with free zone with Workdane's advisers.",
    title: "Mainland company setup",
    accent: "in the UAE.",
    intro: "A mainland company can usually trade across the UAE market. We explain how it works, how it differs from a free zone company and whether it suits your plan.",
    why: [
      { title: "Compare before you choose", text: "We set mainland and free zone side by side for your activity." },
      { title: "Clear requirements", text: "We tell you what premises, documents and approvals apply." },
      { title: "Support after licence", text: "Visas, banking and renewals handled by the same team." },
    ],
    steps: commonSteps(" We start by asking who your customers are."),
    sections: [
      { heading: "Who mainland suits", paragraphs: [
        "Mainland suits businesses that want to serve customers across the UAE, including government and retail clients. Free zone suits some activities and clients better, so the choice depends on your plan.",
      ] },
    ],
    faqs: [
      { q: "What is the difference between mainland and free zone?", a: "Mainland companies can usually trade across the UAE market. Free zone companies operate under their zone's rules. Our article on the topic goes into more detail." },
      { q: "Can I own 100% of a mainland company?", a: "Many activities allow it. Ownership depends on the activity, and we confirm yours." },
    ],
  },
  {
    slug: "free-zone-company-setup-uae",
    label: "Free zone company setup in the UAE",
    seoTitle: "Free Zone Company Setup in the UAE | Workdane",
    description: "How free zone company setup works in the UAE, who it suits and how it compares with mainland. Speak to Workdane's consultants.",
    title: "Free zone company setup",
    accent: "in the UAE.",
    intro: "Free zones offer licences with their own rules and benefits. We help you decide if a free zone suits your business, and handle the setup.",
    why: [
      { title: "Honest comparison", text: "We tell you when mainland is the better fit." },
      { title: "Sharjah office", text: "We are based in Sharjah Publishing City." },
      { title: "End-to-end support", text: "Licence, visas and bank account in one place." },
    ],
    steps: commonSteps(" We confirm the rules of the zone that fits you."),
    sections: [
      { heading: "How free zones work", paragraphs: [
        "Each free zone sets its own rules for activities, ownership and premises. Free zones suit businesses that mainly serve international clients or particular industries.",
        "Rules differ between zones, so we confirm the current requirements for the one you are considering.",
      ] },
    ],
    faqs: [
      { q: "Can a free zone company trade across the UAE?", a: "Usually there are limits on selling directly to the UAE market. We explain what applies to your case." },
      { q: "Do I need a physical office?", a: "It depends on the zone and licence. Some allow flexible arrangements." },
    ],
  },
];

export const landingBySlug = (slug: string) => landings.find((l) => l.slug === slug);
