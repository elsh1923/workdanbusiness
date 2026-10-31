"use client";

import { useState } from "react";
import DialSelect from "./DialSelect";

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
  const [dial, setDial] = useState(defaultDial);
  return (
    <div className="flex gap-3">
      <DialSelect name={`${name}Dial`} value={dial} onChange={setDial} className={className} />
      <input name={name} type="tel" inputMode="tel" autoComplete="tel-national" required={required} maxLength={20} pattern="[\d\s\-()+]{6,20}" title="Enter the number without the country code" className={`${className} min-w-0 flex-1`} />
    </div>
  );
}
