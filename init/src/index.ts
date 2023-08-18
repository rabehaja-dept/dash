import path from "path";
import fs from "fs/promises";
import { initStack, initSitecore, getTechStack } from "./initStack";
import type { TechStack } from "./initStack";

async function run() {
  console.log("🚀  Initializing project...\n");

  const relativeTargetPath = process.argv[2];
  if (!relativeTargetPath) {
    throw new Error("Provide a relative target path as the first CLI argument");
  }

  // Get base tech stack
  const techStack: TechStack = await getTechStack();

  const stackPath = path.join(process.cwd(), "stack");
  const nextPath = path.join(process.cwd(), "next.js");
  const sitecorePath = path.join(process.cwd(), "sitecore");
  const docsPath = path.join(process.cwd(), "docs");

  const targetPath = path.join(process.cwd(), relativeTargetPath);
  const docsTarget = path.join(targetPath, "docs");

  console.log("\n🚚  Moving files into place...\n");

  // Copy docs to target path
  if (docsPath !== docsTarget) {
    await fs.cp(docsPath, docsTarget, {
      recursive: true,
    });
  }

  if (techStack === "Next.js") {
    // Copy next.js to target path
    await fs.cp(nextPath, targetPath, { recursive: true });
  } else if (techStack === "Remix") {
    // It's Remix
    // Copy stack to target path
    await fs.cp(stackPath, targetPath, { recursive: true });
  } else {
    // It's Sitecore
    // Temporarily change sitecore/sitecore to sitecore/sitecore_config otherwise it'll get nuked
    await fs.rename(
      path.join(sitecorePath, "sitecore"),
      path.join(sitecorePath, "sitecore_config")
    );
    await fs.cp(sitecorePath, targetPath, { recursive: true });
  }

  // Remove the stack directory
  await fs.rm(path.join(process.cwd(), "stack"), { recursive: true });
  // Remove the next.js directory
  await fs.rm(path.join(process.cwd(), "next.js"), { recursive: true });
  // Remove the sitecore directory and rename sitecore_config back to sitecore
  await fs.rm(path.join(process.cwd(), "sitecore"), { recursive: true });

  console.log("Cleaning up...\n");

  await fs.rename(
    path.join(sitecorePath, "sitecore_config"),
    path.join(sitecorePath, "sitecore")
  );

  if (techStack !== "Sitecore") {
    // Initialize the stack and run the feature removal process
    await initStack(targetPath, techStack);
  } else {
    // It's Sitecore
    initSitecore(targetPath);
  }

  // Clean up:
  // Remove the creation script
  await fs.rm(path.join(process.cwd(), "createStack.sh"));
  // Remove the init directory
  await fs.rm(path.join(process.cwd(), "init"), { recursive: true });
}

run();
