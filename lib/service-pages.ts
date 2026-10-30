import type { Category } from "./activities";

export type CategoryPage = {
  name: Category;
  slug: string;
  tagline: string;
  intro: string;
  suits: string[];
  covers: string[];
  considerations: string[];
};

export const categoryPages: CategoryPage[] = [
  {
    name: "General Trading",
    slug: "general-trading",
    tagline: "Buy, sell, import and export goods.",
    intro:
      "A general trading licence lets you trade goods with local and international buyers. It is the broadest category, covering wholesale, retail, import, export and re-export of many product types.",
    suits: ["Importers, exporters and distributors", "Wholesalers and retailers", "Businesses sourcing products for resale", "Companies trading several product lines"],
    covers: ["Wholesale and retail of goods", "Import, export and re-export", "Commodity and consumer product trading", "Brokerage and agency of goods"],
    considerations: [
      "Some products need approval from a regulator before you can trade them.",
      "A customs code is needed to import or export. Our Customs Code service can arrange it.",
      "Warehouse or office space requirements depend on your structure.",
    ],
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    tagline: "Advice and expertise as a business.",
    intro:
      "Professional services licences suit people and firms who sell their knowledge: consultants, advisers, designers, engineers and other specialists serving business and private clients.",
    suits: ["Management and business consultants", "Engineering, design and architecture practices", "Legal, accounting and advisory support firms", "Freelancers turning their skills into a company"],
    covers: ["Management and business consultancy", "Engineering and technical consultancy", "Design and creative services", "Research, training and advisory services"],
    considerations: [
      "Regulated professions may need a professional qualification or an approval before the licence is issued.",
      "Your named activities decide which approvals apply, so choose them carefully.",
      "Visas for your team are arranged after the licence is issued.",
    ],
  },
  {
    name: "IT Services",
    slug: "it-services",
    tagline: "Build, run and support technology.",
    intro:
      "IT licences cover companies that create or manage digital products and systems: software, web and app development, hosting, data services and IT support for other businesses.",
    suits: ["Software and app developers", "Web and digital agencies", "Managed IT and support providers", "Data, hosting and cloud service firms"],
    covers: ["Software and application development", "Web design and development", "Computer consultancy and support", "Data processing, hosting and related services"],
    considerations: [
      "Some digital activities, such as payments or telecoms, need approval from the relevant authority.",
      "Selling software online may also need an e-commerce activity. We can add both to one licence where the authority allows it.",
    ],
  },
  {
    name: "E-Commerce",
    slug: "e-commerce",
    tagline: "Sell online through your own store or marketplaces.",
    intro:
      "An e-commerce licence is for businesses that sell goods or services mainly online, whether through their own website, social channels or third-party marketplaces.",
    suits: ["Online store owners", "Sellers on marketplaces", "Brands selling direct to customers", "Businesses adding an online channel"],
    covers: ["Retail sale through websites and apps", "Sale through online marketplaces", "Online sale of services and digital products"],
    considerations: [
      "Selling physical goods usually also needs a trading activity on the licence.",
      "Payment gateway and bank account requirements vary by provider.",
      "Delivery and returns arrangements are your responsibility, and we can point you to partners.",
    ],
  },
  {
    name: "Administrative Services",
    slug: "administrative-services",
    tagline: "Support other businesses to run smoothly.",
    intro:
      "Administrative services licences suit companies that supply back-office, operational and support services to other organisations, from office support to facilities and staffing assistance.",
    suits: ["Business support and outsourcing firms", "Facilities and office service providers", "Travel, event and document service companies", "Rental and leasing businesses"],
    covers: ["Office and back-office support", "Rental and leasing of equipment", "Facilities and building support", "Travel, events and other support activities"],
    considerations: [
      "Staffing and recruitment activities usually need an extra approval.",
      "Some activities need a physical office. We confirm this for your chosen activity.",
    ],
  },
  {
    name: "Marketing Services",
    slug: "marketing-services",
    tagline: "Grow brands through campaigns and content.",
    intro:
      "Marketing licences cover agencies and specialists who plan and run advertising, public relations, branding, content and digital marketing for clients.",
    suits: ["Advertising and branding agencies", "Public relations and communications firms", "Digital marketing and social media specialists", "Content, photo and video producers"],
    covers: ["Advertising and campaign management", "Public relations and communications", "Market research and branding", "Content and digital marketing services"],
    considerations: [
      "Media and publishing related activities often need approval from a media authority.",
      "Your activity list should match the services you actually invoice for.",
    ],
  },
];

export const categoryBySlug = (slug: string) => categoryPages.find((c) => c.slug === slug);
export const categorySlug = (name: Category) => categoryPages.find((c) => c.name === name)!.slug;

export type PlusPage = {
  id: string;
  intro: string;
  includes: string[];
  steps: { title: string; text: string }[];
  note: string;
};

export const plusPages: PlusPage[] = [
  {
    id: "corporate-banking",
    intro: "A business bank account is needed to receive payments and pay suppliers. We prepare your application and introduce you to our partner banks so the process moves without repeated back and forth.",
    includes: ["Help choosing a suitable bank for your business", "Preparation and review of the application documents", "Introduction to the bank and follow-up on progress", "Guidance on the questions banks commonly ask"],
    steps: [
      { title: "Share your plan", text: "Tell us about your activity, owners, expected turnover and who you trade with." },
      { title: "We prepare the file", text: "We assemble and check the documents so the application is complete the first time." },
      { title: "Bank review", text: "The bank reviews your application and may ask for more information. We help you respond quickly." },
    ],
    note: "Account opening is decided by each bank. We cannot guarantee approval.",
  },
  {
    id: "vip-medical",
    intro: "Residence visas need a medical screening. The VIP medical service gives you a priority appointment so the visa application is not held up waiting for a slot.",
    includes: ["Priority appointment booking", "Guidance on what to bring and how it works", "Support for owners, employees and dependants", "Coordination with your visa application"],
    steps: [
      { title: "We book your slot", text: "Tell us when you will be in the UAE and we arrange the earliest suitable appointment." },
      { title: "Attend the screening", text: "Go to the centre with your documents. We tell you exactly what is needed." },
      { title: "Visa continues", text: "The result is linked to your visa file and the application carries on." },
    ],
    note: "Medical results are issued by the health centre. Fees and availability are confirmed when you book.",
  },
  {
    id: "customs-code",
    intro: "A customs code identifies your company when goods cross the border. If you import or export, we help you register so shipments are not delayed at clearance.",
    includes: ["Review of whether you need a customs code", "Preparation of the registration documents", "Submission and follow-up with the authority", "Guidance on next steps for your first shipment"],
    steps: [
      { title: "Check your needs", text: "We confirm that your licence activities allow the trade you plan." },
      { title: "Register", text: "We submit the application with your company documents." },
      { title: "Start trading", text: "Once the code is issued you can use it with your freight forwarder or clearing agent." },
    ],
    note: "Requirements depend on your licence and the goods you handle.",
  },
  {
    id: "virtual-receptionist",
    intro: "A professional voice for your business when you cannot answer. Calls are answered in your company name and passed to you or logged, so customers are never left on a ringing line.",
    includes: ["Calls answered in your company name", "Messages and call summaries sent to you", "Call transfer to your own number when you want it", "Support during agreed business hours"],
    steps: [
      { title: "Tell us how to answer", text: "Share your company greeting, hours and who calls should reach." },
      { title: "Go live", text: "We set up your number or forwarding and test it with you." },
      { title: "Receive updates", text: "You get summaries of calls so nothing is missed." },
    ],
    note: "Service hours and number options are confirmed in your quotation.",
  },
  {
    id: "dedicated-account-manager",
    intro: "One named person who knows your company and keeps its paperwork on track. Instead of explaining your business each time, you contact the same manager for renewals, amendments and questions.",
    includes: ["A single named contact for your account", "Reminders before licence and visa renewals", "Help with amendments and new applications", "Coordination of our other services for you"],
    steps: [
      { title: "We get to know you", text: "Your manager reviews your company file and your plans for the year." },
      { title: "A calendar of dates", text: "Renewals and deadlines are tracked so you are told early." },
      { title: "Ask anytime", text: "Message or call your manager when something comes up." },
    ],
    note: "Scope and response times are agreed in writing when you sign up.",
  },
  {
    id: "family-visas",
    intro: "Bring your family to the UAE. We prepare and submit visa applications for your spouse and dependants and arrange the steps that follow, such as medical screening and Emirates ID.",
    includes: ["Eligibility check before you apply", "Document preparation and attestation guidance", "Visa application submission and tracking", "Medical appointment and Emirates ID arrangements"],
    steps: [
      { title: "Confirm eligibility", text: "We check your own visa status and the requirements for each family member." },
      { title: "Prepare documents", text: "Certificates and passports are collected, checked and attested where needed." },
      { title: "Apply and follow up", text: "We submit the application and keep you informed until the visa is issued." },
    ],
    note: "Eligibility and fees are set by the immigration authority and confirmed for your case.",
  },
  {
    id: "documentation",
    intro: "Official documents often need to be attested, translated or notarised before an authority accepts them. We handle the running around so you do not have to.",
    includes: ["Attestation of certificates and company documents", "Legal translation", "Notarisation", "Document checks before submission"],
    steps: [
      { title: "Send your documents", text: "Share copies and tell us where the document will be used." },
      { title: "We process", text: "We arrange the attestation, translation or notarisation required." },
      { title: "Collect or receive", text: "Your finished documents are returned to you or submitted for you." },
    ],
    note: "Processing times depend on the issuing country and the authority involved.",
  },
  {
    id: "business-finance",
    intro: "Growing businesses often need funding for stock, equipment or working capital. We introduce you to lenders and help you present your business clearly.",
    includes: ["Review of your financing needs", "Help preparing the documents lenders ask for", "Introduction to suitable finance providers", "Support through the application"],
    steps: [
      { title: "Explain what you need", text: "Tell us the purpose, amount and timing you have in mind." },
      { title: "Prepare the file", text: "We organise your company and financial documents." },
      { title: "Lender review", text: "The lender assesses your application and we help answer questions." },
    ],
    note: "Financing is subject to lender approval and terms. Workdane does not lend money.",
  },
  {
    id: "coworking",
    intro: "Flexible workspace for teams and individuals who do not need a full office. Use a desk when you need it, with meeting space and business facilities on hand.",
    includes: ["Flexible desks and shared work areas", "Meeting room access", "Business address options where the licence allows", "Short and longer term plans"],
    steps: [
      { title: "Tell us your needs", text: "Share your team size, how often you will work from the space and your budget." },
      { title: "Visit or confirm", text: "We arrange a visit or confirm availability." },
      { title: "Move in", text: "We help with the agreement and getting your team set up." },
    ],
    note: "Locations, prices and availability are confirmed for your request.",
  },
];

export const plusPageById = (id: string) => plusPages.find((p) => p.id === id);

export const plusExtras: Record<string, { documents: string[]; faqs: { q: string; a: string }[] }> = {
  "corporate-banking": {
    documents: ["Passport copies of owners and signatories", "Company licence and registration documents", "Proof of address for each owner", "A short description of your business and expected activity"],
    faqs: [
      { q: "Why do I need a corporate bank account?", a: "Most companies need one to invoice customers, receive payments and pay suppliers and staff." },
      { q: "Can you guarantee the account will be opened?", a: "No. Each bank makes its own decision. We prepare a complete application and follow it up to give it the best chance." },
      { q: "Do I need to be in the UAE?", a: "Some banks ask for a meeting. We tell you in advance whether your chosen bank needs you to attend." },
    ],
  },
  "vip-medical": {
    documents: ["Passport copy", "Passport-size photo", "Entry permit or visa application number", "Appointment confirmation we send you"],
    faqs: [
      { q: "What does the screening include?", a: "A standard visa medical test at an approved centre. We tell you what to bring and what to expect." },
      { q: "Can my family use it?", a: "Yes. Dependants applying for a residence visa need the same screening, and we can book them together." },
      { q: "Is the result immediate?", a: "Timing depends on the centre. We follow the result and link it to your visa file." },
    ],
  },
  "customs-code": {
    documents: ["Company licence", "Passport copies of owners", "Company stamp where required", "Details of the goods you plan to import or export"],
    faqs: [
      { q: "Do I need a customs code?", a: "If you import or export goods under your company name, you normally do." },
      { q: "Does my licence need a trading activity?", a: "Yes, the licence should include the trading activities that match your goods." },
      { q: "How long does registration take?", a: "It depends on the authority and the completeness of your file. We confirm timing when we start." },
    ],
  },
  "virtual-receptionist": {
    documents: ["Your company name and greeting wording", "Business hours", "Numbers calls should be forwarded to", "A list of common questions callers ask"],
    faqs: [
      { q: "Will calls be answered in my company name?", a: "Yes. We use the greeting you give us." },
      { q: "Can I keep my existing number?", a: "Number options are confirmed when you sign up. Often calls are forwarded from a new line." },
      { q: "How do I get messages?", a: "You receive summaries by email or WhatsApp, depending on what you prefer." },
    ],
  },
  "dedicated-account-manager": {
    documents: ["Your company licence and visa details", "A list of upcoming renewals you already know of", "Your preferred way to be contacted"],
    faqs: [
      { q: "What does my manager do?", a: "Tracks your renewals and deadlines, and is your first contact for amendments, new applications and questions." },
      { q: "Is the manager one person?", a: "You have a named contact. Cover is arranged when they are away." },
      { q: "How is the service priced?", a: "Scope and price are agreed in writing before you start." },
    ],
  },
  "family-visas": {
    documents: ["Your own residence visa and Emirates ID", "Passports of family members", "Marriage and birth certificates, attested where needed", "Proof of address and income documents where required"],
    faqs: [
      { q: "Who can I sponsor?", a: "Usually a spouse, children and sometimes parents. The immigration authority sets the conditions." },
      { q: "Do certificates need attestation?", a: "Often yes. Our documentation service can arrange attestation and translation." },
      { q: "Do family members need a medical test?", a: "Yes, as part of the residence visa process." },
    ],
  },
  documentation: {
    documents: ["The original or a clear copy of each document", "The country of issue", "Where the document will be used", "The language it needs to be translated into"],
    faqs: [
      { q: "What is attestation?", a: "Official confirmation by the relevant authorities that a document is genuine, so it is accepted in the UAE." },
      { q: "Can you translate documents?", a: "Yes, we arrange legal translation into Arabic or English." },
      { q: "How long does it take?", a: "It depends on the issuing country and the authority. We give you an estimate for your documents." },
    ],
  },
  "business-finance": {
    documents: ["Company licence", "Recent bank statements", "Financial statements or management accounts", "A short description of why you need the funds"],
    faqs: [
      { q: "Do you lend money?", a: "No. We introduce you to lenders and help you prepare your application." },
      { q: "Will I be approved?", a: "Approval and terms are decided by the lender." },
      { q: "Can new companies apply?", a: "Some lenders consider new companies. Requirements vary, and we explain them for your case." },
    ],
  },
  coworking: {
    documents: ["Your company licence, if you have one", "Passport copies for users of the space", "How many people will use it and how often"],
    faqs: [
      { q: "Can I use the address for my licence?", a: "Where the licence allows a flexible desk arrangement, yes. We confirm this for your structure." },
      { q: "Is there meeting room access?", a: "Meeting space is available on request. Details are confirmed for your location." },
      { q: "Can I change my plan later?", a: "Plans can usually be changed. The terms are in your agreement." },
    ],
  },
};
