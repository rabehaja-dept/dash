import { execSync, spawnSync } from "child_process";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import { runRemove } from "./remove";

// We need these category and deployment names both as types and at runtime, which is why we have array representations and type representations
const featureCategoryNames = [
  "db",
  "storybook",
  "strapi",
  "contentful",
  "commercetools",
  "adyen",
  "kontent.ai",
  "contentstack",
  "shopify",
  "algolia",
  "cloudinary",
  "sanity",
  "optimizely",
  "gtags",
  "sentry",
  "stripe",
  "sendgrid",
  "tailwind",
  "chakra",
  "headlessui",
] as const;
const deploymentCategoryNames = ["aws", "fly", "vercel"] as const;
const stageCategoryNames = ["staging", "production"] as const;
export type FeatureCategory = (typeof featureCategoryNames)[number];
export type DeploymentCategory = (typeof deploymentCategoryNames)[number];
export type StageCategory = (typeof stageCategoryNames)[number];

// Add "base" as a category here, since it's the baseline removal category that's always present
const categoryNames = [
  "base",
  ...featureCategoryNames,
  ...deploymentCategoryNames,
  ...stageCategoryNames,
] as const;
export type Category = (typeof categoryNames)[number];

const deploymentTargetNames = [
  "AWS",
  "Fly.io",
  "Vercel",
  "I'll configure this myself",
] as const;
export type DeploymentTarget = (typeof deploymentTargetNames)[number];

export function getRandomString(numberOfBytes: number) {
  // The returned string will always be twice the length of numberOfBytes
  return crypto.randomBytes(numberOfBytes).toString("hex");
}

export function toKebabCase(identifier: string) {
  return identifier
    .split("")
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join("")
    .trim()
    .replace(/[_\s]+/g, "-");
}

async function replaceInFile(filename: string, replacement: string) {
  const contents = await fs.readFile(filename, "utf-8");
  const adjusted = contents
    .replace(/DEPT_DASH_PROJECT_NAME/g, replacement)
    .replace(/dept-dash-project-name/g, toKebabCase(replacement))
    .replace(
      /^export SESSION_SECRET=.*$/m,
      `export SESSION_SECRET="${getRandomString(16)}"`
    );
  await fs.writeFile(filename, adjusted);
}

export function parseCategories(maybeCategories: string[]): Category[] {
  // If every string matches our list of categories, then this is a valid array of categories and we can safely typecast
  const valid = maybeCategories.every((maybeCategory) =>
    categoryNames.includes(maybeCategory as Category)
  );
  if (valid) {
    return maybeCategories as Category[];
  }
  throw new Error(
    `Attempted to parse invalid array of categories: ${maybeCategories}`
  );
}

export function parseDeploymentTarget(
  maybeDeploymentTarget: string
): DeploymentTarget {
  const deploymentTarget = deploymentTargetNames.find(
    (validDeploymentTarget) => validDeploymentTarget === maybeDeploymentTarget
  );
  if (deploymentTarget) {
    return deploymentTarget;
  }
  throw new Error(
    `Attempted to parse invalid deployment target: ${maybeDeploymentTarget}`
  );
}

export type TechStack = "Next.js" | "Remix" | "Sitecore";

export async function getTechStack(): Promise<TechStack> {
  if (process.stdin.isTTY) {
    const answer = await inquirer.prompt([
      {
        name: "techStack",
        type: "list",
        message: "Which project framework would you like to use?",
        choices: ["Remix", "Next.js", "Sitecore"] as TechStack[],
      },
    ]);
    return answer.techStack;
  }
  // If we're not in a TTY, we're probably running in CI,
  // so we'll just default to Remix
  return "Remix";
}

export async function initStack(rootDirectory: string, techStack: TechStack) {
  const DIR_NAME = path.basename(rootDirectory);

  // Set up .envrc
  await fs.copyFile(
    path.join(rootDirectory, ".envrc.example"),
    path.join(rootDirectory, ".envrc")
  );

  if (techStack === "Remix") {
    // Replace tokens in each of these files
    await Promise.all(
      [
        ".envrc.example",
        ".envrc",
        ".github/workflows/main.yml",
        "cdk/bin/cdk.ts",
        "cdk/README.md",
        "package.json",
        "README.md",
        "scripts/tail-logs.sh",
        "fly.toml",
        "scripts/src/main.ts",
      ]
        .map((f) => path.join(rootDirectory, f))
        .map((f) => replaceInFile(f, DIR_NAME))
    );
    // Replace the overwhelming README with a link to docs
    const newReadme = `# ${DIR_NAME}\n\nThis project was generated with DEPT DASH™.\n\nCheck out the [documentation](./docs/SUMMARY.md) for detailed instructions on development and deployment.`;
    fs.writeFile(path.join(rootDirectory, "README.md"), newReadme);
  }

  // Ask remaining setup questions and implement the answers
  const answers = await askSetupQuestions(rootDirectory, techStack);

  // This only works if we npm installed (it doesn't work when run in CI, but also doesn't matter in that scenario)
  if (!process.env.NO_NPM_INSTALL || process.env.NO_NPM_INSTALL !== "true") {
    console.log("🚚  Moving files...\n\n");
    if (techStack === "Remix") {
      // At the end of the process, run `npm run build` to generate tailwind and other built assets
      execSync("npm run --silent build", {
        stdio: "inherit",
        cwd: rootDirectory,
      });
    }
    // Run `npm run format` since some of these steps may have messed up formatting (mainly removing things)
    console.log("🚚  Formatting...\n\n");
    execSync("npm run format", { stdio: "ignore", cwd: rootDirectory });
  }

  if (techStack === "Next.js") {
    execSync("npm install --silent", { stdio: "ignore", cwd: rootDirectory });
  }

  console.log(
    `%c
    ____  __________  ______   ____  ___   _____ __  __
   / __ \\/ ____/ __ \\/_  __/  / __ \\/   | / ___// / / /
  / / / / __/ / /_/ / / /    / / / / /| | \\__ \\/ /_/ / 
 / /_/ / /___/ ____/ / /    / /_/ / ___ |___/ / __  /  
/_____/_____/_/     /_/    /_____/_/  |_/____/_/ /_/   
                                                       
`,
    `font-family: monospace; color: #5115f7;`
  );

  // Make sure the database is running, or notify the user accordingly
  if (answers?.integrations?.includes("db")) {
    const pgRunning = spawnSync("nc", ["-z", "localhost", "5432"]).status === 0;
    if (!pgRunning) {
      console.log(
        `
✨ Setup is almost complete. ✨\n\n
Follow these steps to finish initialization: \n
👉 Start the database by getting postgres listening on :5432. Mac users may appreciate
    Postgres.app. On linux you might use systemctl. \n
👉 Run setup (this updates the database):
   npm run setup \n
      `.trim()
      );
      console.log("\n Then, \n");
    }
  }

  // Make sure direnv is available, or notify the user accordingly
  const direnvAvailable = spawnSync("direnv", ["allow"], {
    cwd: rootDirectory,
  });
  if (direnvAvailable.status !== 0) {
    console.log(
      `
👉 Make sure direnv is installed, and mark this directory trusted: \n\n
  run: 'direnv allow'
      `.trim()
    );
    console.log("\n Then, \n");
  }

  if (answers?.integrations?.includes("strapi")) {
    console.log(
      `
👉 Since you enabled Strapi,
  Create a database named "strapi" in your local postgres
      `.trim()
    );

    console.log("\n Then, \n");
  }

  console.log("🚀  Get started by running\n");

  if (techStack === "Remix") {
    console.log(`'cd ${DIR_NAME}' && npm run first-run`);
  } else {
    execSync("npm install --silent", { stdio: "ignore", cwd: rootDirectory });
    console.log(`'cd ${DIR_NAME}' && npm run dev`);
  }
}

interface Answers {
  integrations: Category[];
  remixProjectType?: RemixProjectType;
  nextProjectType?: NextProjectType;
  nextStyling?: NextStyling[];
  deployment?: DeploymentTarget;
  staging?: boolean;
  production?: boolean;
}

type RemixProjectType =
  | "Simple Marketing Site without CMS"
  | "Marketing Site with Contentful"
  | "Marketing Site with Kontent.ai"
  | "Marketing Site with Contentstack"
  | "E-Commerce Site with Shopify"
  | "E-Commerce Site with Shopify + Contentful"
  | "E-Commerce Site with Shopify + Sanity"
  | "E-Commerce Site with Commercetools + Adyen"
  | "E-Commerce Site with Commercetools + Stripe"
  | "Custom Setup";

type NextProjectType =
  | "Marketing Site with Contentful"
  | "Marketing Site with Sanity"
  | "Marketing Site with Kontent.ai"
  | "E-Commerce Site with Shopify"
  | "E-Commerce Site with Shopify + Contentful"
  | "E-Commerce Site with Shopify + Sanity"
  | "E-Commerce Site with Commercetools + Stripe"
  | "Custom Setup";

type NextStyling = "tailwind" | "headlessui" | "chakra";

async function askSetupQuestions(
  rootDirectory: string,
  techStack: TechStack
): Promise<Answers> {
  let answers: Answers = {
    integrations: [],
  };
  if (process.stdin.isTTY) {
    answers = await inquirer.prompt([
      {
        /**
         * Pre-set choices for a Remix project
         */
        name: "remixProjectType",
        type: "list",
        message: "What type of project is this?",
        choices: [
          new inquirer.Separator("Marketing"),
          "Simple Marketing Site without CMS",
          "Marketing Site with Contentful",
          "Marketing Site with Kontent.ai",
          "Marketing Site with Contentstack",
          new inquirer.Separator("E-Commerce"),
          "E-Commerce Site with Shopify",
          "E-Commerce Site with Shopify + Contentful",
          "E-Commerce Site with Shopify + Sanity",
          "E-Commerce Site with Commercetools + Adyen",
          "E-Commerce Site with Commercetools + Stripe",
          new inquirer.Separator("Other"),
          "Custom Setup",
        ],
        when: () => techStack === "Remix",
      },
      {
        /**
         * Pre-set choices for a Next.js project
         */
        name: "nextProjectType",
        type: "list",
        message: "What type of project is this?",
        choices: [
          "Marketing Site with Contentful",
          "Marketing Site with Sanity",
          "Marketing Site with Kontent.ai",
          "E-Commerce Site with Shopify",
          "E-Commerce Site with Shopify + Sanity",
          "E-Commerce Site with Shopify + Contentful",
          "E-Commerce Site with Commercetools + Stripe",
          "Custom Setup",
        ],
        when: () => techStack === "Next.js",
      },
      {
        /**
         * Custom configuration choices for a Remix project
         */
        name: "integrations",
        type: "checkbox",
        message: "What DASH™ integrations would you like to use?",
        default: [],
        choices: [
          new inquirer.Separator("CMS"),
          { name: "Contentful", value: "contentful" },
          { name: "Strapi", value: "strapi" },
          { name: "Kontent.ai", value: "kontent.ai" },
          { name: "Contentstack", value: "contentstack" },
          new inquirer.Separator("E-Commerce"),
          { name: "Shopify", value: "shopify" },
          { name: "Shopify + Sanity", value: "sanity" },
          { name: "Commercetools", value: "commercetools" },
          new inquirer.Separator("Other"),
          { name: "Adyen", value: "adyen" },
          { name: "Algolia", value: "algolia" },
          { name: "Cloudinary", value: "cloudinary" },
          {
            name: "Optimizely",
            value: "optimizely",
          },
          {
            name: "Postgres/Primsa",
            value: "db",
          },
          { name: "Storybook", value: "storybook", checked: true },
          { name: "Tailwind", value: "tailwind", checked: true },
          { name: "Stripe Payments", value: "stripe" },
          { name: "Google Tag Manager", value: "gtags", checked: true },
          { name: "Sentry", value: "sentry", checked: true },
          { name: "Sendgrid", value: "sendgrid" },
        ],
        when: (answers) =>
          techStack === "Remix" && answers.remixProjectType === "Custom Setup",
      },
      {
        /**
         * Custom configuration choices for a Next.js project
         */
        name: "integrations",
        type: "checkbox",
        message: "What DASH™ integrations would you like to use?",
        default: [],
        choices: [
          new inquirer.Separator("CMS"),
          { name: "Contentful", value: "contentful" },
          { name: "Sanity", value: "sanity" },
          { name: "Kontent.ai", value: "kontent.ai" },
          new inquirer.Separator("E-Commerce"),
          { name: "Shopify", value: "shopify" },
          { name: "Commercetools", value: "commercetools" },
          new inquirer.Separator("Styling / Component Libraries"),
          { name: "Tailwind", value: "tailwind" },
          { name: "Headless UI", value: "headlessui" },
          { name: "Chakra UI", value: "chakra" },
        ],
        when: (answers) =>
          techStack === "Next.js" && answers.nextProjectType === "Custom Setup",
      },
      {
        name: "nextStyling",
        type: "checkbox",
        message:
          "What styling / component library solution(s) would you like to use?",
        choices: [
          { name: "Tailwind", value: "tailwind" },
          { name: "Chakra UI", value: "chakra" },
          { name: "Headless UI", value: "headlessui" },
        ],
        when: (answers) =>
          techStack === "Next.js" && answers.nextProjectType !== "Custom Setup",
      },
      {
        name: "globalCacheSeconds",
        type: "number",
        default: 0,
        message: "How long do you want to cache pages by default (in seconds)?",
        when: () => techStack === "Remix",
      },
      {
        name: "deployment",
        type: "list",
        default: "AWS",
        message: "Use AWS, Fly.io or Vercel for deployment?",
        suffix: " This may depend on your client's preferences",
        choices: deploymentTargetNames,
        when: () => techStack === "Remix",
      },
      {
        name: "staging",
        type: "confirm",
        default: true,
        message: "Use a staging environment?",
        when: (answers) =>
          techStack === "Remix" && answers.deployment !== "Vercel",
      },
      {
        name: "production",
        type: "confirm",
        default: true,
        message: "Use a production environment?",
        when: (answers) =>
          techStack === "Remix" && answers.deployment !== "Vercel",
      },
    ]);

    /**
     * REMIX PROJECT SETUP LOGIC
     */
    if (techStack === "Remix") {
      if (answers.remixProjectType === "Simple Marketing Site without CMS") {
        answers.integrations = [];
      } else if (
        answers.remixProjectType === "Marketing Site with Contentful"
      ) {
        answers.integrations = ["contentful"];
      } else if (
        answers.remixProjectType === "Marketing Site with Kontent.ai"
      ) {
        answers.integrations = ["kontent.ai"];
      } else if (
        answers.remixProjectType === "Marketing Site with Contentstack"
      ) {
        answers.integrations = ["contentstack"];
      } else if (
        answers.remixProjectType === "E-Commerce Site with Shopify + Sanity"
      ) {
        answers.integrations = ["sanity", "shopify"];
      } else if (
        answers.remixProjectType ===
        "E-Commerce Site with Commercetools + Adyen"
      ) {
        answers.integrations = ["commercetools", "adyen"];
      } else if (
        answers.remixProjectType ===
        "E-Commerce Site with Commercetools + Stripe"
      ) {
        answers.integrations = ["commercetools", "stripe"];
      } else if (answers.remixProjectType === "E-Commerce Site with Shopify") {
        answers.integrations = ["shopify"];
      } else if (
        answers.remixProjectType === "E-Commerce Site with Shopify + Contentful"
      ) {
        answers.integrations = ["contentful", "shopify"];
      }

      /**
       * Always include Storybook, Google Tag Manager, Sentry, Headless, and Tailwind
       * unless the user is doing a custom project
       */
      if (answers.remixProjectType !== "Custom Setup") {
        answers.integrations.push("storybook");
        answers.integrations.push("gtags");
        answers.integrations.push("sentry");
        answers.integrations.push("headlessui");
        answers.integrations.push("tailwind");
      }

      /**
       * REQUIREMENTS FOR EACH INTEGRATION
       * Each integration might require other integrations to be selected
       */

      // Commercetools
      if (answers.integrations?.includes("commercetools")) {
        // When no payment provider has been selected
        if (
          !answers.integrations?.includes("adyen") &&
          !answers.integrations?.includes("stripe")
        ) {
          const result = await inquirer.prompt([
            {
              type: "list",
              name: "paymentProvider",
              message:
                "Commercetools requires a payment provider, but none were selected. Which payment provider do you want to use?",
              choices: [
                { name: "Adyen", value: "adyen" },
                { name: "Stripe Payments", value: "stripe" },
              ],
            },
          ]);

          answers.integrations.push(result.paymentProvider);
        }

        // When Sendgrid has not been selected
        if (!answers.integrations?.includes("sendgrid")) {
          const result = await inquirer.prompt([
            {
              type: "confirm",
              name: "email",
              default: true,
              message:
                "Would you like to enable Sendgrid for transactional emails?",
            },
          ]);

          if (result.email) {
            answers.integrations.push("sendgrid");
          }
        }
      }

      // Always include Headless UI if we're using Remix
      answers.integrations.push("headlessui");
    }
    /**
     * END REMIX PROJECT SETUP LOGIC
     */

    /**
     * NEXT.JS PROJECT SETUP LOGIC
     */
    if (techStack === "Next.js") {
      if (answers.nextProjectType === "Marketing Site with Contentful") {
        answers.integrations = ["contentful"];
      } else if (answers.nextProjectType === "Marketing Site with Sanity") {
        answers.integrations = ["sanity"];
      } else if (answers.nextProjectType === "Marketing Site with Kontent.ai") {
        answers.integrations = ["kontent.ai"];
      } else if (answers.nextProjectType === "E-Commerce Site with Shopify") {
        answers.integrations = ["shopify"];
      } else if (
        answers.nextProjectType === "E-Commerce Site with Shopify + Contentful"
      ) {
        answers.integrations = ["contentful", "shopify"];
      } else if (
        answers.nextProjectType ===
        "E-Commerce Site with Commercetools + Stripe"
      ) {
        answers.integrations = ["commercetools", "stripe"];
      } else if (
        answers.nextProjectType === "E-Commerce Site with Shopify + Sanity"
      ) {
        answers.integrations = ["sanity", "shopify"];
      }

      // Always include Stripe if we're using Commercetools (for now)
      if (answers.integrations?.includes("commercetools")) {
        answers.integrations.push("stripe");
      }

      // Add styling integrations if they were selected
      if (answers.nextStyling?.length) {
        answers.integrations.push(...answers.nextStyling);
      }
    }
    /**
     * END NEXT.JS PROJECT SETUP LOGIC
     */
  } else {
    /**
     * This is running in CI,
     * so get the answers to our questions from environment variables instead,
     * or use defaults
     */
    // Set deployment
    if (process.env.DEPLOYMENT) {
      answers.deployment = parseDeploymentTarget(process.env.DEPLOYMENT);
    } else {
      answers.deployment = "AWS";
    }
    // Set integrations
    if (process.env.INTEGRATIONS) {
      answers.integrations = parseCategories(
        process.env.INTEGRATIONS?.split(", ")
      );
      // Always include Storybook in CI
      answers.integrations.push("storybook");
      // Always include Tailwind in CI
      answers.integrations.push("tailwind");
    }
    /**
     * Always include headless UI in CI
     * Because we're always choosing Remix
     * and it's required for Remix
     */
    answers.integrations.push("headlessui");
  }

  /**
   * REMOVAL LOGIC SETUP
   * We need to remove some things based on the answers to our questions
   */

  // handle each removal answer
  let categoriesToRemove: Category[] = ["base"]; // always remove "base" no matter what, since it's general cleanup

  // Integrations
  featureCategoryNames.forEach((category) => {
    if (!answers.integrations?.includes(category)) {
      categoriesToRemove.push(category);
    }
  });

  // Always use the DB integration if a user selects Strapi -- it's necessary
  if (
    answers.integrations?.includes("strapi") &&
    !answers.integrations?.includes("db")
  ) {
    answers.integrations.push("db");
  }

  if (!answers.integrations?.includes("shopify")) {
    if (!answers.integrations?.includes("sanity")) {
      categoriesToRemove.push("shopify");
    }
  }

  // If we're not using tailwind, we can't use storybook
  if (!answers.integrations?.includes("tailwind")) {
    categoriesToRemove.push("tailwind");
    categoriesToRemove.push("storybook");
  }

  // Deployment Targets
  if (answers.deployment === "AWS") {
    categoriesToRemove.push("fly");
    categoriesToRemove.push("vercel");
  } else if (answers.deployment === "Fly.io") {
    categoriesToRemove.push("aws");
    categoriesToRemove.push("vercel");
  } else if (answers.deployment === "Vercel") {
    categoriesToRemove.push("aws");
    categoriesToRemove.push("fly");
  } else if (answers.deployment === "I'll configure this myself") {
    categoriesToRemove.push("aws");
    categoriesToRemove.push("fly");
    categoriesToRemove.push("vercel");
  }
  // Environments
  if (!answers.staging) {
    categoriesToRemove.push("staging");
  }
  if (!answers.production) {
    categoriesToRemove.push("production");
  }

  // Remove any duplicates from `categoriesToRemove`
  categoriesToRemove = categoriesToRemove.filter(
    (category, index) => categoriesToRemove.indexOf(category) === index
  );

  // execute removal
  await runRemove({
    rootDirectory,
    categoriesToRemove,
    leaveComments: false,
  });

  console.log(`\n🗑  Removed unused code:\n`);
  categoriesToRemove.forEach((category) => {
    console.log(`🧹 ${category}`);
  });
  console.log("\n");

  // Install dependencies
  if (!process.env.NO_NPM_INSTALL || process.env.NO_NPM_INSTALL !== "true") {
    console.log("🌎  Installing global dependencies...\n");
    execSync("npm install --quiet", { cwd: rootDirectory });
  }

  if (answers.deployment === "AWS") {
    // install CDK dependencies, since it's in its own directory
    console.log("📦  Installing CDK dependencies...\n");
    execSync("npm install --prefix ./cdk --quiet", { cwd: rootDirectory });
  }

  if (answers.integrations?.includes("strapi")) {
    // Set up strapi
    await fs.copyFile(
      path.join(`${rootDirectory}/strapi`, ".env.example"),
      path.join(`${rootDirectory}/strapi`, ".env")
    );
    // install strapi dependencies, since it's in its own directory
    console.log("📦  Installing Strapi dependencies...\n");
    execSync("npm install --prefix ./strapi --quiet", { cwd: rootDirectory });
  }

  if (
    techStack === "Remix" &&
    answers.integrations?.includes("algolia") &&
    answers.integrations?.includes("shopify")
  ) {
    try {
      // remove the placeholder non-algolia shopify index file, because we'll be using algolia instead
      await fs.unlink(
        path.join(`${rootDirectory}`, "app/routes/shopify", "_index.ts")
      );
    } catch (_err) {
      // nothing
    }
  }

  if (answers.integrations?.includes("contentful")) {
    /**
     * Install contentful utility dependencies
     * since it's in its own directory.
     * This is needed for both Remix & Next.js
     */
    console.log("📦  Installing Contentful dependencies...\n");
    if (techStack === "Remix") {
      execSync("npm install --prefix ./contentful", { cwd: rootDirectory });
    }

    if (techStack === "Next.js") {
      execSync("npm install --prefix ./contentful/lib", { cwd: rootDirectory });
    }
  }

  if (answers.integrations?.includes("kontent.ai")) {
    // install kontent.ai utility dependencies, since it's in its own directory
    console.log("📦  Installing Kontent.ai dependencies...\n");
    if (techStack === "Remix") {
      execSync("npm install --prefix ./kontent.ai --quiet", {
        stdio: "inherit",
        cwd: rootDirectory,
      });
    }

    if (techStack === "Next.js") {
      execSync("npm install --prefix ./kontent.ai/lib --quiet", {
        stdio: "inherit",
        cwd: rootDirectory,
      });
    }
  }

  if (answers.integrations?.includes("db")) {
    // Check on postgres and notify the user accordingly
    const pgRunning = spawnSync("nc", ["-z", "localhost", "5432"]).status === 0;
    if (pgRunning) {
      execSync(". ./.envrc && npm run setup", {
        stdio: "inherit",
        cwd: rootDirectory,
      });
    }
    // replace the tokens in this file, it gets nuked if no database is selected
    await Promise.all(
      ["scripts/tunnel-db.sh"]
        .map((f) => path.join(rootDirectory, f))
        .map((f) => replaceInFile(f, path.basename(rootDirectory)))
    );
  }

  if (answers.deployment === "AWS") {
    // for future intricacies
  }

  return answers;
}

export async function initSitecore(rootDirectory: string) {
  console.log("📦  Initializing Sitecore...\n");

  console.log("🚚  Moving files...");
  execSync("npm install --silent", {
    stdio: "inherit",
    cwd: rootDirectory,
  });

  console.log("done.\n\n");

  console.log("🚀  Get started by running\n");
  console.log(`'cd ${path.basename(rootDirectory)}' && npm run start`);
}
