import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Coins,
  Cpu,
  FileText,
  Gift,
  Globe,
  Handshake,
  HeartPulse,
  Landmark,
  Megaphone,
  Monitor,
  Newspaper,
  PhoneCall,
  Search,
  ShoppingCart,
  Stamp,
  Store,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { categories, type Category } from "./activities";

export type Item = { label: string; href: string; desc: string; icon: LucideIcon };

export type NavGroup = {
  label: string;
  href: string;
  items: Item[];
  promo: { eyebrow: string; title: string; text: string; cta: string; href: string };
};

export const startItems: Item[] = [
  { label: "Pay-as-you-go", href: "/pay-as-you-go", desc: "Flexible payment terms, without a long contract.", icon: Wallet },
  { label: "Cost Calculator", href: "/cost-calculator", desc: "See an indicative setup cost in a few clicks.", icon: Calculator },
  { label: "Business Activities", href: "/business-activities", desc: "Search licensable activities and build a shortlist.", icon: ClipboardList },
  { label: "Invest in UAE", href: "/invest-in-uae", desc: "Ownership options and the advantages of setting up here.", icon: Globe },
  { label: "Name Check", href: "/name-check", desc: "Request a check on your preferred trade names.", icon: Search },
  { label: "Business Setup Guide", href: "/business-setup-guide", desc: "The steps from idea to a licensed, open business.", icon: BookOpen },
  { label: "Refer and Earn", href: "/refer-and-earn", desc: "Introduce a business to us and share the reward.", icon: Gift },
];

const categoryMeta: Record<Category, { text: string; icon: LucideIcon }> = {
  "General Trading": { text: "Import, export and distribute goods to local and international buyers.", icon: Store },
  "Professional Services": { text: "Advisory, consultancy and specialist expertise across sectors.", icon: Briefcase },
  "IT Services": { text: "Build, manage and support digital solutions, software and IT operations.", icon: Cpu },
  "E-Commerce": { text: "Sell goods and services online through your own store or marketplaces.", icon: ShoppingCart },
  "Administrative Services": { text: "Back-office, operations and business support for companies.", icon: ClipboardList },
  "Marketing Services": { text: "Brand growth through campaigns, public relations and digital strategy.", icon: Megaphone },
};

export const licenseCategories = categories.map((name) => ({ name, ...categoryMeta[name] }));

export const licenseItems: Item[] = licenseCategories.map((c) => ({
  label: c.name,
  href: `/business-activities?category=${encodeURIComponent(c.name)}`,
  desc: c.text,
  icon: c.icon,
}));

export const plusServices = [
  { id: "corporate-banking", title: "Corporate Banking", text: "Support opening a business bank account with our partner banks.", icon: Landmark },
  { id: "vip-medical", title: "VIP Medical", text: "Priority medical screening to help visa applications move faster.", icon: HeartPulse },
  { id: "customs-code", title: "Customs Code", text: "Assistance with customs registration for importing and exporting goods.", icon: Stamp },
  { id: "virtual-receptionist", title: "Virtual Receptionist", text: "Professional call handling and front-desk support for your business.", icon: PhoneCall },
  { id: "dedicated-account-manager", title: "Dedicated Account Manager", text: "One named contact who knows your business and follows it through.", icon: UserCheck },
  { id: "family-visas", title: "Spouse and Dependent Visas", text: "Visa processing for your spouse and dependants.", icon: Users },
  { id: "documentation", title: "Documentation", text: "Attestation, translation and notarisation of business and personal documents.", icon: FileText },
  { id: "business-finance", title: "Business Finance", text: "Financing options for small and growing businesses, subject to lender approval.", icon: Coins },
  { id: "coworking", title: "Coworking Space", text: "Flexible workspace options for teams and individuals.", icon: Building2 },
];

export const plusItems: Item[] = plusServices.map((s) => ({
  label: s.title,
  href: `/workdane-plus#${s.id}`,
  desc: s.text,
  icon: s.icon,
}));

export const insightItems: Item[] = [
  { label: "Blogs", href: "/insights#blogs", desc: "Practical guides on setup, visas, VAT and running a business.", icon: Newspaper },
  { label: "Featured In", href: "/insights#featured", desc: "Press mentions and client success stories.", icon: Award },
  { label: "Activity Hub", href: "/insights#activity-hub", desc: "Events, workshops and networking sessions.", icon: CalendarDays },
  { label: "FAQs", href: "/insights#faqs", desc: "Quick answers to common setup questions.", icon: CircleHelp },
];

export const partnerItems: Item[] = [
  { label: "Become a Channel Partner", href: "/partners#channel-partner", desc: "Refer clients to us and share in their success.", icon: Handshake },
  { label: "Channel Partner Portal", href: "/partners#partner-portal", desc: "Tools for approved partners to manage client applications.", icon: Monitor },
  { label: "Corporate Partnerships", href: "/partners#corporate-partnerships", desc: "Set up services for your team or your clients as a group.", icon: Building2 },
];

export const navGroups: NavGroup[] = [
  {
    label: "Start Your Business",
    href: "/start-your-business",
    items: startItems,
    promo: {
      eyebrow: "Estimate",
      title: "Know your setup costs before you start",
      text: "Build an indicative estimate in a few steps, then confirm it with a written quote.",
      cta: "Open the calculator",
      href: "/cost-calculator",
    },
  },
  {
    label: "License Categories",
    href: "/license-categories",
    items: licenseItems,
    promo: {
      eyebrow: "Activities",
      title: "Find the activity that matches your licence",
      text: "Search licensable activities, see the indicative fee and build a shortlist.",
      cta: "Browse business activities",
      href: "/business-activities",
    },
  },
  {
    label: "Workdane Plus",
    href: "/workdane-plus",
    items: plusItems,
    promo: {
      eyebrow: "Beyond setup",
      title: "Support for every stage of growth",
      text: "Banking, visas, medical screening, documentation and a dedicated account manager.",
      cta: "Explore Workdane Plus",
      href: "/workdane-plus",
    },
  },
  {
    label: "Insights",
    href: "/insights",
    items: insightItems,
    promo: {
      eyebrow: "Insights",
      title: "Plan with confidence",
      text: "Guides, news, events and answers to the questions we hear most.",
      cta: "Read the insights",
      href: "/insights",
    },
  },
  {
    label: "Partners",
    href: "/partners",
    items: partnerItems,
    promo: {
      eyebrow: "Partners",
      title: "Grow with Workdane",
      text: "Refer clients, manage applications or set up a corporate partnership.",
      cta: "Explore partnerships",
      href: "/partners",
    },
  },
];

// TODO: replace every rate with the real fee schedule. These figures are placeholders.
export const calculatorRates = {
  base: {
    "General Trading": 5750,
    "Professional Services": 5250,
    "IT Services": 6250,
    "E-Commerce": 5750,
    "Administrative Services": 5250,
    "Marketing Services": 5750,
  } satisfies Record<Category, number>,
  visa: 1250,
  bankIntro: 1000,
  vatRegistration: 750,
};

export const setupSteps = [
  { title: "Choose your activity", text: "Pick the activities your business will perform. Each one has its own requirements, so choose carefully." },
  { title: "Choose your structure", text: "Mainland, free zone or offshore. Ownership rules and client reach differ, so compare them before you decide." },
  { title: "Reserve your trade name", text: "Submit up to three preferred names. Availability is confirmed by the authority." },
  { title: "Prepare your documents", text: "Passport copies, office details and company documents, depending on your structure." },
  { title: "Obtain approvals and licence", text: "Your application goes to the relevant authorities. We track each approval and tell you what is needed." },
  { title: "Open and register", text: "Open the bank account, register for VAT where needed and arrange visas for your team." },
];
