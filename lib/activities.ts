// The six licence categories used across the site (menus, calculator, name check).
export const categories = [
  "General Trading",
  "Professional Services",
  "IT Services",
  "E-Commerce",
  "Administrative Services",
  "Marketing Services",
] as const;

export type Category = (typeof categories)[number];

// Number of activities in lib/activity-data.json. Kept here so pages that only
// need the number do not have to load the whole data file. Update it if the data is regenerated.
export const ACTIVITY_COUNT = 2035;
