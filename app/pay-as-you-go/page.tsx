import InfoPage from "@/components/InfoPage";

export default function PayAsYouGo() {
  return (
    <InfoPage
      eyebrow="Pay-as-you-go"
      title={
        <>
          Pay in steps, <em className="gold-text italic">not all at once.</em>
        </>
      }
      intro="Ask us about payment plans that spread your setup costs. Options depend on the services you choose and are confirmed in your quote."
      points={[
        { title: "Choose your services", text: "Tell us which services you need now. You do not have to commit to everything upfront." },
        { title: "Agree a payment plan", text: "We set out the payment stages in writing, so you know what is due and when." },
        { title: "Pay as each stage completes", text: "Each payment is linked to a visible step in your setup, so you can see progress." },
      ]}
      formTitle="Ask about payment plans"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
        { name: "services", label: "Services you need", type: "select", options: ["Company formation", "Visas", "Accounting & VAT", "Not sure yet"] },
        { name: "message", label: "Message (optional)", type: "textarea" },
      ]}
      submitLabel="Ask about payment plans"
      note="Available plans and terms are confirmed in writing before any payment is made."
    />
  );
}
