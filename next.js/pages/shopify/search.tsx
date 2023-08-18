import type { Product } from "@shopify/hydrogen-react/storefront-api-types";
import type { GetServerSideProps } from "next";

import React from "react";
import Link from "next/link";
import singletonRouter from "next/router";
import { renderToString } from "react-dom/server";
import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js";
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  Highlight,
  RefinementList,
  SearchBox,
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web";
import { getServerState } from "react-instantsearch-hooks-server";
import { createInstantSearchRouterNext } from "react-instantsearch-hooks-router-nextjs";

// Instantsearch CSS - you can remove this if you don't want to use it
import "instantsearch.css/themes/satellite.css";

import { SHOPIFY_BASE_URL, SHOPIFY_ALGOLIA_INDEX } from "~/lib/consts";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

// Instantiate Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

// Adjust the hit type to match your index's shape
type HitProps = {
  hit: AlgoliaHit<Product>;
};

function Hit({ hit }: HitProps) {
  return (
    <Link href={`${SHOPIFY_BASE_URL}/${hit.handle}`}>
      <Highlight hit={hit} attribute="handle" />
      <span>{hit.title}</span>
    </Link>
  );
}

type SearchPageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
};

export default function Search({ serverState, url }: SearchPageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <section
        style={{
          margin: "1rem",
          maxWidth: "600px",
        }}
      >
        <h1>Search using Algolia</h1>
        <InstantSearch
          searchClient={client}
          indexName={SHOPIFY_ALGOLIA_INDEX}
          routing={{
            router: createInstantSearchRouterNext({
              serverUrl: url,
              singletonRouter,
            }),
          }}
          insights={true}
        >
          <div>
            <div>
              <DynamicWidgets fallbackComponent={FallbackComponent} />
            </div>
            <div>
              <SearchBox />
              <Hits hitComponent={Hit} />
            </div>
          </div>
        </InstantSearch>
      </section>
    </InstantSearchSSRProvider>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return <RefinementList attribute={attribute} />;
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> =
  async function getServerSideProps({ req }) {
    const protocol = req.headers.referer?.split("://")[0] || "https";
    const url = `${protocol}://${req.headers.host}${req.url}`;
    const serverState = await getServerState(<Search url={url} />, {
      renderToString,
    });

    return {
      props: {
        serverState,
        url,
      },
    };
  };
