// Configuration variables that are public and remain the same between environments are stored here
// all other configuration variables are environment variables in /.envrc (or look at /.envrc.example initially)

// @dash-remove-start contentful
export const CONTENTFUL_ACCESS_TOKEN =
  "366z1t9rZSesLtrvAEH0UGwJHNDf3GOlIMhzhq4RS1E";
// @dash-remove-end
export const ALGOLIA_APP_ID = "RHVCHJW67L";
export const ALGOLIA_INDEX = "demo_content";
export const ALGOLIA_SEARCH_KEY = "5e56001b6c4b76edb3d2b69ca5951b75";
// @dash-remove-start shopify
export const ALGOLIA_STORE_INDEX =
  "shopify_products_recently_ordered_count_desc";
export const SHOPIFY_STORE = "deptdash";
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  "94a0b1fcf16a93692150e69806d9786a";
export const SHOPIFY_STOREFRONT_API_VERSION = "2022-07";
// @dash-remove-end
export const GOOGLE_MAPS_API_KEY = "AIzaSyDE8_Yk3jtiLe4us1tWVokHkISOUwNWfig";
// @dash-remove-start stripe
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51MbPQ2Fli3kyams8BdMI7klg4INSpgNsWH8RbVYD9JvkHUZKqsDqNMyhRfMTbMYYwCkabkrRRp982zT25058peNa00v1XBHj2x";
// @dash-remove-end

export function getEnv(property: string): string;
export function getEnv<T>(
  property: string,
  options: { default: T }
): string | T;
export function getEnv(
  property: string,
  options?: { default: string | null }
): string | null {
  const value = process.env[property];
  if (!value && options) return options.default;
  if (!value)
    throw new Error(
      `no environment variable found for "${property}" and no default provided`
    );
  return value;
}
