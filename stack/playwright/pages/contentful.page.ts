/**
 * Example of a "Page Object Model"
 * More here: https://playwright.dev/docs/test-pom
 * */

import { Locator, Page } from "@playwright/test";

export class ContentfulPage {
  readonly page: Page;
  readonly header: Locator;
  readonly mainContent: Locator;
  readonly contentfulTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("#nav-header");
    this.mainContent = page.locator("section").first();
    this.contentfulTitle = page.locator("h2", {
      hasText: "How do I edit this content?",
    });
  }

  async goto() {
    await this.page.goto("/contentful");
  }
}
