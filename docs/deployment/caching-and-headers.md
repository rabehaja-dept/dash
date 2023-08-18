## Headers & Caching

An important part of your application setup is sending `Headers` to control caching, provide additional context, and authentication. By setting an appropriate CDN caching policy, CDNs will serve data more quickly and efficiently to end users, making the site load faster.

You can set global headers or each route can define its own HTTP headers.

### How to set global headers
DEPT DASH™ uses `app/entry.server.tsx` to generate the HTTP response when rendering on the server. The default export of this module is a function that lets you create that response, including HTTP status, headers, etc., giving you full control over the way the markup is generated and sent to the client.

In `entry.server.ts`, we add headers inside a `handleRequest()` function.

```typescript
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  responseHeaders.set("x-custom", "yay!");
  ...
};
```

However, you may want to set headers for each individual route. For that, you can export a `headers()` function.

```typescript
export function headers({ actionHeaders, loaderHeaders, parentHeaders }) {
  return {
    "X-Stretchy-Pants": "its for fun",
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
}
```

Usually your data is a better indicator of your cache duration than your route module (data tends to be more dynamic than markup), so the action's & loader's headers are passed in to `headers()` too:

```typescript
export function headers({ loaderHeaders }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}
```

_Note:_

We don't want surprise headers in your responses, so it's your job to merge them if you'd like. Remix passes in the `parentHeaders` to your headers function. You need to be careful not to send a `Cache-Control` from a child route module that is more aggressive than a parent route.

All that said, you can avoid this entire problem by not defining headers in parent routes and only in leaf routes. Every layout that can be visited directly will likely have an "index route". If you only define headers on your leaf routes, not your parent routes, you will never have to worry about merging headers.

See more in the [Remix Documentation](https://remix.run/docs/en/v1/api/conventions#headers).
