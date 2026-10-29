import type { LucideIcon } from "lucide-react";
import { Building2, Calculator, IdCard, Landmark, Stamp } from "lucide-react";

export const services: { title: string; summary: string; points: string[]; icon: LucideIcon }[] = [
  {
    title: "Company formation",
    summary: "Mainland, free zone and offshore structures, from name reservation through to your trade licence.",
    points: ["Structure advice", "Name reservation", "Licence and registration"],
    icon: Building2,
  },
  {
    title: "Licensing & approvals",
    summary: "The right activities and approvals from the start, with amendments and renewals tracked before they lapse.",
    points: ["Activity selection", "Amendments", "Renewals"],
    icon: Stamp,
  },
  {
    title: "Visas & PRO services",
    summary: "Employment, family and investor visas, with Emirates ID and medical appointments arranged for you.",
    points: ["Visa processing", "Emirates ID", "Medical appointments"],
    icon: IdCard,
  },
  {
    title: "Accounting, VAT & tax",
    summary: "Bookkeeping, VAT registration and returns, and corporate tax registration handled on schedule.",
    points: ["Monthly bookkeeping", "VAT returns", "Corporate tax registration"],
    icon: Calculator,
  },
  {
    title: "Banking & advisory",
    summary: "Introductions to banks, document preparation and ongoing advice as your business grows.",
    points: ["Bank introductions", "Document preparation", "Ongoing advisory"],
    icon: Landmark,
  },
];
