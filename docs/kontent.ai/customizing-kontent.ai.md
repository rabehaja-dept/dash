## Customizing Kontent.ai

Kontent.ai is very extensible and flexible out of the box. But at its core, it's just a tool to bootstrap your API, and should be treated as such.

To customize Kontent.ai, you'll want to start by reading some information in the [developer documentation](https://kontent.ai/learn/).

Briefly, the process for customizing Kontent.ai is:

1. Create, update, or delete content types in the `Content model` section of the Kontent.ai dashboard.
2. Update your local type definitions by running `npm run generate-typedefs` in the `kontent.ai` directory (see next section for more details).
3. Create or update an API endpoint in `app/kontent.ai/index.server.ts` to fetch the data you've generated and return it in the format you want.

- For example, a piece of content with the type of "article" might be retrieved using the method `getArticleBySlug()`

4. In a route, fetch the data in a loader function to be passed to the component.

- It's important to always load the data server-side, as we don't want to ever expose the Kontent.ai API key to the client.

5. Access the server-loaded data using `useLoaderData()` in the component.
   - We've created some very basic integrated components in `app/kontent.ai/components`, including an image component that helps with image optimization.

### Generating types for Kontent.ai

Kontent.ai can generate very robust TypeScript types for you to use in your app. We're using a first-party package called `@kontent-ai/model-generator` to do this.

To retrieve types from Kontent.ai, run `npm run generate-typedefs` in `/kontent-ai`, then import `app/@types/generated/kontent.ai/content-types` in your code wherever you need to reference a content type. Kontent.ai also has several other directories in `app/@types/generated/kontent.ai` that you can import from and are worth checking out.

For more information on how to use the generated types, see the [developer documentation](https://kontent.ai/learn/tutorials/develop-apps/build-strong-foundation/strongly-typed-models/) or the [package documentation](https://www.npmjs.com/package/@kontent-ai/model-generator).
