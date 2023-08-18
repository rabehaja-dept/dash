import { deliveryClient as kontent } from "./kontent.server";
import { Article } from "~/@types/generated/kontent.ai/content-types";

export async function getAllArticles(): Promise<Article[]> {
  const response = await kontent.items<Article>().type("article").toPromise();
  return response.data.items;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const response = await kontent
    .items<Article>()
    .type("article")
    .equalsFilter(`elements.url`, slug)
    .toPromise();

  return response.data.items[0];
}
