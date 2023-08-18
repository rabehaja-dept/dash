import { CategoryRemover } from ".";
export default {
  pathsToRemove: [
    // Remix
    "app/tailwind",
    // Next.js
    "postcss.config.js",
    // Shared
    "tailwind.config.js",
  ],
  packagesToUninstall: [
    "tailwindcss-radix",
    "autoprefixer",
    "postcss",
    "prettier-plugin-tailwindcss",
    "tailwindcss",
  ],
  packageSectionsToDelete: ["scripts.pre-build:css", "scripts.dev:css"],
  custom: async () => {},
} as CategoryRemover;

/*
Removing tailwind dependency
Script to remove classNames 
*/
