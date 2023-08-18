import { Article } from "~/@types/generated/contentstack/generated";
import { contentstack } from "./contentstack.server";

// get all articles from contentstack
export async function getArticles(): Promise<Article[]> {
  const query = contentstack.ContentType("article").Query();
  const articles: Article[] = await query
    .toJSON()
    .find()
    .then(
      (result) => result[0],
      (error) => {
        throw new Error(error);
      }
    );
  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const query = contentstack.ContentType("article").Query();
  const article: Article = await query
    .where("url", `/${slug}`)
    .toJSON()
    .find()
    .then(
      (result) => result[0][0],
      (error) => {
        throw new Error(error);
      }
    );
  return article;
}
