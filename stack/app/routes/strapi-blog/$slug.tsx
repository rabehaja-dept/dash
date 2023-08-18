import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { getArticleBySlug, getArticles } from "~/strapi/index.server";
import { ApiArticleArticle } from "~/@types/generated/strapi";
import { RenderMarkdown } from "~/strapi/components/Markdown";
import { Hero } from "~/components/layout/Hero";
import type { Handle } from "~/@types";
import { articleMetadata, ArticleMetadata } from "~/seo/article-metadata";

interface LoaderData {
  article: ApiArticleArticle;
  metadata: ArticleMetadata;
}

export const handle: Handle = {
  id: "contentful",
  i18n: ["common"],
  getSitemapEntries: async (request: Request) => {
    /**
     *  If you have a lot of content, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const articles = await getArticles(request);
    return articles?.map((article) => ({
      route: "/strapi-blog/" + article.attributes.slug,
      changefreq: "weekly",
      lastmod: article.attributes.updatedAt,
      priority: 0.6,
    }));
  },
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.slug, "expected params.slug");
  const article = await getArticleBySlug(params.slug);

  const metadata = slugArticleMetadata(article);

  return { article, metadata };
};

const slugArticleMetadata = (article: ApiArticleArticle): ArticleMetadata => {
  return {
    "@type": "BlogPosting",
    headline: article.attributes.title,
    image: [article.attributes.image?.url],
    datePublished: article.attributes.publishedAt,
    dateModified: article.attributes.updatedAt,
  };
};

export default function Strapi() {
  const { article, metadata } = useLoaderData<LoaderData>();

  const toDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      {
        <div>
          {article && (
            <>
              <Hero
                background={{
                  imageProps: {
                    src: "/heroBackground.webp",
                  },
                }}
                size="medium"
                title={article.attributes.title}
              />
            </>
          )}
          <div className="mx-4 my-24 md:mx-auto md:w-3/4">
            {article ? (
              <>
                <p className="mb-4">{toDate(article.attributes.updatedAt)}</p>
                <RenderMarkdown>{article.attributes.content}</RenderMarkdown>
                {/* ld+json script for SEO */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                  <script type="application/ld+json">${JSON.stringify(
                    articleMetadata(metadata)
                  )}</script>
                `,
                  }}
                />
              </>
            ) : (
              <div>No article found with that name!</div>
            )}
          </div>
        </div>
      }
    </>
  );
}
