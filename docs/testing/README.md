## Testing

Like all good web applications, you can avoid a lot of headache by spending some time configuring and automating tests. We've configured tests using:

- [Vitest](https://vitest.dev/guide/)
  - We've also implemented [`@testing-library/jest-dom`](https://testing-library.com/jest-dom) for DOM-specific assertions.
- [Playwright](https://playwright.dev/docs/intro)

### Vitest

Vitest is a Vite-native unit test framework. It's fast! You'll also want to add more components and unit tests. Components mostly live in the `app/components/` directory, so it probably makes sense to keep unit test specs there too. We've placed our test files in the same location as our components, just with a `*.test.ts` filename.

#### Extending & adding tests

As mentioned above, writing a new unit test is as simple as including a new file ending in `.spec.ts(x)` or `.test.ts(x)` anywhere in the `app/` directory.

You may notice that most of our specs include the following snippet of code:

```typescript
import { installGlobals } from "@remix-run/node";

installGlobals();
```

Since Remix relies on browser API's that are not natively available in Node.js, you may find that your unit tests fail without these globals. Adding this snipped installs globals such as "fetch", "Response", "Request" and "Headers".

Besides that one Remix caveat, writing unit tests is no different than with other frameworks.

#### Updating the Vitest configuration

You may also want to re-configure Vitest. To do so, edit the `vitest.config.ts` file. Documentation for Vitest's configuration can be found in the [Vitest docs](https://vitest.dev/guide/).

### Playwright

We use [Playwright](https://playwright.dev/) for our End-to-End tests in this project. Playwright allows cross-browser, parallel tests and we find it's easy to set up. You'll find existing tests in the `playwright` directory. As you make changes, add to an existing file or create a new file in the `playwright/e2e` directory to test your changes.

To run these tests in development, run `npm run test:e2e` which will **automatically start the dev server for the app** in addition to launching the Playwright client.

Be sure to:

- Make sure your database is running before launching.
- Make sure you don't have the development server running separately. You may need to stop your development server if you're running it via `npm run dev` or update the playwright configuration (`playwright.config.ts`) if you find this to be annoying.

#### Extending & adding tests

Playwright will automatically run every `.spec.*` or `.test.*` file in the `playwright/e2e` directory. Feel free to add subdirectories and more tests there.

We recommend using the "Page Object Model" described by [Playwright's docs](https://playwright.dev/docs/test-pom). This involves building a model of the elements and actions on a page, then using that to simplify your spec file.

For example, if you were to add a new page, `our-team`, you might add a model like this:

```typescript
// our-team.page.ts
import { expect, Locator, Page } from "@playwright/test";

export class OurTeamPage {
  readonly page: Page;
  readonly header: Locator;
  readonly contactUsLink: Locator;
  readonly headshotCarousel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("h1", {
      hasText: "Our Team",
    });
    this.contactUsLink = page.locator("a", { hasText: "Get started" });
    this.headshotCarousel = page.locator("div.headshots");
  }

  async goto() {
    await this.page.goto("https://mydomain.com/our-team");
  }

  async contactUs() {
    await this.contactUsLink.first().click();
  }
}
```

Then, write some assertions in a new file, `playwright/e2e/our-team.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";
import { OurTeamPage } from "../pages/our-team.page";

let ourTeamPage: OurTeamPage;

test.beforeEach(async ({ page }) => {
  ourTeamPage = new OurTeamPage(page);
  await ourTeamPage.goto();
});

test.describe("Landing Page", () => {
  test("should render some basic elements", async () => {
    // These are very simplistic, you'll probably want to test more user journeys throughout the page.
    await expect(landingPage.header).toBeVisible();
    await expect(landingPage.mainContent).toBeVisible();
  });
});
```

#### Updating the Playwright configuration

You may also want to re-configure the test runner to use different browsers, or increase the timeout, or create setup / teardown functionality.

You can change these settings in the `playwright.config.ts` file. It's commented with explanations, but you might also want to check out Playwright's [configuration documentation](https://playwright.dev/docs/test-configuration).
