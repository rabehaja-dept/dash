import { CartProvider, ShopifyProvider } from "@shopify/hydrogen-react"; // @dash-remove shopify

import { SessionProvider } from "next-auth/react"; // @dash-remove commercetools

// @dash-remove-start chakra
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
// Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({ colors });
// @dash-remove-end

import "~/styles/globals.css"; // @dash-remove tailwind
import { CommercetoolsCartProvider } from "~/commercetools/context/CommercetoolsCartContext"; // @dash-remove commercetools

function MyApp({ Component, pageProps }) {
  // @dash-remove-start shopify
  const shopify = {
    storeDomain: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE}.myshopify.com`,
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    storefrontApiVersion:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
  };
  // @dash-remove-end

  return (
    // @dash-remove-start shopify
    <ShopifyProvider
      storeDomain={shopify.storeDomain}
      storefrontToken={shopify.storefrontToken}
      storefrontApiVersion={shopify.storefrontApiVersion}
      countryIsoCode={"US"}
      languageIsoCode={"EN"}
    >
      {/* @dash-remove-end */}
      {/* @dash-remove-next-line shopify */}
      <CartProvider>
        {/* @dash-remove-next-line chakra */}
        <ChakraProvider theme={theme}>
          {/* @dash-remove-start commercetools */}
          <SessionProvider
            session={pageProps.session}
            basePath="/api/commercetools/auth"
          >
            {/* @dash-remove-end */}
            {/* @dash-remove-next-line chakra */}
            <ChakraProvider theme={theme}>
              {/* @dash-remove-next-line commercetools */}
              <CommercetoolsCartProvider>
                <Component {...pageProps} />
                {/* @dash-remove-next-line commercetools */}
              </CommercetoolsCartProvider>
              {/* @dash-remove-next-line chakra */}
            </ChakraProvider>
            {/* @dash-remove-next-line commercetools */}
          </SessionProvider>
          {/* @dash-remove-next-line chakra */}
        </ChakraProvider>
        {/* @dash-remove-next-line shopify */}
      </CartProvider>
      {/* @dash-remove-next-line shopify */}
    </ShopifyProvider>
  );
}
export default MyApp;
