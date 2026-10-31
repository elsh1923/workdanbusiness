import type { MetadataRoute } from "next";
import { posts } from "@/lib/blogs";
import { landings } from "@/lib/landing-pages";
import { categoryPages, plusPages } from "@/lib/service-pages";

const base = process.env.SITE_URL ?? "http://localhost:3000";

const pages = [
  "/",
  "/home",
  "/start-your-business",
  "/license-categories",
  "/cost-calculator",
  "/name-check",
  "/business-setup-guide",
  "/pay-as-you-go",
  "/refer-and-earn",
  "/invest-in-uae",
  "/workdane-plus",
  "/insights",
  "/blogs",
  "/faqs",
  "/partners",
  "/our-partners",
  "/featured-in",
  "/activity-hub",
  "/resource-hub",
  "/book-appointment",
  "/contact",
  "/careers",
  "/customer-feedback",
  "/privacy-policy",
  "/terms-and-conditions",
  ...categoryPages.map((c) => `/license-categories/${c.slug}`),
  ...plusPages.map((p) => `/workdane-plus/${p.id}`),
  ...landings.map((l) => `/business-setup/${l.slug}`),
  ...posts.map((p) => `/blogs/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${base}${path}` }));
}
