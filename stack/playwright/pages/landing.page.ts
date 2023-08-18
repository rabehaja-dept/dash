/**
 * Example of a "Page Object Model"
 * More here: https://playwright.dev/docs/test-pom
 * */

import { Locator, Page } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly header: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("#nav-header");
    this.mainContent = page.locator("main");
  }

  async goto() {
    await this.page.goto("/");
  }

  async getAlternateLinks() {
    return this.page.locator("link[rel='alternate']");
  }
}
