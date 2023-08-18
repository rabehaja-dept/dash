import fs from "fs/promises";
import path from "path";
import glob from "glob";
import util from "util";
import { Category } from "./initStack";
import { executeCategoryRemovalLogic } from "./removeCategories";

export async function runRemove(options: {
  rootDirectory: string;
  categoriesToRemove: Category[];
  leaveComments: boolean;
}) {
  const globPromise = util.promisify(glob);
  // Collect all the file paths we want to operate on
  const filePaths = (
    await Promise.all([
      globPromise(path.resolve(options.rootDirectory, "app/**/*.+(ts|tsx)")),
      globPromise(path.resolve(options.rootDirectory, "server/**/*.+(ts|tsx)")),
      globPromise(path.resolve(options.rootDirectory, "pages/**/*.+(ts|tsx)")),
      globPromise(path.resolve(options.rootDirectory, "lib/**/*.+(ts|tsx)")),
      globPromise(path.resolve(options.rootDirectory, "docs/**/*")),
      globPromise(
        path.resolve(options.rootDirectory, "default-home-page/**/*")
      ),
      globPromise(
        path.resolve(options.rootDirectory, "styles/**/*.+(ts|tsx|css)")
      ),
      globPromise(
        path.resolve(options.rootDirectory, "components/**/*.+(ts|tsx)")
      ),
      globPromise(
        path.resolve(options.rootDirectory, "cdk/bin/**/*.+(ts|tsx)")
      ),
      globPromise(path.resolve(options.rootDirectory, ".github/**/*")),
      globPromise(path.resolve(options.rootDirectory, ".storybook/**/*")),
      globPromise(path.resolve(options.rootDirectory, "docs/**/*")),
      globPromise(path.resolve(options.rootDirectory, "scripts/README.md")),
      globPromise(path.resolve(options.rootDirectory, "scripts/src/main.ts")),
      // This is intentionally not recursive, because we just want the files in the root directory
      globPromise(path.resolve(options.rootDirectory, "*")),
      // Pick up dotfiles in the root directory
      globPromise(path.resolve(options.rootDirectory, ".*")),
    ])
  ).flat();
  for (const filePath of filePaths) {
    if (!(await fs.lstat(filePath)).isDirectory()) {
      let file = await fs.readFile(filePath, "utf8");
      // Execute all of the commands on each category to remove
      if (options.categoriesToRemove) {
        file = removeLine(file, options.categoriesToRemove);
        file = removeNextLine(file, options.categoriesToRemove);
        file = removeStartAndEnd(file, options.categoriesToRemove);
        file = replaceLine(file, options.categoriesToRemove);
        file = replaceNextLine(file, options.categoriesToRemove);
      }
      // Unless options tells us to leave comments, clean them all up
      if (!options.leaveComments) {
        file = cleanup(file);
      }
      await fs.writeFile(filePath, file);
    }
  }
  for (const category of options.categoriesToRemove) {
    await executeCategoryRemovalLogic(options.rootDirectory, category);
  }
}

export function removeLine(file: string, categoriesToRemove: Category[]) {
  return executeRemove(
    file,
    categoriesToRemove,
    /.*@dash-remove ([a-zA-Z0-9_.]+).*\n?/g
  );
}

export function removeNextLine(file: string, categoriesToRemove: Category[]) {
  return executeRemove(
    file,
    categoriesToRemove,
    /.*@dash-remove-next-line ([a-zA-Z0-9_.]+).*\n.*\n?/g
  );
}

export function removeStartAndEnd(
  file: string,
  categoriesToRemove: Category[]
) {
  return executeRemove(
    file,
    categoriesToRemove,
    /.*@dash-remove-start ([a-zA-Z0-9_.]+)[\s\S]*?@dash-remove-end.*\n?/g
  );
}

export function executeRemove(
  file: string,
  categoriesToRemove: Category[],
  regex: RegExp
) {
  for (const matchArray of file.matchAll(regex)) {
    const match = matchArray[0];
    const category = matchArray[1] as Category;
    if (categoriesToRemove.includes(category)) {
      // Remove the matched string
      file = file.replace(match, "");
    }
  }
  return file;
}

export function replaceLine(file: string, categoriesToRemove: Category[]) {
  return executeReplace(
    file,
    categoriesToRemove,
    /.*@dash-replace ([a-zA-Z0-9_.]+): (.*)\n?/g
  );
}

export function replaceNextLine(file: string, categoriesToRemove: Category[]) {
  return executeReplace(
    file,
    categoriesToRemove,
    /.*@dash-replace-next-line ([a-zA-Z0-9_.]+): (.*)\n.*\n?/g
  );
}

export function executeReplace(
  file: string,
  categoriesToRemove: Category[],
  regex: RegExp
) {
  for (const matchArray of file.matchAll(regex)) {
    const match = matchArray[0];
    const category = matchArray[1] as Category;
    const replaceWith = matchArray[2];
    if (categoriesToRemove.includes(category)) {
      // Replace the matched string
      // We replace the entire line, including the ending newline, so we need to add a newline to make our replacement line live on it's own line
      file = file.replace(match, replaceWith + "\n");
    }
  }
  return file;
}

export function cleanup(file: string) {
  const regex = /\s*(\/\/|#|<!--|{\/\*)\s*@dash-(remove|replace).*/g;
  for (const matchArray of file.matchAll(regex)) {
    const match = matchArray[0];
    // Remove the matched string (which is just the comment in this case)
    file = file.replace(match, "");
  }
  return file;
}
