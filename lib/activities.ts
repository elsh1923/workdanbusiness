export const categories = [
  "General Trading",
  "Professional Services",
  "IT Services",
  "E-Commerce",
  "Administrative Services",
  "Marketing Services",
] as const;

export type Category = (typeof categories)[number];

export type Activity = {
  code: string;
  name: string;
  category: Category;
  fee: number; // AED, indicative placeholder
  approval?: string; // approval needed beyond the standard trade licence
};

// Sample entries. Replace with the full licensable activity list.
export const activities: Activity[] = [
  { code: "GT-101", name: "General trading", category: "General Trading", fee: 5750 },
  { code: "GT-102", name: "Import and export", category: "General Trading", fee: 6250 },
  { code: "GT-103", name: "Wholesale trading", category: "General Trading", fee: 5750 },
  { code: "GT-104", name: "Trading of electronics and accessories", category: "General Trading", fee: 6250 },
  { code: "PS-201", name: "Management consultancy", category: "Professional Services", fee: 5750 },
  { code: "PS-202", name: "Accounting and bookkeeping services", category: "Professional Services", fee: 5250 },
  { code: "PS-203", name: "Business setup consultancy", category: "Professional Services", fee: 6250 },
  { code: "PS-204", name: "Human resources consultancy", category: "Professional Services", fee: 6250, approval: "Labour-related approvals may apply." },
  { code: "PS-205", name: "Translation and interpretation services", category: "Professional Services", fee: 4750 },
  { code: "IT-301", name: "IT consultancy", category: "IT Services", fee: 6250 },
  { code: "IT-302", name: "Software development", category: "IT Services", fee: 6250 },
  { code: "IT-303", name: "Data and cloud services", category: "IT Services", fee: 7250 },
  { code: "IT-304", name: "IT support services", category: "IT Services", fee: 5750 },
  { code: "EC-401", name: "Online retail", category: "E-Commerce", fee: 5750 },
  { code: "EC-402", name: "Online marketplace seller", category: "E-Commerce", fee: 5250 },
  { code: "EC-403", name: "Online store development", category: "E-Commerce", fee: 6250 },
  { code: "AS-501", name: "Office administration services", category: "Administrative Services", fee: 4750 },
  { code: "AS-502", name: "Document processing services", category: "Administrative Services", fee: 4750 },
  { code: "AS-503", name: "Virtual office services", category: "Administrative Services", fee: 5250 },
  { code: "AS-504", name: "Business support services", category: "Administrative Services", fee: 5250 },
  { code: "MS-601", name: "Digital marketing agency", category: "Marketing Services", fee: 5750 },
  { code: "MS-602", name: "Public relations services", category: "Marketing Services", fee: 6250 },
  { code: "MS-603", name: "Graphic design studio", category: "Marketing Services", fee: 5250 },
  { code: "MS-604", name: "Content creation studio", category: "Marketing Services", fee: 5250 },
  { code: "MS-605", name: "Event marketing services", category: "Marketing Services", fee: 6750 },
];
