import { RouteMatch } from "@remix-run/react";
import type { ComponentMeta } from "@storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Breadcrumbs",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

export const Default = makeTemplate(Breadcrumbs);

/**
 * for useability, we pass matches (from `useMatches()`)
 * so the props data structure is a bit unwieldy
 */
const testMatches: RouteMatch[] = [
  {
    id: "routes/contentful",
    pathname: "/contentful",
    params: { slug: "hello-world" },
    data: {},
    handle: {
      id: "contentful",
      i18n: ["common", "tags"],
      breadcrumb: () => ({ label: "Contentful", path: "/contentful" }),
    },
  },
  {
    id: "routes/contentful/blog",
    pathname: "/contentful/blog",
    params: { slug: "hello-world" },
    data: {},
    handle: {
      id: "contentful",
      i18n: ["common", "tags"],
      breadcrumb: () => ({ label: "Blog", path: "/contentful/blog" }),
    },
  },
  {
    id: "routes/contentful/blog/$slug",
    pathname: "/contentful/blog/hello-world",
    params: { slug: "hello-world" },
    data: {},
    handle: {
      id: "contentful",
      i18n: ["common", "tags"],
      breadcrumb: () => ({
        label: "Hello World",
        path: "/contentful/blog/hello-world",
      }),
    },
  },
];

Default.args = {
  matches: testMatches,
};
