import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    // Remix
    "commercetools",
    "app/commercetools",
    "app/routes/commercetools",
    "app/routes/api/commercetools",
    "app/routes/commercetools.tsx",
    // Next.js
    "commercetools",
    "stripe",
    "layouts/commercetools",
    "pages/api/commercetools",
    "pages/commercetools",
    "public/logos/commercetools-logo.png",
  ],
  packagesToUninstall: [
    // Remix
    "@commercetools/sdk-client-v2",
    "@commercetools/platform-sdk",
    "@deptdash/commercetools",
    // Next.js
    "@hookform/resolvers",
    "@types/next-auth",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
    "next-auth",
    "react-hook-form",
    "stripe",
  ],
} as CategoryRemover;
