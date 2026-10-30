import { countries } from "@/lib/countries";

// Country-code picker plus number. The code is submitted as `${name}Dial` and the number as `name`.
export default function PhoneField({
  name,
  required,
  className,
  defaultDial = "+971",
}: {
  name: string;
  required?: boolean;
  className: string;
  defaultDial?: string;
}) {
  return (
    <div className="flex gap-3">
      <select name={`${name}Dial`} defaultValue={defaultDial} aria-label="Country code" className={`${className} !w-[8.5rem] shrink-0`}>
        {countries.map((c) => (
          <option key={c.name} value={c.dial}>
            {c.dial} {c.name}
          </option>
        ))}
      </select>
      <input name={name} type="tel" inputMode="tel" autoComplete="tel-national" required={required} maxLength={20} pattern="[\d\s\-()+]{6,20}" title="Enter the number without the country code" className={`${className} min-w-0 flex-1`} />
    </div>
  );
}
