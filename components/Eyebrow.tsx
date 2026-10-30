export default function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-6 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.2em] ${
        light ? "text-gold-light" : "text-bronze"
      }`}
    >
      <span className="h-px w-10 bg-gold" />
      {children}
    </p>
  );
}
