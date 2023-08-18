## Customizing Strapi

One of the great benefits of Strapi is that it's patently extensible and flexible out of the box. But at it's core, it's just a tool to bootstrap your api, and should be treated as such.

By default, projects using Strapi will run the Remix server on `localhost:3000` and the Strapi server on `localhost:1337`. To access the Strapi Admin panel, navigate to `http://localhost:1337/admin`. If it's your first time doing so, Strapi will ask you to create a super admin account, which will give you access to everything you need.

Depending on your configuration, you may have to do two things before Strapi will begin working in your app:

1. Create a database in your Postgres instance named `strapi`.
2. Generate a full-access API token from the Admin panel and set it as the `STRAPI_API_TOKEN` in your `.envrc` file.

To customize Strapi, you'll want to take a peek at the [developer documentation](https://strapi.io/resource-center) to learn more about Collection Types, Single Types, and Components.

In a nutshell though, the customization process looks like this:

1. Create, update, or delete content types in the admin panel
2. Create or update an API endpoint in `app/strapi/index.server.ts` to fetch the data you've generated.

- For example, the content type of "article" is retrieved using a method `getArticles()`

3. Fetch the data in a loader in whatever route you're using and hydrate components

- We've created some very basic Strapi-integrated components in `app/strapi/components`.

That's it! Strapi makes adding resources very easy.

### Generating types for Strapi

Strapi can generate TypeScript types for you to use in your app. To do so, run `npm run generate-typedefs` in `/strapi`, then import `/app/@types/generated/strapi.d.ts` in your code wherever you need to reference a Strapi type.
