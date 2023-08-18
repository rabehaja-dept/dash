import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { i18n, fileLoadPath } from "./i18n.server";
import i18nConfig from "./i18n-config";
import { getEnv } from "./config";
import { routes as otherRoutes } from "./other-routes.server";

const GLOBAL_CACHE_SECONDS = getEnv("GLOBAL_CACHE_SECONDS", { default: 0 });

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  for (const handler of otherRoutes) {
    const otherRouteResponse = await handler(request, remixContext);
    if (otherRouteResponse) return otherRouteResponse;
  }
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const i18nInstance = createInstance();

  const lng = await i18n.getLocale(request);
  const ns = i18n.getRouteNamespaces(remixContext);

  await i18nInstance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18nConfig,
      lng,
      ns,
      backend: {
        loadPath: fileLoadPath,
      },
    });
  const markup = renderToString(
    <I18nextProvider i18n={i18nInstance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  responseHeaders.set("Content-Type", "text/html");

  if (!responseHeaders.get("Cache-Control")) {
    /**
     * This sets the global cache headers for all routes, if it's not set already.
     * You can set a different global cache time by editing the `GLOBAL_CACHE_SECONDS` environment variable.
     * Or alternatively, you can set per-route cache time by exporting a `headers` property on a nested route.
     * It'll override this.
     * For more info, see: https://remix.run/docs/en/v1/api/conventions#headers
     */

    if ((GLOBAL_CACHE_SECONDS as number) > 0) {
      responseHeaders.set(
        "Cache-Control",
        `public, max-age=${GLOBAL_CACHE_SECONDS}`
      );
    } else {
      responseHeaders.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate"
      );
    }
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
