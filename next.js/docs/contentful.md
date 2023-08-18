# DASH™ + Next.js + Contentful

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to define your own data structure and then query it using a simple API. It's a great tool for building a custom CMS for your website.

**Your project is initialized with read-only access to a demo contentful space.** This keeps the code from crashing when you first `npm run dev`, and reduces the number of things you have to set up immediately.

Eventually, you'll want to make some changes to the content. That means you'll need to switch over to a new contentful space that your project controls. We've tried to make this process easy by allowing you to copy the demo space into a new space that you control.

## Getting started

To get started, you'll need to create a new Contentful project - set up your own Contentful space (either provided by your client, or a free test space of your own). You can do this by running the following command in the root of the project (or by navigating to [https://app.contentful.com/](https://app.contentful.com/)):

```bash
npx contentful-cli login
npx contentful-cli space create --name "My Space"
```

This will create a new Contentful project. Next, add the following environment variables to your `.envrc` file.

```bash
export CONTENTFUL_SPACE_ID=...
export CONTENTFUL_PREVIEW_ACCESS_TOKEN=...
export CONTENTFUL_ACCESS_TOKEN=...
export CONTENTFUL_ENV_ID=...
```

Then, create a new Personal Access Token at `https://app.contentful.com/spaces/<space-id>/api/cma_tokens`. This will be used to run migrations and other management tasks. Add it to your `.envrc` file.

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=...
```

Finally, pick a secret for your preview environment. This will be used to generate preview URLs for content editors. Add it to your `.envrc` file. It can be anything you want - the longer the better.

```bash
export CONTENTFUL_PREVIEW_SECRET=showmeapreviewplease
```

### Copying the demo space

The demo space has content models for Page, Post, Hero, and other presentational components. The Page model includes a Rich Text field that can contain embedded components, which gives editors a good degree of flexibility for changing the marketing pages of your site.

Download `contentful-export.json` from https://github.com/deptagency/dash/releases/latest. At a terminal, run

```bash
npx contentful-cli space import \
  --space-id <space-id> \
  --management-token $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
  --content-file contentful-export.json
```

This will pull all the content and models from the demo instance into your new space.

#### Content previews

In order to view content previews from Contentful, we need to set up the preview URLs in the Contentful management console.

DASH™ uses an API route (`/api/contentful/preview`) to trigger Next.js's [Draft Mode](https://nextjs.org/docs/pages/building-your-application/configuring/draft-mode), which lets us dynamically fetch the preview data from Contentful. We need to tell Contentful to point to this url when previewing content.

Visit `https://app.contentful.com/spaces/<space-id>/settings/content_preview`. Click "Add content preview". Specify urls to match your deployed environment with query parameters for `secret` (the `CONTENTFUL_PREVIEW_SECRET` environment variable), `slug`, and `contentType`.

For example:

- **Page**: `http://mydomain.com/api/contentful/preview?secret=showmeapreviewplease&slug={entry.fields.slug}&contentType=page`
- **Post**: `http://mydomain.com/api/contentful/preview?secret=showmeapreviewplease&slug={entry.fields.slug}&contentType=post`

You don't need to add previews for the child components, like Hero and Accordion, as they don't have a URL independent of the Page or Post that contains them.

> If you want to preview content in a local development environment, you'll need to use a tool like [ngrok](https://ngrok.com/) to expose your local server to the internet, or you can use the [Contentful CLI](https://www.contentful.com/developers/docs/tutorials/cli/) to set up a proxy to your local server, or simply preview content in a new tab using a localhost url.

### Defining the content model: Small safe changes

Some changes to the website will require changing the structure of the data. Contentful allows you to try these changes out in a segregated environment, then script the changes so they are applied at the same time as the code you needed them for.

1. When you need to do a migration, create a file with `npm run create <migration-name>`. Edit the new migration file that is created.

2. Make a new environment to try out your changes. `contentful space environment create --environment-id '<some-env-name>' --name '<some-env-name>'`. Using the db analogy, this is like a local database copy you can change without impacting anyone else. This environment will include a copy of all the data from master. Now run `CONTENTFUL_ENV_ID=<some-env-name> npm run migrate`.
3. Once you're satisfied with the migration, commit it and make a PR.
4. When your branch reaches a deployed stage, your CI/CD server should run the migration against the contentful environment associated with that stage.

### Aside: Why we need migrations

Some CMSs don't support migrations. The schema and articles all live in the same database, and the only way to push changes up is to either

1. click around in the interface, or
2. completely replace the production data with your local stuff.

The workflow in those situations is:

1. Clone down the prod db. Tell any content editors to stop using the site for a couple of days while you work.
2. Make changes to the data model, possibly backfilling articles with new fields, etc.
3. Replace the prod db with the changed db from your local computer.
4. Tell the content editors it's okay to use the site again.

For many sites, that level of coordination with the editors is unacceptable. For example, imagine a daily newspaper that couldn't publish any new articles (or even work on drafts!) because the devs were working on adding a field to the content model.

Migrations allow us to describe how to adjust the data model of an existing database rather than replacing it entirely and blowing away any content edits since you cloned the data.

### Guidelines for writing migrations

**Migrations should be compatible with the production code running before and after they are applied.**

Migrations are in a branch are run before the new code from that branch is deployed. This means there's a small window where the migration has run, but the old code is still running. Don't break the site during this window. Considering that deploys can fail, the window of time may not be so small after all.

Some examples of safe changes:

- Make a new content type
- Add a non-required field to an existing content type
- Delete a field that has already been removed from the code (and those code changes are live).
- Remove all code references to a field, but leave the data in contentful.

Some examples of ⚠️*unsafe*⚠️ changes:

- Delete a field, removing code references in the same deploy. Instead, remove code references first, then delete the field.
- Rename a field. Instead:
  1. Create a new field, copying data from `oldFieldName` to `newFieldName` using `migration.transformEntries`.
  2. Update the code to look at either `newFieldName` or `oldFieldName`, using whichever is populated.
  3. Push those changes all the way to production.
  4. Mark the old field `omitted` and `disabled`.
  5. Use `migration.transformEntries` _again_, in case there were new entries created where the content editor didn't fill in the new field. Alternatively, spot check the data.
  6. delete the old field.

#### Further Reading

- Databases have been doing this stuff for a long time. Braintree (Paypal) published a great article about how they approach migrations in Postgresql: https://medium.com/paypal-tech/postgresql-at-scale-database-schema-changes-without-downtime-20d3749ed680.
- https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern
- Contentful has written about this at https://www.contentful.com/help/cms-as-code/

### Resources

- Video demonstration of a handful of migration https://contentful.wistia.com/medias/kkw7k4j7lp
- [Contentful migration docs](https://github.com/contentful/contentful-migration#readme) have a bunch of example migration scripts and detail what methods are available
