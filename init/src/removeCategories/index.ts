import util from "util";
import fs from "fs/promises";
import { Category } from "../initStack";
import algolia from "./algolia";
import aws from "./aws";
import contentful from "./contentful";
import commercetools from "./commercetools";
import adyen from "./adyen";
import kontentAi from "./kontent.ai";
import base from "./base";
import chakra from "./chakra";
import db from "./db";
import fly from "./fly";
import vercel from "./vercel";
import shopify from "./shopify";
import storybook from "./storybook";
import strapi from "./strapi";
import path from "path";
import cloudinary from "./cloudinary";
import sanity from "./sanity";
import contentstack from "./contentstack";
import optimizely from "./optimizely";
import gtags from "./gtags";
import sentry from "./sentry";
import stripe from "./stripe";
import sendgrid from "./sendgrid";
import tailwind from "./tailwind";
import headlessUi from "./headlessui";

const exec = util.promisify(require("child_process").exec);

export interface CustomerRemoverFn {
  (rootDirectory: string): Promise<void>;
}

export interface CategoryRemover {
  pathsToRemove?: string[];
  packagesToUninstall?: string[];
  packageSectionsToDelete?: string[];
  custom?: CustomerRemoverFn;
}

async function npmUninstall(
  rootDirectory: string,
  packagesToUninstall: string[]
) {
  // Collect JSON paths to all package names
  // We brute force whether it's dependencies or devDependencies and try to remove either one
  const dependencyPaths = packagesToUninstall.map(
    (packageName) => `dependencies.${packageName}`
  );
  const devDependencyPaths = packagesToUninstall.map(
    (packageName) => `devDependencies.${packageName}`
  );
  await exec(
    `npm pkg delete ${dependencyPaths.join(" ")} ${devDependencyPaths.join(
      " "
    )}`,
    {
      stdio: "ignore",
      cwd: rootDirectory,
    }
  );
}

async function npmPkgDelete(
  rootDirectory: string,
  packageSectionsToDelete: string[]
) {
  await exec(`npm pkg delete ${packageSectionsToDelete.join(" ")}`, {
    stdio: "ignore",
    cwd: rootDirectory,
  });
}

export const removers: { [key in Category]: CategoryRemover } = {
  base,
  db,
  storybook,
  strapi,
  contentful,
  commercetools,
  adyen,
  "kontent.ai": kontentAi,
  contentstack,
  shopify,
  algolia,
  aws,
  fly,
  vercel,
  staging: {},
  production: {},
  cloudinary,
  gtags,
  sentry,
  sanity,
  optimizely,
  stripe,
  sendgrid,
  tailwind,
  chakra,
  headlessui: headlessUi,
};

export async function executeCategoryRemovalLogic(
  rootDirectory: string,
  category: Category
) {
  const remover = removers[category];
  // Remove the listed files or directories
  if (remover.pathsToRemove) {
    for (const filePath of remover.pathsToRemove) {
      // The force: true is to ignore errors if the file doesn't exist, because sometimes multiple removers try to remove the same thing
      await fs.rm(path.join(rootDirectory, filePath), {
        recursive: true,
        force: true,
      });
    }
  }
  // Run the removers custom function if it has one, to address custom logic not handled by the other props
  if (remover.custom) {
    await remover.custom(rootDirectory);
  }
  // Uninstall NPM packages
  if (remover.packagesToUninstall) {
    await npmUninstall(rootDirectory, remover.packagesToUninstall);
  }
  // Remove NPM sections in package.json
  if (remover.packageSectionsToDelete) {
    await npmPkgDelete(rootDirectory, remover.packageSectionsToDelete);
  }
}
