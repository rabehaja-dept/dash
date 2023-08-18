import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "app/contentstack",
    "app/routes/contentstack",
    "app/@types/generated/contentstack",
    "test/integration/contentstack.test.ts",
    "docs/contentstack",
  ],
  packagesToUninstall: ["react-html-parser", "@types/react-html-parser"],
} as CategoryRemover;
