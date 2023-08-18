import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    ".github/workflows/vercel_deploy.yml",
    ".github/workflows/vercel_preview_deploy.yml",
    "docs/deployment/Vercel.md",
  ],
} as CategoryRemover;
