import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Hits,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  Pagination,
  RangeInput,
  RefinementList,
  SearchBox,
} from "react-instantsearch-hooks-web";
import type { BaseHit } from "instantsearch.js";
import { useTranslation } from "react-i18next";
import { ShouldReloadFunction, useLoaderData } from "@remix-run/react";
import {
  ALGOLIA_APP_ID,
  ALGOLIA_STORE_INDEX,
  ALGOLIA_SEARCH_KEY,
} from "~/config";
import type { Handle } from "~/@types";
import { useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { history } from "instantsearch.js/es/lib/routers/index.js";
import { getServerState } from "react-instantsearch-hooks-server";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import { ProductCard } from "~/shopify/components/ProductCard";
import { FilterDrawer } from "~/shopify/components/FilterDrawer";
import { renderToString } from "react-dom/server";
export function AlgoliaWrapper({ url, serverState }: AlgoliaWrapperProps) {
  const [searchClient] = useState(
    algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
  );
  const { t } = useTranslation(["tags"]);

  return (
    <section className="m-10">
      <div className="my-6">
        <h2>Product Page Title</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu nisl
          quis nisl
        </p>
      </div>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          indexName={ALGOLIA_STORE_INDEX}
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
          <FilterDrawer>
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
            <div className="mt-4 font-bold">Size</div>
            <RefinementList
              attribute="options.size"
              classNames={{
                list: "mb-4",
                item: "my-1",
                checkbox: "mr-2",
                count: "ml-2 text-sm text-gray-500",
              }}
            />
            <div className="mt-4 font-bold">Price</div>
            {/* TODO: Either style this, or maybe switch to https://www.algolia.com/doc/api-reference/widgets/range-slider/react-hooks/ */}
            <RangeInput attribute="price" />
          </FilterDrawer>
          <Hits
            classNames={{
              list: "mt-12 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4",
            }}
            hitComponent={Hit}
          />
          <Pagination
            classNames={{
              root: "mt-6 flex justify-center",
              item: "inline-block",
              link: "py-2 px-3",
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </InstantSearch>
      </InstantSearchSSRProvider>
    </section>
  );
}

export const handle: Handle = {
  i18n: ["common", "tags"],
};

export const meta: MetaFunction = () => {
  return {
    title: "Shopify",
    description: "Check out our products!",
  };
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
      <AlgoliaWrapper url={url} serverState={serverState} />
    </section>
  );
}

function Hit({ hit }: { hit: Product & BaseHit }) {
  return <ProductCard product={hit} />;
}

type AlgoliaWrapperProps = {
  url: string;
  serverState?: InstantSearchServerState;
};
