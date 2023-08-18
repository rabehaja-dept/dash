## Contentful and Typescript types

We use an automated process to generate Typescript types from the Contentful model. You'll likely want to run this process repeatedly throughout the process of defining your Contentful schema. To do so, run `npm run generate-typedefs` from the `contentful` directory anytime you'd like during development. It will only change your local `app/@types/generated/contentful.d.ts` file, so you can see the changes and commit them as normal.

In the `app/@types/generated/contentful.d.ts` file, you'll see a Typescript representation of your Contentful model. Each entry is represented by an `IEntry` interface as well as an `IEntryFields` interface. The overall `IEntry` interface wraps `IEntryFields` in Contentful's `Entry` type in order to provide the non-field properties (`sys`, for example). See the [Contentful documentation](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/entries/entry) for more information about the shape of Contentful API responses.

### Types and localization

The shape of data from Contentful changes depending on if you request locale-specific content, or content for multiple locales. When you specify `locale=*` in the query, or when retrieving Contentful data from Algolia, field values are nested in an object with keys corresponding to each locale (for example, `fields.fieldName[localeCode]`) instead of directly (for example, `fields.fieldName`). In order to handle this with Typescript, each entry interface like `IEntry` is assumed to have locales specified, and if we wrap the entry in `SpecificLocale` it's assumed to _not_ have locales specified. This sounds more complicated than it is, so here are some examples.

An `IEntry` object will look like this:

```typescript
"fields": {
  "title": {
    "en-US": "Hello, World!"
  },
  "body": {
    "en-US": "This is the body field"
  }
},
```

Whereas a `SpecificLocale<IEntry>` object will look like this:

```typescript
"fields": {
  "title": "Hello, World!",
  "body": "This is the body field"
},
```

This is useful because you'll usually use the `SpecificLocale<IEntry>` representation in your code (because even on a site with localization, you rarely get _all_ of the locales at once, you retrieve the one locale you need for the current user). The main situation where you need to use the `IEntry` representation is when working with Contentful data in Algolia, because we have to index all locales into Algolia.
