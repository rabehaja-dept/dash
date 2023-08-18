export function getLanguageFromLocaleString(localeString?: string): string {
  if (localeString) {
    const locale = new Intl.Locale(localeString);
    return locale?.language;
  }
  return "";
}
