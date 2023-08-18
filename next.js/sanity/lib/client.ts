import { createClient } from "next-sanity";
import { PagePayload } from "~/sanity/types";
import { pagesBySlugQuery, pagePaths, allPages } from "~/sanity/lib/queries";
import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = (token?: string) =>
  createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
    token,
  });

export async function getPageBySlug({
  slug,
  token,
}: {
  slug: string;
  token?: string;
}): Promise<PagePayload | undefined> {
  return await client(token)?.fetch(pagesBySlugQuery, { slug });
}

export async function getPagePaths(): Promise<string[]> {
  return await client()?.fetch(pagePaths);
}

export async function getAllPages() {
  return await client().fetch(allPages);
}
