import path from "path";
import { existsSync } from "fs";
import fs from "fs/promises";
import { removers } from ".";
import lodashGet from "lodash.get";

const stackDirectory = path.join(__dirname, "../../../stack");
const nextDirectory = path.join(__dirname, "../../../next.js");

expect.extend({
  toBeValidPath(filePath) {
    const absoluteStackFilePath = path.join(stackDirectory, filePath);
    const absoluteNextFilePath = path.join(nextDirectory, filePath);
    if (
      existsSync(absoluteStackFilePath) ||
      existsSync(absoluteNextFilePath) ||
      filePath.startsWith("docs/")
    ) {
      return {
        message: () => `File path ${filePath} should not exist but it does`,
        pass: true,
      };
    } else {
      return {
        message: () => `File path ${filePath} doesn't exist`,
        pass: false,
      };
    }
  },
  toHavePackageSection(packageJson, sectionPath) {
    const packageSection = lodashGet(packageJson, sectionPath);
    if (packageSection) {
      return {
        message: () =>
          `package.json section ${sectionPath} should not exist but it does`,
        pass: true,
      };
    } else {
      return {
        message: () => `package.json section ${sectionPath} doesn't exist`,
        pass: false,
      };
    }
  },
});

test("paths in pathsToRemove exist on all removers", () => {
  for (const remover of Object.values(removers)) {
    if (remover.pathsToRemove) {
      for (const filePath of remover.pathsToRemove) {
        expect(filePath).toBeValidPath();
      }
    }
  }
});

test("packages to remove in packagesToUninstall exist on all removers", async () => {
  const stackPackageJson = JSON.parse(
    await fs.readFile(path.join(stackDirectory, "package.json"), "utf-8")
  );
  const nextPackageJson = JSON.parse(
    await fs.readFile(path.join(nextDirectory, "package.json"), "utf-8")
  );
  const allPackages = [
    ...Object.keys(stackPackageJson.dependencies),
    ...Object.keys(stackPackageJson.devDependencies),
    ...Object.keys(nextPackageJson.dependencies),
    ...Object.keys(nextPackageJson.devDependencies),
  ];
  for (const remover of Object.values(removers)) {
    if (remover.packagesToUninstall) {
      for (const packageName of remover.packagesToUninstall) {
        expect(allPackages).toContain(packageName);
      }
    }
  }
});
