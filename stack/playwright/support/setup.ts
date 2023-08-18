// /**
//  * Global setup for all tests.
//  * Creates a test user, logs in, and navigates to the home page.
//  */
// import { getEnv } from "~/utils";
// import { chromium } from "@playwright/test";
/**
 * @TODO: Wire these up to the playwright e2e test runners, and account for
 * when a user removes the DB from the application
 */

// import { installGlobals } from "@remix-run/node/globals";

// import { createUser } from "~/models/user.server";

// installGlobals();

// const userName = getEnv("TEST_USER_EMAIL", { default: "testuser@example.com" });
// const password = getEnv("TEST_USER_PASSWORD", {
//   default: "myverystrongandsecurepassword",
// });

// const generateTestUser = async () => {
//   const user = await createUser(userName, password);
//   console.log(`Created test user: ${user.email}`);
// };

// async function login() {
//   const baseUrl = process.env.E2E_BASE_URL || "http://localhost:3000";

//   const browser = await chromium.launch();
//   const page = await browser.newPage();

//   await page.goto(`${baseUrl}/login`);
//   await page.fill("#email", userName);
//   await page.fill("#password", password);
//   await page.click("#remember");
//   await page.click('button[type="submit"]');

//   await page
//     .context()
//     .storageState({ path: "playwright/support/test-browser-state.json" });

//   await browser.close();
// }

// const prepareTest = async () => {
//   await generateTestUser();
//   await login();
// };

// export default prepareTest;

export {};
