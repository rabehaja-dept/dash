## Generating Sitemaps

Sitemaps are a way to tell search engines about pages on your site they may not otherwise discover. Sitemaps also provide valuable information about your pages. For example, when search engines crawl the sitemap, they may learn more about your site and the content within it.

We've made it easy to generate sitemaps for your site by exporting a handle for routes you want to include in the sitemap. Exporting a `handle` on a route simply makes this entry available with the `useMatches()` hook when we generate the sitemap. More about handles [here](https://remix.run/docs/en/v1/api/conventions#handle).

In a dynamic `$slug` route:

```tsx
import type { Handle } from "~/@types";

export const handle: Handle = {
  id: "an-id",
  getSitemapEntries: async (request: Request) => {
    const entries = await getAllEntriesSomewhere();

    return entries.map((entry) => ({
      route: "/the-base-route/" + entry.slug,
      /** If you're using i18n, add those namespace(s) here */
      i18n: ["common", "another-namespace"],
      changefreq: "weekly",
      lastmod: entry.updatedAt,
      priority: 0.5,
    }));
  },
};
```

> Note that by default, we fetch all posts/entries/pages from your CMS and generate a sitemap for them. If you have a lot of content, this may take a while. You may want to limit the number of entries we fetch.

Read more about the structure of a sitemap [here](https://www.sitemaps.org/protocol.html).
