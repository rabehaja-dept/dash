import { RemixBrowser, useLocation, useMatches } from "@remix-run/react"; // @dash-replace sentry: import { RemixBrowser } from "@remix-run/react";
import { useEffect } from "react";
import * as Sentry from "@sentry/remix"; // @dash-remove sentry
import { Integrations } from "@sentry/tracing"; // @dash-remove sentry
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import i18nConfig, { urlLoadPath } from "./i18n-config";

declare global {
  interface Window {
    GLOBALS: Record<string, string | undefined>;
  }
}

// @dash-remove-start sentry
// https://docs.sentry.io/platforms/javascript/guides/remix/
Sentry.init({
  dsn: window.GLOBALS.SENTRY_DSN,
  tracesSampleRate: 0.01, // you may need to adjust this rate depending on your traffic
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});
// @dash-remove-end

i18next
  .use(initReactI18next) // Tell i18next to use the react-i18next plugin
  .use(LanguageDetector) // Setup a client-side language detector
  .use(Backend) // Setup your backend
  .init({
    ...i18nConfig,
    // This function detects the namespaces your routes rendered while SSR use
    // and pass them here to load the translations
    ns: getInitialNamespaces(),
    backend: { loadPath: urlLoadPath },
    detection: {
      // Here only enable htmlTag detection, we'll detect the language only
      // server-side with remix-i18next, by using the `<html lang>` attribute
      // we can communicate to the client the language detected server-side
      order: ["htmlTag"],
      // Because we only use htmlTag, there's no reason to cache the language
      // on the browser, so we disable it
      caches: [],
    },
  })
  .then(() => {
    // After i18next has been initialized, we can hydrate the app
    // We need to wait to ensure translations are loaded before the hydration
    // Here wrap RemixBrowser in I18nextProvider from react-i18next
    return hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>
    );
  });
