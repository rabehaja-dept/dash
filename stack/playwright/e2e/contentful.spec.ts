/**
 * NOTE: This file is purged if you run the `remove-contentful` script.
 * If you change the name or location of the file,
 * you'll need to update the `remove-contentful` script or remove this manually.
 */
import { test, expect } from "@playwright/test";
import { ContentfulPage } from "../pages/contentful.page";

let contentfulPage: ContentfulPage;

test.beforeEach(async ({ page }) => {
  contentfulPage = new ContentfulPage(page);
  await contentfulPage.goto();
});

test.describe("Contentful Page", () => {
  test("should render some basic elements", async () => {
    await expect(contentfulPage.header).toBeVisible();
    await expect(contentfulPage.mainContent).toBeVisible();
  });
});

test.describe("Contentful Content", () => {
  test("should render contentful content", async () => {
    await expect(contentfulPage.contentfulTitle).toContainText(
      "How do I edit this content?"
    );
  });
});
