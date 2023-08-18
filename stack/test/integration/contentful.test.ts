import {
  getAllPosts,
  getEntryById,
  getNavContainer,
  getPageBySlug,
  getPostBySlug,
  getRecentPosts,
} from "../../app/contentful/index.server";

test("getEntryById works", async () => {
  const entryId = "1H7y8kFqaE7oWFhaI443ct";
  const entry = await getEntryById(entryId);
  expect(entry.sys.id).toBe(entryId);
});

test("getPageBySlug works", async () => {
  const slug = "about-us";
  const entry = await getPageBySlug(slug, {
    locale: "*",
    preview: false,
  });
  expect(entry.fields.slug["en-US"]).toBe(slug);
});

test("getRecentPosts works", async () => {
  const entries = await getRecentPosts("*");
  expect(entries.length).toBe(3);
});

test("getAllPosts works", async () => {
  const entries = await getAllPosts("*");
  expect(entries.length).toBe(3);
});

test("getPostBySlug works", async () => {
  const slug = "hello-world";
  const entry = await getPostBySlug(slug, {
    locale: "*",
    preview: false,
  });
  expect(entry.fields.slug["en-US"]).toBe(slug);
});

test("getNavContainer works", async () => {
  const entry = await getNavContainer("primary", {
    locale: "*",
    preview: false,
  });
  expect(entry.fields.id["en-US"]).toBe("primary");
});
