import CostCalculator from "@/components/CostCalculator";
import PageHero from "@/components/PageHero";

export default function CostCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Cost calculator"
        title={
          <>
            Estimate your setup <em className="gold-text italic">costs.</em>
          </>
        }
        intro="Answer three quick questions to see an indicative total. Your written quote confirms the final figure."
      />
      <div className="pt-16">
        <CostCalculator />
      </div>
    </>
  );
}
