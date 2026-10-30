import type { LicenceCategory } from "./activity-data";

// TODO: every figure in this file is a PLACEHOLDER. Replace it with the real fee schedule.
// The calculator reads only from here, so nothing else needs to change.
export const calc = {
  // Annual licence fee by category. "Other" activities are priced like General Trading.
  licence: {
    "General Trading": 5750,
    "Professional Services": 5250,
    "IT Services": 6250,
    "E-Commerce": 5750,
    "Administrative Services": 5250,
    "Marketing Services": 5750,
    Other: 5750,
  } satisfies Record<LicenceCategory, number>,

  // The largest activity groups on the licence are included. Each activity in a further group costs extra.
  includedGroups: 5,
  extraGroupActivity: 1000,

  // Shareholders included in the licence, and the fee for each one after that.
  includedShareholders: 5,
  maxShareholders: 10,
  extraShareholder: 500,

  // Licence length in years, and the percentage taken off the licence fee for committing to it.
  terms: [
    { years: 1, discount: 0 },
    { years: 2, discount: 5 },
    { years: 3, discount: 7 },
    { years: 5, discount: 10 },
    { years: 10, discount: 15 },
  ],

  visa: {
    establishmentCard: 2000,
    eChannel: 500,
    investor: 4000,
    employee: 5000,
    changeOfStatus: 600,
    maxEach: 10,
  },

  extras: {
    bank: 1000,
    taxPackage: 1000,
    stamp: 200,
    vat: 750,
    receptionistPerYear: 3000,
    dependentVisa: 4000,
  },
};

// Activities shown first in the picker, by code.
export const popularCodes = ["6312", "6201.96", "8299.19", "4690.97", "5820", "7310.15", "6920.96", "4791.1", "4791.07"];
