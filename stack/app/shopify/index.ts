import type { ASTNode } from "graphql";
import { print } from "graphql";
import { PRODUCT_QUERY, ALL_PRODUCTS_QUERY } from "./queries";
import type {
  Shop,
  Product,
} from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import {
  SHOPIFY_STORE,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_STOREFRONT_API_VERSION,
} from "~/config";
import fetch from "node-fetch";

function getLanguageAndCountryFromLocaleString(localeString?: string): {
  language?: string;
  country?: string;
} {
  if (localeString) {
    const locale = new Intl.Locale(localeString);
    return {
      language: locale.language.toUpperCase(),
      country: locale.region,
    };
  }
  return {};
}

export async function shopifyQuery(
  query: ASTNode,
  variables: Record<string, any>
) {
  const url = `https://${SHOPIFY_STORE}.myshopify.com/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      "content-type": "application/json",
    },
  });
  if (response.status !== 200) {
    throw new Error(
      `request failed with status ${response.status} ${response.statusText}`
    );
  }
  const data: any = await response.json();
  return data.data;
}

export async function allProducts(localeString?: string): Promise<any> {
  const { language, country } =
    getLanguageAndCountryFromLocaleString(localeString);

  const allProductsResponse = await shopifyQuery(ALL_PRODUCTS_QUERY, {
    language,
    country,
    pageBy: 25,
    cursor: null,
  });

  return allProductsResponse?.products?.nodes;
}

export async function productQuery(
  handle: string,
  localeString?: string
): Promise<{
  product: Product;
  shop: Shop;
}> {
  const { language, country } =
    getLanguageAndCountryFromLocaleString(localeString);
  const variables = {
    language,
    country,
    handle,
  };
  return await shopifyQuery(PRODUCT_QUERY, variables);
}
