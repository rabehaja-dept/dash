import { getEnv } from "~/config";
import { ApiArticleArticle } from "~/@types/generated/strapi";
import { i18n } from "~/i18n.server";
import { defaultLanguageCode } from "~/i18n-config";
import fetch from "node-fetch";

/**
 * This file contains the api requests to the strapi server (which should
 * be running alongside the remix server)
 * If you add new content types or make changes to strapi, you'll also
 * want to add more routes and requests here to hydrate the data
 */

const STRAPI_URL = getEnv("STRAPI_URL", {
  default: `${getEnv("PUBLICLY_AVAILABLE_ORIGIN")}/strapi`,
});
const STRAPI_API_TOKEN = getEnv("STRAPI_API_TOKEN");

const headers = {
  Authorization: `bearer ${STRAPI_API_TOKEN}`,
};

const strapiDefaultLocale = "en-US";

export async function getArticles(
  request: Request
): Promise<ApiArticleArticle[]> {
  const locale = await i18n.getLocale(
    request,
    defaultLanguageCode.toLowerCase()
  );
  const res: any = await fetch(getUrl(locale), { headers }).then((res) =>
    res.json()
  );
  return res.data;
}

export async function getArticleBySlug(
  slug: string
): Promise<ApiArticleArticle> {
  const res: any = await fetch(
    `${STRAPI_URL}/api/articles/?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers,
    }
  ).then((res) => res.json());
  return res.data?.length ? res.data[0] : null;
}

function getUrl(locale: string) {
  const url = new URL(`${STRAPI_URL}/api/articles`);
  if (locale) {
    if (locale === strapiDefaultLocale) {
      url.searchParams.set("locale", "en");
    } else {
      url.searchParams.set("locale", locale);
    }
  }
  url.searchParams.set("populate", "*");
  return url;
}
