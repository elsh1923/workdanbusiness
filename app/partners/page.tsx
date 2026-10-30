import EnquiryForm from "@/components/EnquiryForm";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";

export default function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={
          <>
            Grow with <em className="gold-text italic">Workdane.</em>
          </>
        }
        intro="Reach founders, SMEs and corporate teams by becoming part of our network."
      />

      <section id="channel-partner" className="scroll-mt-28 bg-white px-5 py-28 sm:px-9">
        <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Channel partner</Eyebrow>
            <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Become a channel partner.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed">
              Refer clients to us, or submit their applications on their behalf. Partner incentives are agreed in writing when you join.
            </p>
          </div>
          <EnquiryForm
            fields={[
              { name: "company", label: "Company name", required: true },
              { name: "contactName", label: "Contact person", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
              { name: "clients", label: "Tell us about the clients you work with", type: "textarea" },
            ]}
            submitLabel="Apply to partner"
          />
        </div>
      </section>

      <section id="partner-portal" className="scroll-mt-28 border-t border-heading/15 bg-surface px-5 py-28 sm:px-9">
        <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Channel partner portal</Eyebrow>
            <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Manage applications for your clients.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed">
              Approved partners can submit new licences, amendments and visa requests on behalf of their clients. Request access and we will set up your account.
            </p>
          </div>
          <EnquiryForm
            fields={[
              { name: "company", label: "Company name", required: true },
              { name: "email", label: "Work email", type: "email", required: true },
              { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
            ]}
            submitLabel="Request portal access"
          />
        </div>
      </section>

      <section id="corporate-partnerships" className="scroll-mt-28 border-t border-line bg-white px-5 py-28 sm:px-9">
        <div className="mx-auto grid max-w-[1840px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Eyebrow>Corporate partnerships</Eyebrow>
            <h2 className="font-display text-[34px] font-bold leading-[1.15] text-heading sm:text-[38px]">Set up services for your team.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed">
              Companies and groups can arrange setup, visas and business services for their own teams or clients through a single agreement.
            </p>
          </div>
          <EnquiryForm
            fields={[
              { name: "company", label: "Company name", required: true },
              { name: "contactName", label: "Contact person", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              {
                name: "interest",
                label: "What would you like to arrange?",
                type: "select",
                options: ["Employee relocation packages", "Group company setup", "Co-branded services", "Something else"],
              },
            ]}
            submitLabel="Start a conversation"
          />
        </div>
      </section>
    </>
  );
}
