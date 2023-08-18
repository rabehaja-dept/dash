import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    // Remix
    "app/sanity",
    "app/@types/block-content-to-react.d.ts",
    "app/@types/sanity.ts",
    "docs/sanity",
    "test/integration/sanity.test.ts",
    // Next.js
    "sanity",
    "pages/sanity",
    "pages/api/sanity",
    "sanity.cli.ts",
    "sanity.config.ts",
    "public/logos/sanity-logo.png",
  ],
  packagesToUninstall: [
    "@sanity/block-content-to-react",
    "@portabletext/types",
    // Next.js
    "sanity",
    "sanity-algolia",
    "next-sanity",
    "next-sanity-image",
    "@sanity/ui",
    "@sanity/vision",
    "@portabletext/react",
  ],
} as CategoryRemover;
