import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "kontent.ai",
    "@types/generated/kontent.ai",
    "pages/kontent.ai",
    "app/kontent.ai",
    "app/routes/[kontent.ai]",
    "app/routes/[kontent.ai].tsx",
    "app/@types/generated/kontent.ai",
    "docs/kontent.ai",
    "test/integration/kontent.ai.test.ts",
    "public/logos/kontent-ai-logo.png",
  ],
  packagesToUninstall: [
    "@kontent-ai/model-generator",
    "@kontent-ai/react-components",
  ],
} as CategoryRemover;
