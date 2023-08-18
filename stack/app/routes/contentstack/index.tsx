import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { Article } from "~/@types/generated/contentstack/generated";
import { Grid, Hero, Inset } from "~/components/layout";
import { ArticleCard } from "~/contentstack/components/ArticleCard";
import { getArticles } from "~/contentstack/index.server";

export const meta: MetaFunction = () => {
  return {
    title: "Contentstack Blog",
    description: "Our contentstack blog",
  };
};

export interface LoaderData {
  articles: Article[];
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const articles: Article[] = await getArticles();
  return {
    articles,
  };
};

const i18nNamespaces = ["common", "tags"];

export default function Contentstack() {
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
        title={t("Blog")}
      />
      <Inset padded>
        <Grid cols={3}>
          {articles?.length ? (
            articles.map((article: Article, index) => (
              <ArticleCard
                key={index}
                title={article.title}
                uid={article.uid}
                url={article.url}
                file={article.file}
              />
            ))
          ) : (
            <p>No articles found</p>
          )}
        </Grid>
      </Inset>
    </section>
  );
}
