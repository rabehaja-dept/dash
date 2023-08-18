// Remix
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useEffect } from "react";
// Styles
import tailwindStylesheetUrl from "~/tailwind/tailwind.css"; // @dash-remove tailwind
import fontsStyleSheetUrl from "../styles/fonts.css";
import adyenStyleSheetUrl from "@adyen/adyen-web/dist/adyen.css"; // @dash-remove adyen
// Providers & Hooks
import { getUser } from "./session.server"; // @dash-remove db
import { i18n } from "~/i18n.server";
import { useTranslation } from "react-i18next";
import { getEnv } from "~/config";
import { getAlternateHref } from "~/utils";
import { supportedLanguages } from "./i18n-config";
import { ShopifyProvider } from "~/shopify/components/ShopifyProvider"; // @dash-remove shopify
import { OptimizelyProvider } from "~/optimizely/components"; // @dash-remove optimizely
// Other
import type { Handle } from "~/@types";
import { getOptimizelyUserId } from "~/optimizely/user.server"; // @dash-remove optimizely
import { getDatafile } from "~/optimizely/datafile.server"; // @dash-remove optimizely
import { pathedRoutes } from "./other-routes.server";
import { AnimatePresence } from "framer-motion";
// Components
import { Nav, Footer, Error } from "~/components/layout";
import { Button } from "~/components/interactive";
import { Transition } from "./Transition";
import { MiniCart } from "~/shopify/components/MiniCart"; // @dash-remove shopify
import { MiniCartActivator } from "~/shopify/components/MiniCartActivator"; // @dash-remove shopify
import { GoogleTagManager } from "~/components/plugins"; // @dash-remove gtags

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl }, // @dash-remove tailwind
    { rel: "stylesheet", href: fontsStyleSheetUrl },
    { rel: "shortcut icon", href: "/favicon.svg" },
    { rel: "stylesheet", href: adyenStyleSheetUrl }, // @dash-remove adyen
  ];
};

export const meta: MetaFunction = () => {
  /**
   * This is the root meta tag for the project, and is applied to every page.
   * You'll probably want to customize this for your project.
   * See: https://ogp.me/
   */
  const description =
    "DEPT DASH™ is an opinionated framework for building web applications.";

  return {
    charset: "utf-8",
    title: "DEPT DASH™",
    keywords: "DEPT,blog,store,agency",
    "twitter:creator": "@deptagency",
    "twitter:site": "@deptagency",
    "twitter:title": "DEPT DASH™",
    "twitter:description": description,
    viewport: "width=device-width,initial-scale=1",
  };
};

type LoaderData = {
  GLOBALS: string;
  GA_TRACKING_ID: string | null; // @dash-remove gtags
  PUBLICLY_AVAILABLE_ORIGIN: string;
  locale: string;
  user: Awaited<ReturnType<typeof getUser>>; // @dash-remove db
  // @dash-remove-start optimizely
  optimizely: {
    id: string;
    datafile: string | object;
    optimizelySdkKey: string;
  };
  // @dash-remove-end
};

export const loader: LoaderFunction = async ({ request }) => {
  // because this is called for every route, we'll do an early return for anything
  // that has a other route setup. The response will be handled there.
  if (pathedRoutes[new URL(request.url).pathname]) {
    return new Response();
  }

  // @dash-remove-start optimizely
  /**
   * We need to get the user's generated id and cookie for Optimizely.
   * We'll also get the datafile here, so we can pass it to the Optimizely client.
   */
  const optimizelySdkKey = getEnv("OPTIMIZELY_SDK_KEY");
  const datafile = await getDatafile();
  const { id, cookie } = await getOptimizelyUserId(request);
  // @dash-remove-end

  const locale = await i18n.getLocale(request);

  return json<LoaderData>(
    {
      user: await getUser(request), // @dash-remove db
      GA_TRACKING_ID: getEnv("GA_TRACKING_ID", { default: null }), // @dash-remove gtags
      PUBLICLY_AVAILABLE_ORIGIN: getEnv("PUBLICLY_AVAILABLE_ORIGIN"),
      locale,
      GLOBALS: JSON.stringify({
        // @dash-remove-next-line sentry
        SENTRY_DSN: getEnv("SENTRY_DSN", { default: null }),
      }),
      // @dash-remove-start optimizely
      optimizely: {
        id,
        datafile,
        optimizelySdkKey,
      },
      // @dash-remove-end
    },
    // @dash-remove-start optimizely
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
    // @dash-remove-end
  );
};

// @dash-remove-start gtags
function useGoogleAnalytics() {
  const { GA_TRACKING_ID } = useLoaderData<LoaderData>();
  if (!GA_TRACKING_ID?.length) return null;
  return GA_TRACKING_ID;
}
// @dash-remove-end

/**
 * Construct <link rel="alternate"> tags to inform search engines and browsers
 * about locale variants of the page, as described at https://developers.google.com/search/docs/advanced/crawling/localized-versions#html
 */
function useAlternateLinks() {
  const { locale, PUBLICLY_AVAILABLE_ORIGIN } = useLoaderData<LoaderData>();
  const { pathname, search } = useLocation();

  if (!PUBLICLY_AVAILABLE_ORIGIN) return [];
  const links = supportedLanguages
    .filter((lang) => lang.code !== locale) // skip current locale
    .map((lang) => (
      <link
        key={lang.code}
        rel="alternate"
        hrefLang={lang.code}
        href={getAlternateHref(PUBLICLY_AVAILABLE_ORIGIN, lang.code)}
      />
    ));
  links.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`${PUBLICLY_AVAILABLE_ORIGIN}${pathname}${search}`}
    />
  );
  return links;
}

export const handle: Handle = {
  // In the handle export, we could add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: [],
};

export default function App() {
  // These variables are defined separately so we can remove them more easily
  const { locale, GLOBALS } = useLoaderData<LoaderData>();
  const { optimizely } = useLoaderData<LoaderData>(); // @dash-remove optimizely
  const { datafile, id, optimizelySdkKey } = optimizely; // @dash-remove optimizely
  const { i18n } = useTranslation();
  const location = useLocation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  // There's a bug in remix-i18next that doesn't allow using their `useChangeLanguage()` hook, so we have to do it manually
  // Reference: https://github.com/sergiodxa/remix-i18next/issues/107
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const alternateLinks = useAlternateLinks();
  const gaTrackingId = useGoogleAnalytics(); // @dash-remove gtags

  // if you want to hide the root navigation bar, set this to false
  let showRootNavBar = true;

  // @dash-remove-start contentful
  /**
   * For Contentful routes, we're using a dynamic Contentful-based navigation bar.
   * So we don't want to render the default navigation bar.
   */
  if (location?.pathname.startsWith("/contentful")) {
    showRootNavBar = false;
  }
  // @dash-remove-end

  // @dash-remove-start commercetools
  /**
   * For Commercetools routes, we're using a separately rendered navigation bar.
   * So we don't want to render the default navigation bar.
   */
  if (location?.pathname.startsWith("/commercetools")) {
    showRootNavBar = false;
  }
  // @dash-remove-end

  return (
    <html lang={locale} className="h-full" dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        {alternateLinks}
        {/* @dash-remove-next-line gtags */}
        {gaTrackingId && <GoogleTagManager gaTrackingId={gaTrackingId} />}
      </head>

      <body className="h-full">
        {/* @dash-remove-start optimizely */}
        <OptimizelyProvider
          id={id}
          datafile={datafile}
          optimizelySdkKey={optimizelySdkKey}
        >
          {/* @dash-remove-end */}
          {/* @dash-remove-next-line shopify */}
          <ShopifyProvider>
            {showRootNavBar && (
              <Nav
                sticky={true}
                slot={<MiniCartActivator className="ml-4" />} // @dash-remove shopify
                children={<MiniCart />} // @dash-remove shopify
                banner={
                  <div className="text-center text-xs">
                    Here is a ticket banner for important messages
                  </div>
                }
              />
            )}
            <AnimatePresence mode="wait" initial={false}>
              <Transition>
                <Outlet />
              </Transition>
            </AnimatePresence>
            {/* @dash-remove-next-line shopify */}
          </ShopifyProvider>
          {/* @dash-remove-next-line optimizely */}
        </OptimizelyProvider>

        <Footer />

        <ScrollRestoration />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `window.GLOBALS=${GLOBALS}` }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen flex-col items-center justify-center">
          <Error
            title="An error ocurred"
            errorText={error.message}
            code={error.cause}
          ></Error>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.error(caught);
  return (
    <html lang="en">
      <head>
        <title>Unexpected error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1>{caught.status}</h1>
          <p className="flex text-sm text-gray-500">{caught.statusText}</p>
          {process.env.NODE_ENV !== "production" && (
            <pre className="flex text-sm text-gray-500">
              {caught.data && <code>{caught.data}</code>}
            </pre>
          )}
          <br />
          <Button to="/" aria-label="Go home">
            Go home
          </Button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
