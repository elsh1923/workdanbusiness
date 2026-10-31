import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegistrationForm from "@/components/RegistrationForm";

export const metadata: Metadata = {
  title: "Company Registration Form | Workdane Management Consultancy",
  description: "Complete your company registration details and upload your documents.",
  robots: { index: false, follow: false },
};

export default function CompanyRegistration() {
  return (
    <>
      <PageHero
        eyebrow="Company registration"
        title={
          <>
            Complete your <em className="gold-text italic">registration form.</em>
          </>
        }
        intro="Four short steps. Tell us about your company, add each shareholder with their documents, and answer a few compliance questions."
      />
      <div className="-mt-24 relative z-10">
        <RegistrationForm />
      </div>
    </>
  );
}
