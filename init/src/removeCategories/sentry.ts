import { CategoryRemover } from ".";

export default {
  pathsToRemove: ["server/sentry-remix-node.ts"],
  packagesToUninstall: [
    "@sentry/node",
    "@sentry/remix",
    "@sentry/tracing",
    "@sentry/types",
  ],
} as CategoryRemover;
