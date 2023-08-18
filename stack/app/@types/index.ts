import { SitemapHandle } from "~/seo/sitemap.server";

export type I18nHandle = {
  i18n?: string[];
};

export type BreadcrumbHandle = {
  breadcrumb?: () => {
    label: string;
    path: string;
  };
};

export type Handle = SitemapHandle | I18nHandle | BreadcrumbHandle;
