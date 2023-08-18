import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";

let landingPage: LandingPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  await landingPage.goto();
});

test.describe("Landing Page", () => {
  test("should render some basic elements", async () => {
    await expect(landingPage.header).toBeVisible();
    await expect(landingPage.mainContent).toBeVisible();
  });

  test("alternate links should have a valid href", async () => {
    const arrayOfLocators = await landingPage.getAlternateLinks();
    const elementsCount = await arrayOfLocators.count();
    for (var index = 0; index < elementsCount; index++) {
      const href = await arrayOfLocators.nth(index).getAttribute("href");
      const hreflang = await arrayOfLocators
        .nth(index)
        .getAttribute("hreflang");
      const language = hreflang?.split("-")[0]; // en-US => en, es-MX => es, etc. We are localizing to the language, not the country code.
      const domain = await landingPage.page.evaluate(
        () => window.location.host
      );
      const scheme = await landingPage.page.evaluate(
        () => window.location.protocol
      ); // http or https
      if (hreflang !== "x-default") {
        // x-default is a special case
        const expectedHref = `${scheme}//${language}.${domain}`; // e.g. https://fr.example.com, https://es.example.com, etc.
        expect(href).toBe(expectedHref);
      }
    }
  });
});
