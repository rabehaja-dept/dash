import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "app/routes/_/cloudinary-example.tsx",
    "test/integration/cloudinary.test.ts",
    "docs/cloudinary",
  ],
  packagesToUninstall: ["@cloudinary/react", "@cloudinary/url-gen"],
} as CategoryRemover;
