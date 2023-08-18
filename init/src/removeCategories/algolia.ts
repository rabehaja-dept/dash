import fs from "fs/promises";
import path from "path";
import { CategoryRemover } from ".";
import { exec } from "child_process";

export default {
  pathsToRemove: [
    // Remix
    "app/routes/contentful/search.tsx",
    "app/routes/api/index-contentful",
    "app/routes/shopify/index.tsx",
    "docs/algolia",
    "test/integration/algolia.test.ts",
    "patches/instantsearch.js+4.50.2.patch",
    // Next.js
    "pages/api/contentful/index-to-algolia/[slug].ts",
    "pages/api/sanity/index-to-algolia.tsx",
    "pages/contentful/posts/search.tsx",
    "pages/sanity/search.tsx",
    "pages/shopify/search.tsx",
  ],
  packagesToUninstall: [
    // Both
    "react-instantsearch-hooks-server",
    "react-instantsearch-hooks-web",
    "algoliasearch",
    // Next.js
    // we also remove "instantsearch.js" in the custom function below
    "react-instantsearch-dom",
    "react-instantsearch-hooks-router-nextjs",
  ],
  custom: async (rootDirectory) => {
    // Rename _index.tsx to index.tsx in store if exists
    try {
      // annoyingly, npm pkg delete doesn't work with
      // packages with a dot in the name
      exec("npm pkg delete dependencies[instantsearch.js]");
      await fs.rename(
        path.join(rootDirectory, "app/routes/shopify/_index.tsx"),
        path.join(rootDirectory, "app/routes/shopify/index.tsx")
      );
    } catch (e) {
      // Do nothing if fs.rename() throws an error, because we don't care if the file doesn't exist
    }
  },
} as CategoryRemover;
