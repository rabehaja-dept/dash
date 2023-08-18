import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "strapi",
    "app/strapi",
    "app/routes/strapi-blog",
    "scripts/pg_init",
    "docs/strapi",
  ],
  packageSectionsToDelete: [
    "scripts.dev:strapi",
    "scripts.build:strapi",
    "scripts.start:strapi",
  ],
} as CategoryRemover;
