export const COMPANY = {
  name: "Workdane Management Consultancy",
};

export const CONTACT = {
  whatsapp: "971565374748", // country code + number, digits only
  phone: "+971 56 537 4748",
  email: "workdaneuae@gmail.com",
  emailSecondary: "workdanebusinesssetup@gmail.com",
  legalName: "Workdane Trading LLC FZE",
  licenceNo: "4413932.01",
};

export const OFFICES: { name: string; lines: string[]; mapUrl?: string }[] = [
  {
    name: "Dubai",
    mapUrl: "https://share.google/jkiOCyFmkdMb7r8VF", // Google business listing
    lines: ["Al Khaimah Building, 3rd Floor, Office No. 34", "Port Saeed, Deira, Dubai", "United Arab Emirates"],
  },
  {
    name: "Sharjah",
    lines: ["Ground floor, Business Centre", "Sharjah Publishing City FZ", "Sharjah, United Arab Emirates"],
  },
];

export const LOGO = { src: "/logo-workdane.png", width: 536, height: 465 };
// Navy wordmark turned white, for dark backgrounds such as the footer.
export const LOGO_LIGHT = { src: "/logo-workdane-light.png", width: 536, height: 465 };

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

// TODO: replace the indicative fees in lib/activities.ts and lib/content.ts with the real fee schedule.
export const INDICATIVE_NOTE =
  "Indicative fees only. Government fees and our service fee are confirmed in your written quotation.";
