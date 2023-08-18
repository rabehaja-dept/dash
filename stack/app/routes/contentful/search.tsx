import type { LoaderFunction } from "@remix-run/node";
import { Hero } from "~/components/layout/Hero";
import {
  Hits,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-hooks-web";
import { ArticleCard } from "~/contentful/components/ArticleCard";
import type { BaseHit } from "instantsearch.js";
import { useTranslation } from "react-i18next";
import { ShouldReloadFunction, useLoaderData } from "@remix-run/react";
import type { SupportedLang } from "~/i18n-config";
import { Inset } from "~/components/layout/Inset";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { IPage, IPost } from "~/@types/generated/contentful";
import { useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { history } from "instantsearch.js/es/lib/routers/index.js";
import { getServerState } from "react-instantsearch-hooks-server";
import { ALGOLIA_APP_ID, ALGOLIA_INDEX, ALGOLIA_SEARCH_KEY } from "~/config";
import type { Handle } from "~/@types";
import { renderToString } from "react-dom/server";

const contentfulBlogPath = "/contentful/blog";
const enUsLocale = "en-US";
const pageType = "page";
const postType = "post";

function Hit({ hit }: { hit: (IPost | IPage) & BaseHit }) {
  const { t, i18n } = useTranslation(["tags"]);
  const locale = i18n.language as SupportedLang["code"];
  const type = hit.sys.contentType.sys.id;
  let linkTo;
  if (type === pageType) {
    linkTo = `/${hit.fields.slug[enUsLocale]}`;
  } else if (type === postType) {
    linkTo = `${contentfulBlogPath}/${hit.fields.slug[enUsLocale]}`;
  } else {
    throw new Error("encountered search entry with unhandled content type");
  }
  const updatedDate = new Date(hit.sys.updatedAt);
  return (
    <ArticleCard
      buttonTo={linkTo}
      category={
        hit.metadata.tags[0] && {
          label: t(`tags:${hit.metadata.tags[0].sys.id}`),
          to: `/contentful?tag=${hit.metadata.tags[0].sys.id}`,
        }
      }
      date={updatedDate.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
      })}
      title={hit.fields.title[locale] || ""}
    />
  );
}

type AlgoliaWrapperProps = {
  url: string;
  serverState?: InstantSearchServerState;
};

export function AlgoliaWrapper({ url, serverState }: AlgoliaWrapperProps) {
  const [searchClient] = useState(
    algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
  );
  const [t] = useTranslation(["tags"]);

  // TODO: Re-enable translating tags
  // This doesn't work right now because Algolia can't handle transformItems updating dynamically
  // See this Algolia issue: https://github.com/algolia/react-instantsearch/issues/3541
  // const transformItems = useCallback(
  //   (items: any) =>
  //     items.map((item: any) => ({
  //       ...item,
  //       label: t(`tags:${item.label}`),
  //     })),
  //   [t]
  // );

  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        indexName={ALGOLIA_INDEX}
        searchClient={searchClient}
        routing={{
          router: history({
            getLocation() {
              if (typeof window === "undefined") {
                return new URL(url) as unknown as Location;
              }
              return window.location;
            },
          }),
        }}
      >
        <div className="flex flex-wrap gap-2 sm:gap-10 md:flex-nowrap">
          <div className="w-full sm:w-60">
            <SearchBox
              placeholder={t("Search...") || ""}
              submitIconComponent={({ classNames }) => (
                <MagnifyingGlassCircleIcon className={classNames.submitIcon} />
              )}
              resetIconComponent={({ classNames }) => (
                <XMarkIcon className={classNames.resetIcon} />
              )}
              classNames={{
                form: "flex",
                input:
                  "hide-webkit-cancel-button border border-border outline-offset-0 p-2 w-44",
                submit: "px-2",
                submitIcon: "w-6",
                reset: "px-2",
                resetIcon: "w-6",
              }}
            />
            <div className="mt-4 font-bold">Tags</div>
            <RefinementList
              attribute="metadata.tags.sys.id"
              classNames={{
                list: "mb-4",
                item: "my-1",
                checkbox: "mr-2",
                count: "ml-2 text-sm text-text-weak",
              }}
              // transformItems={transformItems}
            />
          </div>
          <div className="grow">
            <Hits
              classNames={{
                list: "grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3",
              }}
              hitComponent={Hit}
            />
            <Pagination
              classNames={{
                root: "mt-6",
                item: "inline-block",
                link: "py-2 px-3",
              }}
            />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

export const handle: Handle = {
  i18n: ["common", "tags"],
};

interface LoaderData {
  serverState: InstantSearchServerState;
  url: string;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const serverState = await getServerState(
    <AlgoliaWrapper url={request.url} />,
    {
      renderToString,
    }
  );
  return {
    serverState,
    url: request.url,
  };
};

export const unstable_shouldReload: ShouldReloadFunction = () => {
  // This prevents the loader from firing repeatedly while the user interacts with search features client-side
  return false;
};

export default function Search() {
  const { serverState, url } = useLoaderData<LoaderData>();

  return (
    <section>
      <Hero
        background={{
          imageProps: {
            src: "/heroBackground.webp",
            alt: "Abstract orange background",
          },
        }}
        size="small"
        title="Search"
      />
      <Inset>
        <AlgoliaWrapper url={url} serverState={serverState} />
      </Inset>
    </section>
  );
}
