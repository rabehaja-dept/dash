import {
  getAllArticles,
  getArticleBySlug,
} from "../../app/kontent.ai/index.server";

test("getAllArticles works", async () => {
  const articles = await getAllArticles();
  expect(articles.length).toBe(3);
});

test("getArticleBySlug works", async () => {
  const slug = "welcome-to-kontent-ai";
  const article = await getArticleBySlug(slug);
  expect(article.elements.url.value).toBe(slug);
});
