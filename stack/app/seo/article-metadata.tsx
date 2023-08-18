export type ArticleMetadata = {
  "@type": "Article" | "NewsArticle" | "BlogPosting";
  headline: string;
  image?: string[];
  datePublished?: string; // DateTime
  dateModified: string; // DateTime
  author?: AuthorEntry[];
};

type AuthorEntry = {
  "@type": "Person" | "Organization";
  name: string;
  url?: string;
};

/**
 *
 * @param ArticleMetadata
 * @returns An object containing the structured data for an article
 * @description This function takes an article's metadata to be used as json-ld data.
 * @description Be sure to add this data inside a `<script type="application/ld+json">` tag in the head.
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
export const articleMetadata = (articleInfo: ArticleMetadata) => {
  if (!articleMetadata) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    };
  }

  const { "@type": type, ...rest } = articleInfo;

  return {
    "@context": "https://schema.org",
    "@type": type,
    ...rest,
  };
};
