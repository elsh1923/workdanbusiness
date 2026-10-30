import PageHero from "./PageHero";

export default function TextPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <section className="bg-white px-6 py-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-[24px] font-bold text-heading">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 text-[15px] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
