import { faqMetadata } from "./faq-metadata";

describe("faqMetadata", () => {
  it("should return an array of FAQ metadata objects to be used as json-ld data", () => {
    const FAQs = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ];
    const result = faqMetadata(FAQs);
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Q1",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A1",
          },
        },
        {
          "@type": "Question",
          name: "Q2",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A2",
          },
        },
      ],
    });
  });
  it("should return an empty array if no FAQs are provided", () => {
    const result = faqMetadata([]);
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    });
  });
});
