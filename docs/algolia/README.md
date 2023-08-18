Algolia provides search capabilities for Contentful and Shopify content, including [faceted search](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/).

## Creating your own Algolia account and index

When moving to your own setup, you'll need a new Algolia account and index.

1. Go to [Algolia](https://www.algolia.com/) and create a new account (or use an existing one if you have it).
2. Create a new index for use on this project. We recommend prefixing the index with the stage name (`staging_` and `production_`, for example).
3. See below to set up filters and index content.

### Setting up filtering and facets

In order for Algolia to index your content for filtering and faceting, you need to tell it what fields you want to use. You'll likely want to use facets for a tag system or other things relevant to your project (content type, blog entry types, etc.).

To set this up in Algolia:

1. Go to one of the indices for this project in the Algolia dashboard.
2. Go to the `Configuration` tab.
3. Click `Facets` on the left.
4. Click the `Add an Attribute` button.
5. Select the field you want to add.
6. Click `Review and Save Settings`. Note that you can opt to save these settings to another index at the same time, which is useful for initial setup across multiple indices (staging and production).

<!-- @dash-remove-start contentful -->
### Indexing Contentful content

You'll need to [tweak your webhook settings in Contentful](../contentful/moving-to-your-own-space.md#algolia-webhook) in order to index content into Algolia.

<!-- @dash-remove-end -->
