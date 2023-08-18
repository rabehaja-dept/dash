import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    // Remix
    "app/contentful",
    "app/@types/generated/contentful.d.ts",
    "app/routes/contentful",
    "app/routes/contentful.tsx",
    "app/routes/api/index-contentful",
    "playwright/e2e/contentful.spec.ts",
    "playwright/pages/contentful.page.ts",
    "docs/contentful",
    "test/integration/contentful.test.ts",
    // Next.js
    "@types/generated/contentful.d.ts",
    "pages/contentful",
    "pages/api/contentful",
    "public/logos/contentful-logo.png",
    // Shared
    "contentful",
  ],
  packagesToUninstall: [
    "@contentful/rich-text-react-renderer",
    "@contentful/rich-text-types",
    "contentful",
    "contentful-import",
  ],
} as CategoryRemover;
