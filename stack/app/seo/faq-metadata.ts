type QuestionAndAnswer = {
  question: string;
  answer: string;
};
/**
 *
 * @param FAQs
 * @returns An array of FAQ metadata objects to be used as json-ld data
 * @description This function takes an array of FAQ key/value pairs and returns an array of FAQ metadata objects to be used as json-ld data.
 * @description Be sure to add this data inside a `<script type="application/ld+json">` tag in the head.
 * @see https://developers.google.com/search/docs/advanced/structured-data/faqpage
 */
export const faqMetadata = (questionsAndAnswers: QuestionAndAnswer[]) => {
  if (!questionsAndAnswers || !questionsAndAnswers.length) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questionsAndAnswers.map(({ question, answer }) => {
      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      };
    }),
  };
};
