import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getPageBySlug } from "~/contentful/index.server";
import * as routeUtils from "~/contentful/route-utils";
import { i18n } from "~/i18n.server";
import { doesRouteExistOnSiteMap } from "~/other-routes.server";
import { json as superjson } from "superjson-remix";
import { getMetaInfo } from "~/contentful/route-utils";

export const headers = routeUtils.headers;

export const meta = routeUtils.meta;

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<routeUtils.ContentfulPageLoaderData | Response | null> => {
  const url = new URL(request.url);
  if (doesRouteExistOnSiteMap(url.pathname)) {
    // because this is called for every route, we'll do an early return for anything that has a other route setup. The response will be handled there.
    return new Response();
  }
  const invariantMessage =
    "expected slug to be passed as an argument or params.slug to be defined";
  const slugToQuery = "home" || params.slug;
  invariant(slugToQuery, invariantMessage);
  const locale = await i18n.getLocale(request);
  const page = await getPageBySlug(slugToQuery, {
    locale,
    preview: url.searchParams.get("preview") === "1",
  });
  return superjson<routeUtils.ContentfulPageLoaderData>({
    page,
    meta: getMetaInfo({
      title: page.fields.title,
      description: page.fields.description,
      requestUrl: request.url,
      openGraphImageUrl: page.fields.openGraphImage?.fields.file.url,
    }),
  });
};

export default routeUtils.ContentfulPageComponent;
