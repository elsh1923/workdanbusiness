export type Post = {
  slug: string;
  title: string;
  summary: string;
  readMinutes: number;
  sections: { heading: string; body: string[] }[];
};

export const posts: Post[] = [
  {
    slug: "choosing-business-activities",
    title: "How to choose the right activities for your licence",
    summary: "Your licence lists exactly what your company may do. Here is how to pick activities that match your plan.",
    readMinutes: 4,
    sections: [
      {
        heading: "Start from how you will earn money",
        body: [
          "Write down what customers will pay you for. Each source of income should be covered by an activity on your licence, because invoicing for something outside your licence can cause problems with authorities and banks.",
        ],
      },
      {
        heading: "Search by what you do, not by a code",
        body: [
          "Activity lists are long and the wording is formal. Search by plain words such as the product, service or industry, then read the full description of each match before you shortlist it.",
        ],
      },
      {
        heading: "Check for approvals",
        body: [
          "Some activities need approval from another authority before or after the licence is issued. It is better to know this at the start, so you can plan the timeline and any documents the approval needs.",
        ],
      },
      {
        heading: "Do not collect activities you will not use",
        body: [
          "A long list can look flexible but may add cost and extra requirements. Choose the activities you need now, and add others later through an amendment when your plans change.",
        ],
      },
    ],
  },
  {
    slug: "mainland-or-free-zone",
    title: "Mainland or free zone: how to decide",
    summary: "Two common routes to a UAE licence, and the questions that tell you which one suits your business.",
    readMinutes: 5,
    sections: [
      {
        heading: "Who will your customers be?",
        body: [
          "If most of your customers are inside the UAE, a structure that lets you trade directly in the local market is usually simpler. If you mainly serve clients abroad or other free zone companies, a free zone may be enough.",
        ],
      },
      {
        heading: "What does your activity require?",
        body: [
          "Not every activity can be licensed in every place. Check the activity first, because it can narrow your choices before cost or location come into it.",
        ],
      },
      {
        heading: "Think about premises and staff",
        body: [
          "Office space, visa numbers and the way you plan to hire all depend on the structure. Ask what is included and what you would need to arrange separately.",
        ],
      },
      {
        heading: "Compare the full picture",
        body: [
          "Look beyond the first licence fee. Compare renewal costs, visa costs, approvals and any extra services you will need over the first year. We set this out in a written comparison during your consultation.",
        ],
      },
    ],
  },
  {
    slug: "documents-to-prepare",
    title: "Documents to prepare before you apply",
    summary: "Having your paperwork ready is the easiest way to keep a company setup moving.",
    readMinutes: 3,
    sections: [
      {
        heading: "For each owner",
        body: [
          "You will usually need a clear passport copy and personal contact details for every shareholder. Some owners are also asked for additional identity documents, depending on nationality and the authority.",
        ],
      },
      {
        heading: "For the company",
        body: [
          "Have your preferred trade names ready, ideally three, together with the activities you have chosen and who will manage the company.",
        ],
      },
      {
        heading: "If a shareholder is a company",
        body: [
          "A corporate shareholder will need its own company documents, often attested. Start this early because attestation can take time.",
        ],
      },
      {
        heading: "Ask us for your exact list",
        body: [
          "The list changes with your structure and activity. After the first call we send you the exact documents needed for your case.",
        ],
      },
    ],
  },
  {
    slug: "after-your-licence-is-issued",
    title: "What to do after your licence is issued",
    summary: "The licence is the start, not the finish. A short checklist for your first weeks.",
    readMinutes: 3,
    sections: [
      {
        heading: "Open your bank account",
        body: ["Most companies need a business account before they can invoice and pay suppliers. Begin the application as soon as your documents are ready."],
      },
      {
        heading: "Arrange visas",
        body: ["Owners and employees need residence visas, which include a medical screening and an Emirates ID. Plan these together to avoid waiting."],
      },
      {
        heading: "Register for tax where required",
        body: ["Check whether your business must register for VAT or other taxes, and set up bookkeeping from the first transaction."],
      },
      {
        heading: "Diarise your renewals",
        body: ["Licences and visas expire. Put the dates in a calendar, or ask us to track them for you."],
      },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
