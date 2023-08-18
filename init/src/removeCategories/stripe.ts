import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "docs/stripe",
    "app/stripe",
    "app/routes/commercetools/checkout/stripe",
    "app/routes/api/stripe",
  ],
  packagesToUninstall: [
    "stripe",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
  ],
} as CategoryRemover;
