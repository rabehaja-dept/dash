import {
  getArticles,
  getArticleBySlug,
} from "../../app/contentstack/index.server";

test("getArticles works", async () => {
  const articles = await getArticles();
  expect(articles.length).toBe(2);
});

test("getArticleBySlug works", async () => {
  const slug = "the-future-of-artificial-intelligence-in-healthcare";
  const article = await getArticleBySlug(slug);
  expect(article.url).toBe(`/${slug}`);
});
