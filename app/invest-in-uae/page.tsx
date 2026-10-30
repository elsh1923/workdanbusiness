import InfoPage from "@/components/InfoPage";

export default function InvestInUAE() {
  return (
    <InfoPage
      eyebrow="Invest in the UAE"
      title={
        <>
          Build your business <em className="gold-text italic">where you can reach the market.</em>
        </>
      }
      intro="The UAE offers a range of structures, ownership options and trade connections. We help you choose the one that suits your plan."
      image={{ src: "/dubai-team.png", alt: "Business advisers reviewing market data with a view over Dubai", width: 736, height: 414 }}
      points={[
        { title: "Ownership options", text: "Ownership rules vary by activity and structure. We confirm which options apply to your business." },
        { title: "Mainland or free zone", text: "Each structure suits different clients and activities. We compare them with you before you commit." },
        { title: "Setup support", text: "From licensing and visas to banking and accounting, we guide you through each step." },
      ]}
      formTitle="Talk to a consultant"
      fields={[
        { name: "name", label: "Full name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
        { name: "interest", label: "What are you looking to do?", type: "select", options: ["Set up a new company", "Expand an existing business", "Explore my options"] },
        { name: "message", label: "Message (optional)", type: "textarea" },
      ]}
      submitLabel="Talk to a consultant"
    />
  );
}
