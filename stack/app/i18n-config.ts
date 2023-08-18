import type { InitOptions } from "i18next";

export const supportedLanguages = [
  { code: "en-US", name: "English (US)", currency: "USD" },
  { code: "nl-NL", name: "Nederlands", currency: "EUR" },
] as const;
export type SupportedLang = (typeof supportedLanguages)[number];

// Shopify needs these as individual values, everywhere needs them as an overall locale string
export const defaultLanguageCode = "EN";
export const defaultCountryCode = "US";
export const fallbackLanguage = `${defaultLanguageCode.toLocaleLowerCase()}-${defaultCountryCode}`;
export const defaultCurrencyCode = "USD";

export const urlLoadPath = "/locales/{{lng}}/{{ns}}.json";

const config: InitOptions = {
  supportedLngs: supportedLanguages.map((l) => l.code), // takes an array of language codes
  defaultNS: "common",
  fallbackLng: fallbackLanguage,
  react: { useSuspense: false },
};
export default config;
