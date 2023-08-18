import { articleMetadata, ArticleMetadata } from "./article-metadata";

describe("articleMetadata", () => {
  it("should return an article metadata object to be used as json-ld data", () => {
    const article: ArticleMetadata = {
      "@type": "BlogPosting",
      headline: "How to make a pizza",
      image: [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg",
      ],
      datePublished: "2022-02-05T08:00:00+08:00",
      dateModified: "2022-02-05T08:00:00+08:00",
      author: [
        {
          "@type": "Person",
          name: "John Doe",
        },
      ],
    };
    const result = articleMetadata(article);
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "How to make a pizza",
      image: [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg",
      ],
      datePublished: "2022-02-05T08:00:00+08:00",
      dateModified: "2022-02-05T08:00:00+08:00",
      author: [
        {
          "@type": "Person",
          name: "John Doe",
        },
      ],
    });
  });
  it("should return an article metadata object to be used as json-ld data with multiple authors", () => {
    const article: ArticleMetadata = {
      "@type": "BlogPosting",
      headline: "How to make pasta",
      image: [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg",
      ],
      datePublished: "2022-02-05T08:00:00+08:00",
      dateModified: "2022-02-05T08:00:00+08:00",
      author: [
        {
          "@type": "Person",
          name: "John Doe",
        },
        {
          "@type": "Person",
          name: "Jane Smith",
        },
        {
          "@type": "Organization",
          name: "DEPT®",
        },
      ],
    };
    const result = articleMetadata(article);
    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "How to make pasta",
      image: [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg",
      ],
      datePublished: "2022-02-05T08:00:00+08:00",
      dateModified: "2022-02-05T08:00:00+08:00",
      author: [
        {
          "@type": "Person",
          name: "John Doe",
        },
        {
          "@type": "Person",
          name: "Jane Smith",
        },
        {
          "@type": "Organization",
          name: "DEPT®",
        },
      ],
    });
  });
});
