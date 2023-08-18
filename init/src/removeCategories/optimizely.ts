import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "app/optimizely",
    "app/routes/_/optimizely.tsx",
    "docs/optimizely",
  ],
  packagesToUninstall: ["@optimizely/react-sdk"],
} as CategoryRemover;
