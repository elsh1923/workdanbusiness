import EnquiryForm, { type Field } from "./EnquiryForm";
import PageHero from "./PageHero";

export default function InfoPage({
  eyebrow,
  title,
  intro,
  points,
  formTitle,
  fields,
  submitLabel,
  note,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  points: { title: string; text: string }[];
  formTitle: string;
  fields: Field[];
  submitLabel: string;
  note?: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <section className="bg-surface px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
          <ol className="border-t border-heading/15">
            {points.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-heading/15 py-8">
                <span className="font-display text-2xl text-heading/25">0{i + 1}</span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-heading">{p.title}</h2>
                  <p className="mt-3 text-[16px] leading-relaxed">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="border border-line border-t-2 border-t-gold bg-white p-8 shadow-[0_24px_60px_-35px_rgba(12,42,85,0.35)] sm:p-12">
            <h2 className="font-display text-3xl font-bold text-heading">{formTitle}</h2>
            <div className="mt-8">
              <EnquiryForm fields={fields} submitLabel={submitLabel} note={note} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
