import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "docs/adyen",
    "app/commercetools/adyen",
    "app/routes/api/adyen",
    "app/routes/commercetools/orders/adyen",
    "app/routes/commercetools/checkout/adyen",
  ],
  packagesToUninstall: ["@adyen/api-library", "@adyen/adyen-web"],
} as CategoryRemover;
