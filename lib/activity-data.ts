import raw from "./activity-data.json";
import type { Category } from "./activities";

export type LicenceCategory = Category | "Other";

export type Activity = {
  id: string;
  group: string;
  sub: string; // activity code
  type: string; // Standard, Publishing or Electronic Publishing
  industry: string;
  name: string;
  authority: string | null; // third-party approval, if one is needed
  timing: "before" | "after" | null; // when that approval is needed relative to the licence
  dnfbp: boolean; // regulated business or profession (anti-money-laundering rules apply)
  notes: string;
  category: LicenceCategory;
  search: string; // lower-cased text the search box looks through
};

// group, code, type index, industry index, name, authority index (-1 = none), timing (0 none, 1 before, 2 after), dnfbp, notes
type Row = [string, string, number, number, string, number, number, number, string];

export const activityTypes = raw.types as string[];
export const industries = raw.industries as string[];
const authorities = raw.authorities as string[];

// Maps an activity to one of the six licence categories used in the site menus.
function categoryOf(group: string, sub: string): LicenceCategory {
  const division = parseInt(group.slice(0, 2), 10);
  if (sub.startsWith("4791")) return "E-Commerce";
  if (sub.startsWith("7021") || division === 73) return "Marketing Services";
  if ([61, 62, 63].includes(division) || group === "582") return "IT Services";
  if ([45, 46, 47].includes(division)) return "General Trading";
  if ([69, 70, 71, 72, 74, 75].includes(division)) return "Professional Services";
  if (division >= 77 && division <= 82) return "Administrative Services";
  return "Other";
}

export const activities: Activity[] = (raw.rows as unknown as Row[]).map((r, i) => {
  const group = /^\d+$/.test(r[0]) ? r[0] : r[1].slice(0, 3);
  const authority = r[5] >= 0 ? authorities[r[5]] : null;
  const a: Activity = {
    id: String(i),
    group,
    sub: r[1],
    type: activityTypes[r[2]] ?? "Standard",
    industry: industries[r[3]] ?? "",
    name: r[4].replace(/^[\s\-\u2013]+/, ""),
    authority,
    timing: r[6] === 1 ? "before" : r[6] === 2 ? "after" : null,
    dnfbp: r[7] === 1,
    notes: r[8],
    category: categoryOf(group, r[1]),
    search: "",
  };
  a.search = `${a.sub} ${a.group} ${a.name} ${a.authority ?? ""} ${a.industry} ${a.type}`.toLowerCase();
  return a;
});
