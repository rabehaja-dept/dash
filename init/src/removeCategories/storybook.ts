import { exec } from "child_process";
import path from "path";
import { CategoryRemover } from ".";

export default {
  pathsToRemove: [".storybook", "app/components/stories"],
  packagesToUninstall: [
    "@percy/cli",
    "@percy/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/builder-webpack5",
    "@storybook/manager-webpack5",
    "@storybook/react",
    "@storybook/test-runner",
    "storybook-addon-designs",
  ],
  packageSectionsToDelete: [
    "scripts.build:storybook",
    "scripts.storybook",
    "scripts.storybook:start",
    "scripts.storybook:build",
    "scripts.storybook:test",
  ],
  custom: async (rootDirectory) => {
    try {
      // Delete all story files
      exec(
        `find ${path.join(
          rootDirectory,
          "app"
        )} -type f -name '*.stories.*' -delete`
      );
    } catch (e) {
      // Do nothing if fs.rename() throws an error, because we don't care if the file doesn't exist
    }
  },
} as CategoryRemover;
