import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { json as superjson } from "superjson-remix";
import { useLoaderData as useSuperjsonLoaderData } from "superjson-remix";
import type { IPost, SpecificLocale } from "~/@types/generated/contentful";
import { Breadcrumbs, Hero } from "~/components/layout";
import { getComponentFromContentfulRichTextEntry } from "~/contentful";
import { getPostBySlug, getAllPosts } from "~/contentful/index.server";
import { i18n } from "~/i18n.server";
import type { MetaInfo } from "~/contentful/route-utils";
import * as routeUtils from "~/contentful/route-utils";
import type { Handle } from "~/@types";
import { getDescriptionFromNode } from "../../../contentful/contentful-render";

// import the base meta function from the route-utils module
export const meta = routeUtils.meta;

function getDescriptionFromPost(post: SpecificLocale<IPost>): string {
  if (post.fields.description) {
    return post.fields.description;
  } else if (post.fields.body) {
    return getDescriptionFromNode(post.fields.body);
  } else {
    // We did our best
    return "";
  }
}

export interface LoaderData {
  post: SpecificLocale<IPost>;
  meta: MetaInfo;
}

export const handle: Handle = {
  id: "contentful",
  i18n: ["common", "tags"],
  breadcrumb: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { post } = useSuperjsonLoaderData<LoaderData>();
    return {
      label: post.fields.title,
      path: "/contentful/blog/" + post.fields.slug,
    };
  },

  getSitemapEntries: async (request: Request) => {
    /**
     *  If you have a lot of content, this may take a while.
     * You may want to limit the number of entries we fetch.
     */
    const locale = await i18n.getLocale(request);
    const posts = await getAllPosts(locale);
    return posts.map((post) => ({
      route: "/contentful/" + post.fields.slug,
      changefreq: "weekly",
      lastmod: post.sys.updatedAt,
      priority: 0.5,
    }));
  },
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  invariant(params.slug, "expected params.slug to be defined");
  const locale = await i18n.getLocale(request);
  const post = await getPostBySlug(params.slug, {
    locale,
    preview: url.searchParams.get("preview") === "1",
  });
  return superjson<LoaderData>({
    post,
    meta: routeUtils.getMetaInfo({
      title: post.fields.title,
      description: getDescriptionFromPost(post),
      requestUrl: request.url,
      openGraphImageUrl: post.fields.image?.fields.file.url,
    }),
  });
};

export default function BlogPost() {
  const { post } = useSuperjsonLoaderData<LoaderData>();
  const matches = useMatches();

  return (
    <section className="relative">
      <Hero
        background={{
          imageProps: {
            src: post.fields.image
              ? post.fields.image.fields.file.url
              : "/heroBackground.webp",
          },
        }}
        size={post.fields.image ? "medium" : "small"}
        title={post.fields.title}
      />
      <div className="mx-4 md:mx-auto md:w-3/4">
        <Breadcrumbs matches={matches} />
        {post.fields.body &&
          documentToReactComponents(
            post.fields.body,
            getComponentFromContentfulRichTextEntry
          )}
      </div>
    </section>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  console.error(error);
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="text-xl">Internal Server Error</p>
      {process.env.NODE_ENV !== "production" && (
        <pre className="text-sm text-gray-500">
          <code>{error.message}</code>
        </pre>
      )}
    </div>
  );
}
