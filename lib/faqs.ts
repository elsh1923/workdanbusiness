import type { QA } from "@/components/Accordion";

export const faqGroups: { id: string; title: string; items: QA[] }[] = [
  {
    id: "general",
    title: "General information",
    items: [
      { q: "How do I apply for a new business licence?", a: "Contact us by phone, WhatsApp or the website form. We start with a short consultation, recommend a structure and send a written quotation. Most of the process can be completed online." },
      { q: "Can a foreigner start a business in the UAE?", a: "Yes. Foreign nationals can own companies in the UAE. The ownership options depend on the activity and the structure you choose, and we confirm them for your case." },
      { q: "Can I start a business without a physical office?", a: "Some structures allow flexible or virtual office arrangements that provide a registered business address. Whether this is allowed depends on your activity and structure." },
      { q: "Can I own a UAE company if I do not live in the UAE?", a: "Yes, owners do not have to live in the UAE. If you later decide to relocate, we can help with your residence visa." },
      { q: "What is the difference between mainland and a free zone?", a: "Mainland companies are licensed by the emirate’s economic department and can generally trade across the local market. Free zone companies are licensed within a designated zone and are often set up with full foreign ownership, with some limits on trading directly in the local market." },
    ],
  },
  {
    id: "setup",
    title: "Business setup",
    items: [
      { q: "What are the steps to set up a company?", a: "Choose your activities, choose your structure, reserve a trade name, prepare your documents, obtain approvals and the licence, then open a bank account and arrange visas. Our business setup guide explains each stage." },
      { q: "Can I set up any kind of business?", a: "Most activities can be licensed, but some are restricted or need approval from another authority. Our activity list shows which ones need an approval." },
      { q: "How many activities can I put on one licence?", a: "Many licences allow several related activities. The limit and the combinations allowed depend on the licensing authority, and we confirm them when we choose your activities." },
      { q: "How much does it cost to start a business?", a: "The cost depends on your activity, structure, licence length, visas and extras. Use the cost calculator for an indicative estimate. We confirm the final figure in a written quotation." },
    ],
  },
  {
    id: "licences",
    title: "Licence types and requirements",
    items: [
      { q: "What licence do I need to sell online?", a: "An e-commerce licence lets you sell goods or services through your own website or online marketplaces. If you also hold or ship physical stock, you may need a trading activity as well." },
      { q: "Can I run a small or home-based business?", a: "Businesses need a licence to operate legally, however small. The right licence depends on what you do, where you do it and how big the business is." },
      { q: "What documents are required?", a: "Usually passport copies, visa and Emirates ID copies for residents, and proof of address. The exact list depends on your structure and we send it to you after the first call." },
    ],
  },
  {
    id: "costs",
    title: "Costs and fees",
    items: [
      { q: "What is included in the licence fee?", a: "The licence for the term you choose and your company registration documents. Visas, bank account support, tax registrations and other services are added separately." },
      { q: "Do longer licences cost less?", a: "A multi-year licence can lower the yearly cost. The calculator shows the effect of different lengths." },
      { q: "Can I pay in stages?", a: "Our pay-as-you-go option lets you pay for the licence first and add other services later as your business needs them. Details are confirmed in your quotation." },
    ],
  },
  {
    id: "visas",
    title: "Visas and residency",
    items: [
      { q: "Can I get a residence visa through my company?", a: "Yes. Owners and employees can apply for residence visas once the company holds a licence and an establishment card." },
      { q: "What does a visa involve?", a: "The application, a medical screening and an Emirates ID. Medical insurance is arranged separately." },
      { q: "Can my family join me?", a: "Yes. Once you hold a residence visa you can usually sponsor your spouse, children and sometimes parents, subject to the immigration authority’s rules." },
    ],
  },
  {
    id: "banking",
    title: "Banking and finance",
    items: [
      { q: "Can you help me open a bank account?", a: "We prepare your application and introduce you to partner banks. The bank decides whether to approve the account." },
      { q: "Is financing available?", a: "We can introduce you to lenders who offer finance to small and growing businesses. Approval and terms are set by the lender." },
    ],
  },
  {
    id: "compliance",
    title: "Compliance and renewals",
    items: [
      { q: "Do I need to register for VAT or corporate tax?", a: "Registration depends on your turnover and activity. We check your position and handle the registration where it applies." },
      { q: "Who handles renewals?", a: "Licences and visas expire. We track the dates and remind you in good time, and can complete the renewal for you." },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));
