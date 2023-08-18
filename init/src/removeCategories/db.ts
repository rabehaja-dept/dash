import { CategoryRemover } from ".";

export default {
  pathsToRemove: [
    "prisma",
    "app/models",
    "app/routes/notes",
    "app/routes/join.tsx",
    "app/routes/login.tsx",
    "app/routes/logout.tsx",
    "app/routes/notes.tsx",
    "app/db.server.ts",
    "scripts/tunnel-db.sh",
  ],
  packagesToUninstall: ["prisma", "@prisma/client"],
  packageSectionsToDelete: ["scripts.setup", "prisma"],
} as CategoryRemover;
