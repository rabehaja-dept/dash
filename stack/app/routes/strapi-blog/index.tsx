import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { Grid } from "~/components/layout/Grid";
import { Hero } from "~/components/layout/Hero";
import { Inset } from "~/components/layout/Inset";
import { getEnv } from "~/config";
import type { Handle } from "~/@types";

import { ArticleCard } from "~/strapi/components/ArticleCard";
import { getArticles } from "~/strapi/index.server";

export const meta: MetaFunction = () => {
  return {
    title: "Strapi Blog",
    description: "Our Strapi blog",
  };
};

export interface LoaderData {
  STRAPI_URL: string;
  articles: any[];
}

const i18nNamespaces = ["common", "tags"];

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const articles = await getArticles(request);

  return {
    STRAPI_URL: getEnv("STRAPI_URL", {
      default: `${getEnv("PUBLICLY_AVAILABLE_ORIGIN")}/strapi`,
    }),
    articles,
  };
};

export const handle: Handle = {
  i18n: i18nNamespaces,
};

export default function Strapi() {
  const { articles, STRAPI_URL } = useLoaderData<LoaderData>();
  const { t } = useTranslation(i18nNamespaces);

  return (
    <section className="relative">
      <Hero
        background={{
          imageProps: {
            src: "heroBackground.webp",
            alt: "Abstract orange background",
          },
        }}
        size="small"
        title={t("Blog")}
      />
      <Inset padded>
        <Grid cols={3}>
          {articles?.length ? (
            articles.map((article) => (
              <ArticleCard
                STRAPI_URL={STRAPI_URL}
                article={article}
                key={article.id}
              />
            ))
          ) : (
            <>
              <p>No articles found!</p>
            </>
          )}
        </Grid>
      </Inset>
    </section>
  );
}
