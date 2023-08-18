import type { ReactNode } from "react";
import { CartProvider } from "@shopify/hydrogen";
import { ShopifyContext } from "@shopify/hydrogen";
import { defaultCountryCode, defaultLanguageCode } from "~/i18n-config";
import {
  SHOPIFY_STORE,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_STOREFRONT_API_VERSION,
} from "~/config";

export type ShopifyProviderProps = {
  children: ReactNode;
};

export const ShopifyProvider = ({ children }: ShopifyProviderProps) => {
  /* Notes about what we're doing here:
  1. We need a ShopifyContext in order for hooks to work (like useProduct, which in turns calls useShop)
  2. We can't use ShopifyProvider because it expects a server request context to be present from Hydrogen
  3. We can't use ShopifyProviderClient because we can't include the file on the server because it's named ShopifyProvider.client.js and Remix excludes all *.client.js from the server bundle */
  return (
    <ShopifyContext.Provider
      value={{
        defaultLanguageCode,
        defaultCountryCode,
        storefrontId: undefined,
        storeDomain: `${SHOPIFY_STORE}.myshopify.com`,
        storefrontToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        storefrontApiVersion: SHOPIFY_STOREFRONT_API_VERSION,
      }}
    >
      <CartProvider>{children}</CartProvider>
    </ShopifyContext.Provider>
  );
};
