import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    // Remix
    "app/shopify",
    "patches",
    "app/routes/shopify",
    "docs/shopify",
    "test/integration/shopify.test.ts",
    "patches/@shopify+hydrogen+1.6.6.patch",
    // Next.js
    "shopify",
    "pages/shopify",
    "public/logos/shopify-logo.png",
  ],
  packagesToUninstall: [
    "@shopify/hydrogen",
    "@shopify/hydrogen-react",
    "graphql-tag",
  ],
} as CategoryRemover;
