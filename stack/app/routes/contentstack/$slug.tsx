import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { Handle } from "~/@types";
import { Article } from "~/@types/generated/contentstack/generated";
import { Hero } from "~/components/layout/Hero";
import { getArticleBySlug, getArticles } from "~/contentstack/index.server";
import { renderHTMLRTE } from "~/utils";

interface LoaderData {
  article: Article;
}

export const handle: Handle = {
  id: "contentstack",
  i18n: ["common"],
  getSitemapEntries: async (_request: Request) => {
    /**
     *  If you have a lot of content, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const articles = await getArticles();
    return articles?.map((article: Article) => ({
      route: "/contentstack" + article.url,
      changefreq: "weekly",
      lastmod: article.updated_at,
      priority: 0.6,
    }));
  },
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.slug, "expected params.slug");
  const article: Article = await getArticleBySlug(params.slug);
  return { article };
};

export default function Contentstack() {
  const toDate = (date?: string): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const { article } = useLoaderData<LoaderData>();
  const body = article.body ? article.body : "";
  return (
    <>
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
              title={article.title}
            />
          </>
        )}
        <div className="mx-4 my-24 md:mx-auto md:w-3/4">
          {article ? (
            <>
              <p className="mb-4">{toDate(article.updated_at)}</p>
              <div>{renderHTMLRTE(body)}</div>
            </>
          ) : (
            <div>No article found with that name!</div>
          )}
        </div>
      </div>
    </>
  );
}
