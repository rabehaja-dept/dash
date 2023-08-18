import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import type { Handle } from "~/@types";
import { getAllArticles } from "~/kontent.ai/index.server";
import { Grid } from "~/components/layout/Grid";
import { Hero } from "~/components/layout/Hero";
import { Inset } from "~/components/layout/Inset";
import { Article } from "~/@types/generated/kontent.ai/content-types/";
import { KontentImage } from "~/kontent.ai/components/KontentImage";

export const meta: MetaFunction = () => {
  return {
    title: "Kontent.ai Blog",
    description: "Our Kontent.ai blog",
  };
};

export interface LoaderData {
  articles: Article[];
}

const i18nNamespaces = ["common", "tags"];

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const articles = await getAllArticles();

  return {
    articles,
  };
};

export const handle: Handle = {
  i18n: i18nNamespaces,
  breadcrumb: () => {
    return {
      label: "Kontent.ai Blog",
      path: "/kontent.ai",
    };
  },
};

export default function KontentAiBlog() {
  const { articles } = useLoaderData<LoaderData>();
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
        title={`Kontent.ai ${t("Blog")}`}
      />
      <Inset padded>
        <Grid cols={3}>
          {articles?.length ? (
            articles.map((article) => (
              <Link
                key={article.system.id}
                to={`/kontent.ai/${article.elements.url.value}`}
                className="hover:opacity-70"
              >
                <KontentImage
                  url={article.elements.thumbnail_image.value[0].url}
                  alt={
                    article.elements.thumbnail_image.value[0].description || ""
                  }
                  width={500}
                  height={500}
                />
                <h3>{article.elements.title.value}</h3>
              </Link>
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
