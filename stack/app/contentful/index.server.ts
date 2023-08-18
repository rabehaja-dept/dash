import * as contentful from "contentful";
import invariant from "tiny-invariant";
import type {
  INavContainer,
  IPage,
  IPost,
  SpecificLocale,
} from "~/@types/generated/contentful";
import { getEnv } from "~/config";
import { CONTENTFUL_ACCESS_TOKEN } from "~/config";

const CONTENTFUL_ENV_ID = getEnv("CONTENTFUL_ENV_ID", { default: "master" });
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = getEnv(
  "CONTENTFUL_PREVIEW_ACCESS_TOKEN",
  { default: null }
);

type ContentfulClients = "regular" | "preview";

let clients: { [k in ContentfulClients]?: contentful.ContentfulClientApi } = {};
export function getClient(
  which: ContentfulClients = "regular"
): contentful.ContentfulClientApi {
  if (clients[which]) {
    return clients[which]!;
  }
  if (which === "preview" && !CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    throw new Error(
      "preview content requested, but no preview access token was provided"
    );
  }
  clients[which] = contentful.createClient({
    space: getEnv("CONTENTFUL_SPACE_ID"),
    accessToken:
      which === "preview"
        ? CONTENTFUL_PREVIEW_ACCESS_TOKEN!
        : CONTENTFUL_ACCESS_TOKEN,
    host: which === "preview" ? "preview.contentful.com" : "cdn.contentful.com",
    environment: CONTENTFUL_ENV_ID,
  });
  return clients[which]!;
}

export async function getEntryById(
  id: string
): Promise<contentful.Entry<unknown>> {
  const client = getClient();
  const entry = await client.getEntry(id, {
    locale: "*",
    include: 10,
  });
  return entry;
}

export async function getPageBySlug(
  slug: string,
  options: { locale: "*"; preview: boolean }
): Promise<IPage>;
export async function getPageBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPage>>;
export async function getPageBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPage> | IPage> {
  const client = getClient(options.preview ? "preview" : "regular");
  const entries = await client.getEntries({
    content_type: "page",
    limit: 1,
    "fields.slug[in]": slug,
    include: 10, // Include up to 10 levels deep of embedded entries, because we want the entire page in one call
    locale: options.locale,
  });
  invariant(
    entries.items.length > 0,
    `expected a page entry with slug of '${slug}'`
  );
  const page = entries.items[0] as IPage | SpecificLocale<IPage>;
  return page;
}
export async function getRecentPosts(
  locale: "*",
  tag?: string
): Promise<IPost[]>;
export async function getRecentPosts(
  locale: string,
  tag?: string
): Promise<SpecificLocale<IPost>[]>;
export async function getRecentPosts(
  locale: string,
  tag?: string
): Promise<IPost[] | SpecificLocale<IPost>[]> {
  const client = getClient();
  const tagQuery = tag ? { "metadata.tags.sys.id[in]": tag } : {};
  const entries = await client.getEntries({
    content_type: "post",
    limit: 10,
    order: "sys.createdAt",
    locale,
    ...tagQuery,
  });
  const posts = entries.items as SpecificLocale<IPost>[];
  return posts;
}

export async function getAllPosts(locale: "*", tag?: string): Promise<IPost[]>;
export async function getAllPosts(
  locale: string,
  tag?: string
): Promise<SpecificLocale<IPost>[]>;
export async function getAllPosts(
  locale: string,
  tag?: string
): Promise<IPost[] | SpecificLocale<IPost>[]> {
  const client = getClient();
  const tagQuery = tag ? { "metadata.tags.sys.id[in]": tag } : {};
  const entries = await client.getEntries({
    content_type: "post",
    order: "sys.createdAt",
    locale,
    ...tagQuery,
  });
  const posts = entries.items as SpecificLocale<IPost>[];
  return posts;
}

export async function getPostBySlug(
  slug: string,
  options: { locale: "*"; preview: boolean }
): Promise<IPost>;
export async function getPostBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPost>>;
export async function getPostBySlug(
  slug: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<IPost> | IPost> {
  const client = getClient(options.preview ? "preview" : "regular");
  const entries = await client.getEntries({
    content_type: "post",
    limit: 1,
    "fields.slug[in]": slug,
    locale: options.locale,
  });
  invariant(
    entries.items.length > 0,
    `expected a post entry with slug of '${slug}'`
  );
  const post = entries.items[0] as SpecificLocale<IPost>;
  return post;
}

export async function getNavContainer(
  id: string,
  options: { locale: "*"; preview: boolean }
): Promise<INavContainer>;
export async function getNavContainer(
  id: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<INavContainer>>;
export async function getNavContainer(
  id: string,
  options: { locale: string; preview: boolean }
): Promise<SpecificLocale<INavContainer> | INavContainer | undefined> {
  try {
    const client = getClient(options.preview ? "preview" : "regular");
    const entries = await client.getEntries({
      content_type: "navContainer",
      limit: 1,
      "fields.id[in]": id,
      include: 10, // Include up to 10 levels deep of embedded entries, because we want the entire nav tree
      locale: options.locale,
    });
    invariant(
      entries.items.length > 0,
      `expected a navContainer entry with id of '${id}'`
    );
    const navContainer = entries.items[0] as SpecificLocale<INavContainer>;
    return navContainer;
  } catch (e: any) {
    let obj: ErrorData = JSON.parse(e.message);
    if (obj.status === 404) {
      if (process.env.NODE_ENV !== "production") {
        if (obj.details !== null && obj.details.type === "Space") {
          throw new Error(
            `${obj.message} '${obj.details.id}' space id is not valid for the given access key. Please check that your space id (CONTENTFUL_SPACE_ID) and your access key (CONTENTFUL_ACCESS_TOKEN) are correct.`
          );
        }
        if (obj.details !== null && obj.details.type === "Environment") {
          throw new Error(
            `${obj.message} CONTENTFUL_ENV_ID = '${obj.details.id}'is not valid for the given access token (CONTENTFUL_ACCESS_TOKEN). If you created a new contentful environment, you need to manually update your access token in contentful to include it.`
          );
        }
      } else {
        throw new Error(`Error getting data from Contentful`);
      }
    }
  }
}
interface ErrorData {
  status: number;
  statusText: string;
  message: string;
  details: {
    id: string;
    type: string;
  };
}
