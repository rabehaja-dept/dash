import Backend from "i18next-fs-backend";
import { RemixI18Next } from "remix-i18next";
import { fallbackLanguage, supportedLanguages } from "./i18n-config";
import path from "path";

export const fileLoadPath = path.resolve(
  path.join(__dirname, "..", "public", "locales", "{{lng}}", "{{ns}}.json")
);
class SubdomainRemixI18Next extends RemixI18Next {
  public async getLocale(
    request: Request,
    fallbackLng?: string
  ): Promise<string> {
    return (
      getSupportedLanguageFromCookie(request) ||
      fallbackLng ||
      super.getLocale(request)
    );
  }
}

export const i18n = new SubdomainRemixI18Next({
  detection: {
    fallbackLanguage,
    supportedLanguages: supportedLanguages.slice().map((lang) => lang.code),
  },
  i18next: {
    backend: {
      loadPath: fileLoadPath,
    },
  },
  backend: Backend,
});

function getLngFromCookie(cookie: string | null) {
  return cookie?.match(/lng=([a-z]{2}-[A-Z]{2})/)?.[1];
}

function getSupportedLanguageFromCookie(request: Request) {
  const lng = getLngFromCookie(request.headers.get("Cookie"));
  return (
    lng &&
    supportedLanguages.find(({ code }) => {
      const locale = new Intl.Locale(code);
      return locale.baseName === lng;
    })?.code
  );
}
