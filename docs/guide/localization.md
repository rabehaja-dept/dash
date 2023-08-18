# Localization

DEPT DASH™ uses `i18next` for localization in the app itself.
<!-- @dash-remove-start base -->
It's integrated with Contentful, Shopify, and Algolia to pull localized content from each of those third-party services.
<!-- @dash-remove-end-->

## Editing languages supported in the app

`app/i18n-config.ts` has a variety of configuration options for localization in your app. Specifically, `supportedLanguages` is an array of each locale that you would like to support, and `defaultLanguageCode` and `defaultCountryCode` defines the default locale to use.

## Translating app content

The most common task is to translate specific strings in the app (such as UI elements). There's a couple steps for this:

1. Add or edit translation files in `public/locales` (for example, `public/locales/en-US/common.json`).
2. For the route where you want to translate something, add the translation namespaces to `handle`. For example: `export const handle = { i18n: "common" };`. This tells remix (`remix-i18next` specifically) to load that translation file as part of the server-rendering for this route.
3. In your component(s), use the `useTranslation` hook: `const { t } = useTranslation("common");`. Then you can use `t` to translate strings, for example: `t("Contact Us")`.

For more information, see [i18next](https://react.i18next.com/) and [remix-i18next](https://github.com/sergiodxa/remix-i18next).

> Note: This method should be used for strings in the app specifically, such as UI elements. Content should be translated in Contentful, and ecommerce content should be translated in Shopify.

<!-- @dash-remove-start contentful -->
## Translating Contentful content

We pass the locale through when querying for content from Contentful (including indexed content in Algolia), so translated content from those sources will work out-of-the-box. To get this working for a new locale:

1. Set up the locale and translations in Contentful. See [Contentful docs](https://www.contentful.com/help/working-with-translations/).
2. Make sure you added the new locale to `supportedLanguages` in `app/i18n-config.ts`.
3. That's it!
<!-- @dash-remove-end -->

<!-- @dash-remove-start shopify -->
## Translating Shopify content

We pass the locale through when querying for content from Contentful (including indexed content in Algolia), so translated content from those sources will work out-of-the-box. To get this working for a new locale:

1. Set up the locale and translations in Contentful. See [Shopify docs](https://help.shopify.com/en/manual/markets/languages).
2. Make sure you added the new locale to `supportedLanguages` in `app/i18n-config.ts`.
3. That's it!
<!-- @dash-remove-end -->