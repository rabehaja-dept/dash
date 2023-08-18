import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import * as routeUtils from "~/contentful/route-utils";
import {
  ContentfulPageLoaderData,
  getMetaInfo,
} from "~/contentful/route-utils";
import { doesRouteExistOnSiteMap } from "~/other-routes.server";
import { i18n } from "../../i18n.server";
import { getPageBySlug } from "~/contentful/index.server";
import { json as superjson } from "superjson-remix";

export const headers = routeUtils.headers;

export const meta = routeUtils.meta;

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<ContentfulPageLoaderData | Response | null> => {
  const url = new URL(request.url);
  if (doesRouteExistOnSiteMap(url.pathname)) {
    // because this is called for every route, we'll do an early return for anything that has a other route setup. The response will be handled there.
    return new Response();
  }
  const invariantMessage =
    "expected slug to be passed as an argument or params.slug to be defined";
  const slugToQuery = params.slug;
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

export function ErrorBoundary({ error }: { error: any }) {
  console.error(error);
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-xl">An error occurred</p>
      {process.env.NODE_ENV !== "production" && (
        <pre className="text-sm text-gray-500">
          <code>{error.message}</code>
        </pre>
      )}
    </div>
  );
}
