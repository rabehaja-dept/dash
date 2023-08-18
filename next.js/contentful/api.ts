import { Entry, createClient, ContentfulClientApi } from "contentful";
import invariant from "tiny-invariant";
import type {
  IPage,
  IPost,
  SpecificLocale,
} from "~/@types/generated/contentful";

const {
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_ENV_ID,
  CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
} = process.env;

type ContentfulClients = "regular" | "preview";

const clients: { [k in ContentfulClients]?: ContentfulClientApi<undefined> } =
  {};

export function getClient(which: ContentfulClients = "regular") {
  if (clients[which]) {
    return clients[which]!;
  }
  if (which === "preview" && !CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    throw new Error(
      "preview content requested, but no preview access token was provided"
    );
  }
  clients[which] = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken:
      which === "preview"
        ? CONTENTFUL_PREVIEW_ACCESS_TOKEN!
        : CONTENTFUL_ACCESS_TOKEN,
    host: which === "preview" ? "preview.contentful.com" : "cdn.contentful.com",
    environment: CONTENTFUL_ENV_ID,
  });
  return clients[which]!;
}

export async function getEntryById(id: string): Promise<Entry<any>> {
  const client = getClient();
  const entry = await client.getEntry(id, {
    include: 10,
  });
  return entry;
}

export async function getPageBySlug(
  slug: string,
  options: { locale: string | "*"; preview: boolean }
): Promise<IPage> {
  const { preview, locale } = options;
  const client = getClient(preview ? "preview" : "regular");

  let entries;

  if (locale === "*") {
    entries = await client.withAllLocales.getEntries({
      content_type: "page",
      limit: 1,
      "fields.slug[in]": slug,
      include: 10, // Include up to 10 levels deep of embedded entries, because we want the entire page in one call
    });
  } else {
    entries = await client.getEntries({
      content_type: "page",
      limit: 1,
      "fields.slug[in]": slug,
      include: 10, // Include up to 10 levels deep of embedded entries, because we want the entire page in one call
      locale,
    });
  }
  invariant(
    entries.items.length > 0,
    `expected a page entry with slug of '${slug}'`
  );
  const page = entries.items[0] as IPage;
  return page;
}

export async function getAllPages(
  locale: string | "*"
): Promise<IPage[] | SpecificLocale<IPage>[]> {
  const client = getClient();

  let entries;

  if (locale === "*") {
    entries = await client.withAllLocales.getEntries({
      content_type: "page",
    });
  } else {
    entries = await client.getEntries({
      content_type: "page",
      locale,
    });
  }

  const pages = entries.items as SpecificLocale<IPage>[];

  return pages;
}
export async function getAllPosts(
  locale: string | "*",
  tag?: string
): Promise<IPost[] | SpecificLocale<IPost>[]> {
  const client = getClient();
  const tagQuery = tag ? { "metadata.tags.sys.id[in]": tag } : {};

  let entries;
  if (locale === "*") {
    entries = await client.withAllLocales.getEntries({
      content_type: "post",
      ...tagQuery,
    });
  } else {
    entries = await client.getEntries({
      content_type: "post",
      locale,
      ...tagQuery,
    });
  }
  const posts = entries.items as SpecificLocale<IPost>[];
  return posts;
}

export async function getPostBySlug(
  slug: string,
  options: { locale: string | "*"; preview: boolean }
): Promise<SpecificLocale<IPost> | IPost> {
  const { preview, locale } = options;
  const client = getClient(preview ? "preview" : "regular");

  let entries;

  if (locale === "*") {
    entries = await client.withAllLocales.getEntries({
      content_type: "post",
      limit: 1,
      "fields.slug[in]": slug,
    });
  } else {
    entries = await client.getEntries({
      content_type: "post",
      limit: 1,
      "fields.slug[in]": slug,
      locale,
    });
  }
  invariant(
    entries.items.length > 0,
    `expected a post entry with slug of '${slug}'`
  );
  const post = entries.items[0] as SpecificLocale<IPost>;
  return post;
}

export async function getRecentPosts(
  locale: string | "*",
  tag?: string
): Promise<IPost[] | SpecificLocale<IPost>[]> {
  const client = getClient();
  const tagQuery = tag ? { "metadata.tags.sys.id[in]": tag } : {};

  let entries;

  if (locale === "*") {
    entries = await client.withAllLocales.getEntries({
      content_type: "post",
      limit: 10,
      ...tagQuery,
    });
  } else {
    entries = await client.getEntries({
      content_type: "post",
      limit: 10,
      locale,
      ...tagQuery,
    });
  }
  const posts = entries.items as SpecificLocale<IPost>[];
  return posts;
}
