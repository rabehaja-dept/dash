# DASH™ + Next.js + Sanity

Sanity is a headless CMS that allows you to define your own data structure and then query it using a simple API. It's a great tool for building a custom CMS for your website.

## Getting started

To get started, you'll need to create a new Sanity project. You can do this by running the following command in the root of the project:

```bash
npx sanity init
```

This will create a new Sanity project. Next, add the required environment variables to your `.envrc` file.

```bash
export NEXT_PUBLIC_SANITY_PROJECT_ID=...
export NEXT_PUBLIC_SANITY_DATASET=...
export NEXT_PUBLIC_SANITY_PROJECT_TITLE=...
export NEXT_PUBLIC_SANITY_API_VERSION=...
```

Then, create a new read-only token in the [Sanity dashboard](https://manage.sanity.io/) and add it to your `.envrc` file.

```bash
export SANITY_API_READ_TOKEN=...
```

Finally, start your development server, and the Sanity studio will be available at [http://localhost:3000//sanity/studio](http://localhost:3000/sanity/studio). You'll be able to log in with your Sanity credentials.

You can also customize the url of the Sanity studio by editing the `basePath` property in `sanity.config.ts`.

## Defining your data structure

By default, DASH offers a simple data structure that allows you to create basic pages. You can customize this data structure by editing or creating new schemas in the `sanity/schemas` directory.

**Make sure to import your created schemas in `sanity/schema.ts`**

## Querying your data

To query your data in your frontend, you'll want to create new methods in `sanity/lib/client` that use queries defined in `sanity/lib/queries`. You can then import these methods in your frontend components and use them to fetch data.

## Next steps

For more information on how to use Sanity, check out the [official documentation](https://www.sanity.io/docs).
