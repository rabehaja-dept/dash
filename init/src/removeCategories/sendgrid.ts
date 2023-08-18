import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "app/sendgrid",
    "docs/sendgrid",
    "commercetools/api-extensions",
  ],
  packagesToUninstall: ["@sendgrid/mail"],
} as CategoryRemover;
