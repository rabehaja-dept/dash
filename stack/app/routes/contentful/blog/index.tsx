import { useLoaderData, Outlet, useMatches } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { useTranslation } from "react-i18next";
import { i18n } from "~/i18n.server";
// Components
import { ArticleCard } from "~/contentful/components/ArticleCard";
import { Breadcrumbs, Grid, Hero, Inset } from "~/components/layout";

import type {
  IPost,
  SpecificLocale,
  Asset,
} from "~/@types/generated/contentful";
import type { Handle } from "~/@types";
import { getRecentPosts } from "~/contentful/index.server";
import type { MetaInfo } from "~/contentful/route-utils";
import * as RouteUtils from "~/contentful/route-utils";

// import the base meta function from the route-utils module
export const meta: MetaFunction = RouteUtils.meta;

export interface LoaderData {
  posts: SpecificLocale<IPost>[];
  meta: MetaInfo;
}

const i18nNamespaces = ["common", "tags"];

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const locale = await i18n.getLocale(request);
  const posts = await getRecentPosts(locale, tag ? tag : undefined);
  return {
    posts,
    meta: RouteUtils.getMetaInfo({
      title: "Blog",
      description: "Our blog.",
      requestUrl: request.url,
    }),
  };
};

export const handle: Handle = {
  i18n: i18nNamespaces,
};

export default function Blog() {
  const { posts } = useLoaderData<LoaderData>();
  const { t } = useTranslation(i18nNamespaces);
  const matches = useMatches();

  return (
    <section className="relative">
      <Hero
        background={{
          imageProps: {
            src: "/heroBackground.webp",
            alt: "Abstract orange background",
          },
        }}
        size="small"
        title={t("Blog")}
      />
      <Inset padded>
        <Breadcrumbs matches={matches} />
        <Grid cols={3}>
          {posts.map((post, index) => {
            const updatedDate = new Date(post.sys.updatedAt);
            return (
              <ArticleCard
                key={index}
                buttonTo={post.fields.slug}
                category={
                  post.metadata.tags[0] && {
                    label: t(`tags:${post.metadata.tags[0].sys.id}`),
                    to: `/contentful?tag=${post.metadata.tags[0].sys.id}`,
                  }
                }
                date={updatedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
                asset={post.fields.image as SpecificLocale<Asset>}
                title={post.fields.title}
              />
            );
          })}
        </Grid>
      </Inset>
      <Outlet />
    </section>
  );
}
