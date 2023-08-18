import invariant from "tiny-invariant";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useMatches } from "@remix-run/react";
import { json as superjson } from "superjson-remix";
import { useLoaderData as useSuperjsonLoaderData } from "superjson-remix";
import { getAllArticles, getArticleBySlug } from "~/kontent.ai/index.server";
import { Article } from "~/@types/generated/kontent.ai/content-types";
import { Hero } from "~/components/layout/Hero";
import type { Handle } from "~/@types";
import { articleMetadata, ArticleMetadata } from "~/seo/article-metadata";
import { RichText } from "~/kontent.ai/components/RichText";
import { Breadcrumbs } from "~/components/layout";

interface LoaderData {
  article: Article;
  metadata: ArticleMetadata;
}

export const handle: Handle = {
  id: "contentful",
  i18n: ["common"],
  breadcrumb: () => {
    const { article } = useSuperjsonLoaderData<LoaderData>();
    return {
      label: article.elements.title.value,
      path: "/kontent.ai/" + article.elements.url.value,
    };
  },
  getSitemapEntries: async () => {
    /**
     *  If you have a lot of content, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const articles = await getAllArticles();
    return articles.map((article: Article) => ({
      route: "/kontent.ai/" + article.elements.url.value,
      changefreq: "weekly",
      lastmod: article.system.lastModified,
      priority: 0.6,
    }));
  },
};

const slugArticleMetadata = (article: Article): ArticleMetadata => {
  return {
    "@type": "BlogPosting",
    headline: article.elements.title.value,
    image: [article.elements.thumbnail_image.value[0].url],
    dateModified: article.system.lastModified,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const article = await getArticleBySlug(params.slug);
  return superjson<LoaderData>({
    article,
    metadata: slugArticleMetadata(article),
  });
};

export default function KontentAi() {
  const { article, metadata } = useSuperjsonLoaderData<LoaderData>();
  const matches = useMatches();

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
                title={article.elements.title.value}
              />
            </>
          )}
          <div className="mx-4 my-24 md:mx-auto md:w-3/4">
            <Breadcrumbs matches={matches} />
            {article ? (
              <>
                <p className="mb-4">{toDate(article.system.lastModified)}</p>
                <RichText element={article.elements.body} />
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
