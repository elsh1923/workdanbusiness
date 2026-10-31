import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MotionEffects from "@/components/MotionEffects";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const description =
  "Workdane Management Consultancy helps you set up a company in the UAE: licences, visas, bank accounts, VAT and renewals, with offices in Dubai and Sharjah.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Business Consultants in the UAE | Company Setup in Dubai & Sharjah | Workdane",
  description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "Workdane Management Consultancy",
    title: "Workdane Management Consultancy | UAE Company Setup & Business Services",
    description,
    locale: "en_AE",
  },
  twitter: { card: "summary_large_image", title: "Workdane Management Consultancy", description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions often add attributes to <html> and <body> before React loads
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <MotionEffects />
      </body>
    </html>
  );
}
