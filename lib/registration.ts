// Shared by the registration form page and its API route.

export const MAX_SHAREHOLDERS = 7;
export const PREFILL_KEY = "workdane-registration-prefill";
export const DRAFT_KEY = "workdane-registration-draft";

// Saved by the calculator once a quote has been emailed, and read by the registration form.
export type Prefill = {
  name: string;
  email: string;
  dial: string;
  phone: string;
  nationality: string;
  activities: { code: string; name: string }[];
  shareholders: number;
  investorVisas: number;
  employeeVisas: number;
};

export const ROLES = ["General Manager", "Board of Director", "Shareholder"] as const;

export const WEALTH_SOURCES = [
  "Capital of company/ dividends or income from business",
  "Professional salary",
  "Profit from sold or maturing investments",
  "Profits from property sale or lease",
  "Profits from sale of business",
  "Inheritance",
  "Gift",
  "Other",
] as const;

export const CRIME_OPTIONS = ["Money Laundering", "Corruption", "Fraud", "Criminal Offence", "Other", "None of the above"] as const;
export const PEP_OPTIONS = ["Politically Exposed Person (PEP)", "Govt. Official", "None of the Above"] as const;
export const NONE_CRIME = "None of the above";
export const NONE_PEP = "None of the Above";

export const FILE_SLOTS = [
  { key: "passport", label: "Passport scan", hint: "Clear colour scan of the photo page", required: true },
  { key: "photo", label: "Passport-size photo", hint: "White background, recent", required: true },
  { key: "address", label: "Proof of address", hint: "ID, driving licence, utility bill or contract", required: true },
  { key: "bank", label: "Bank statements", hint: "Last 3 to 6 months", required: true },
  { key: "experience", label: "Previous employment or business experience", hint: "CV or reference letter (optional)", required: false },
] as const;
export type FileKey = (typeof FILE_SLOTS)[number]["key"];

export type Shareholder = {
  roles: string[];
  percent: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  fatherName: string;
  motherName: string;
  passportNo: string;
  nationality: string;
  passportExpiry: string;
  uaeResident: "" | "Yes" | "No";
};

export type RegistrationData = {
  authority: string;
  consultant: string;
  names: [string, string, string];
  investorVisas: string;
  employeeVisas: string;
  activities: { code: string; name: string }[];
  shareholders: Shareholder[];
  turnover: string;
  experience: string;
  businessDescription: string;
  targetCountries: string;
  paymentFromCustomers: string;
  paymentToSuppliers: string;
  otherLicence: "" | "Yes" | "No";
  otherLicenceDetails: string;
  crime: string[];
  crimeOther: string;
  pep: string[];
  wealth: string[];
  wealthOther: string;
  declaration: boolean;
};

export const emptyShareholder = (): Shareholder => ({
  roles: [],
  percent: "",
  fullName: "",
  phone: "",
  email: "",
  address: "",
  fatherName: "",
  motherName: "",
  passportNo: "",
  nationality: "",
  passportExpiry: "",
  uaeResident: "",
});

export const AUTHORITY = "Workdane Trading LLC";
export const CONSULTANT = "Daniel Abebaw Anteneh";

// Question numbers are fixed, whatever the number of shareholders: every shareholder sits under question 6,
// and the questions after them are always 7 to 16.
export const SHAREHOLDER_QUESTION = 6;
export const holderNumber = () => SHAREHOLDER_QUESTION;
export const questionNumber = (base: number) => base;
// The printed form repeats questions 13 to 16 as 17 to 20.

// A full name has at least two words (for example a first and a last name).
export const isFullName = (v: string) => v.trim().split(/\s+/).filter(Boolean).length >= 2;
export const FULL_NAME_MESSAGE = "Please enter the full name (at least first and last name)";
