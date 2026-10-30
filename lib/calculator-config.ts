import type { LicenceCategory } from "./activity-data";

// All amounts are in AED.
//
// CONFIRMED by the company (invoice dated 30 April 2025): licence bundle, visa allocation, office lease
// agreement, establishment card, e-channel registration, Emirates ID, investor/partner visa (2 years),
// medical test, management fee and change of status.
//
// STILL PLACEHOLDERS (marked TODO): extra activity groups, extra shareholders, multi-year discounts, employee visa fee, and the optional
// extras. Replace them with the real figures. The calculator reads only from this file.
export const calc = {
  // Trade licence, MOA and certificate of formation, per year.
  // Confirmed by the company: every category costs the same.
  licence: {
    "General Trading": 6885,
    "Professional Services": 6885,
    "IT Services": 6885,
    "E-Commerce": 6885,
    "Administrative Services": 6885,
    "Marketing Services": 6885,
    Other: 6885,
  } satisfies Record<LicenceCategory, number>,

  officeLease: 365, // office lease agreement, charged once
  managementFee: 499, // charged once

  // TODO: placeholder. The largest activity groups on the licence are included.
  includedGroups: 5,
  extraGroupActivity: 1000,

  // TODO: placeholder.
  includedShareholders: 5,
  maxShareholders: 10,
  extraShareholder: 500,

  // TODO: placeholder. Licence length in years, and the percentage taken off for committing to it.
  terms: [
    { years: 1, discount: 0 },
    { years: 2, discount: 5 },
    { years: 3, discount: 7 },
    { years: 5, discount: 10 },
    { years: 10, discount: 15 },
  ],

  visa: {
    establishmentCard: 840,
    eChannel: 2680,
    // Charged for every visa.
    allocation: 1610,
    emiratesId: 830,
    medicalTest: 365,
    // The visa itself.
    investor: 2800, // investor/partner visa, 2 years
    employee: 2800, // TODO: placeholder, the invoice only shows the investor/partner visa
    changeOfStatus: 700,
    maxEach: 10,
  },

  extras: {
    bank: 1000, // TODO: corporate banking assistance. Confirmed as NOT included in the licence; price needed.
    taxPackage: 1000, // TODO
    stamp: 200, // TODO
    vat: 750, // TODO
    receptionistPerYear: 3000, // TODO
    dependentVisa: 4000, // TODO
  },
};

// Cost of one visa including allocation, Emirates ID and medical test.
const perVisa = calc.visa.allocation + calc.visa.emiratesId + calc.visa.medicalTest;
export const investorVisaTotal = perVisa + calc.visa.investor;
export const employeeVisaTotal = perVisa + calc.visa.employee;

// Activities shown first in the picker, by code.
export const popularCodes = ["6312", "6201.96", "8299.19", "4690.97", "5820", "7310.15", "6920.96", "4791.1", "4791.07"];
