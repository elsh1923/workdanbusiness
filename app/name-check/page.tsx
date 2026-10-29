import InfoPage from "@/components/InfoPage";
import { categories } from "@/lib/activities";

export default function NameCheck() {
  return (
    <InfoPage
      eyebrow="Name check"
      title={
        <>
          Check your <em className="gold-text italic">trade name.</em>
        </>
      }
      intro="Send us up to three preferred names and we will submit them for checking with the authority."
      points={[
        { title: "Send your preferred names", text: "Add up to three trade names in order of preference, along with your business category." },
        { title: "We submit the request", text: "We send your names for checking. Availability is confirmed by the authority, not by us." },
        { title: "You hear the result", text: "We tell you which name is available so you can move straight to the next step." },
      ]}
      formTitle="Request a name check"
      fields={[
        { name: "name1", label: "Preferred trade name 1", required: true },
        { name: "name2", label: "Preferred trade name 2" },
        { name: "name3", label: "Preferred trade name 3" },
        { name: "category", label: "Business category", type: "select", options: categories, required: true },
        { name: "fullName", label: "Full name", required: true },
        { name: "phone", label: "Phone / WhatsApp", type: "tel", required: true },
        { name: "email", label: "Email", type: "email", required: true },
      ]}
      submitLabel="Submit name check"
      note="Submitting sends a request. No name is reserved until the authority approves it."
    />
  );
}
