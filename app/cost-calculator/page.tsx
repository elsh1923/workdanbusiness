import type { Metadata } from "next";
import CalcExtras from "@/components/CalcExtras";
import CalcHero from "@/components/CalcHero";
import CostCalculator from "@/components/CostCalculator";
import WhoItsFor from "@/components/WhoItsFor";

export const metadata: Metadata = {
  title: "Cost Calculator | Workdane Management Consultancy",
  description: "Build an indicative estimate for your UAE company setup: activities, licence length, visas and extra services.",
};

export default function CostCalculatorPage() {
  return (
    <>
      <CalcHero />
      <CostCalculator />
      <CalcExtras />
      <WhoItsFor />
    </>
  );
}
