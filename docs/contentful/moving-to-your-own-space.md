## Moving to your own Contentful Space

Your project is initialized with read-only access to a demo contentful space. This keeps the code from crashing when you first `npm run dev`, and reduces the number of things you have to set up immediately.

Eventually, you'll want to make some changes to the content. That means you'll need to switch over to a new contentful space that your project controls.

### Set up a space and get tokens

Set up your own Contentful space (either provided by your client, or a free test space of your own). Create a new Personal Access Token at `https://app.contentful.com/spaces/<space-id>/api/cma_tokens`.

Add that value to the Github repo secrets and your local `.envrc` file as `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`.

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

### Other stuff

Not everything comes across perfectly when we run `contentful-cli space import`. In particular, the content previews and algolia webhook will have broken. We'll fix both of these in the contentful web console.

#### Algolia webhook

Visit `https://app.contentful.com/spaces/<space-id>/settings/webhooks`. There should be four webhooks: two sets of `Algolia - Index entries` and `Algolia - Delete unpublished entries`. Each set belongs to an environment (two webhooks for staging, two for production). Visit each of the webhooks, click `Webhook settings`, and update the headers sent along with the webhook request. You'll need headers for

- `X-Algolia-Application-Id` on the two delete webhooks
- `X-Algolia-API-Key` on all of the webhooks

Next, visit both of the `Algolia - Index entries` webhooks and click `Webhook settings`. These point to our app rather than directly to Algolia, so we'll need to update it:

- You'll need to deploy the app somewhere publicly accessible in order for Contentful to reach it (or, during early development, run `ngrok` locally).
- The webhook URL will be set to `https://demo.deptdxp.com/api/index-contentful/{ /payload/sys/id }`. Update the `demo.deptdxp.com` part to your URL for this environment, something like: `https://staging.clientsite.com/api/index-contentful/{ /payload/sys/id }`.

> **Why do we have a custom webhook for indexing content?**
>
> The default Contentful integration with Algolia only sends the base content for each entry, without any embedded content. This has two main drawbacks:
>
> 1. It doesn't include embedded asset data, so, for example, you won't have access to image URLs when displaying search results. Considering most search results page show thumbnails, this is a blocker.
> 2. It doesn't include embedded entry content in the searchable data in Algolia. For example: if you have a `Page` content type that embeds an `Accordion` of FAQ questions, the FAQ question content won't be searchable in Algolia.
>
> To resolve this, we have our own API endpoint to handle webhook events from Contentful. It queries content from Contentful with a depth of `10`, so embedded assets and entries will be included in Algolia (unless you have a hierarcy in Contentul that's deeper than 10).

#### Content previews

Visit `https://app.contentful.com/spaces/<space-id>/settings/content_preview`. Click "Add content preview". Specify urls to match your deployed environment. For example, the demo environment has

- **Page**: `https://demo.deptdxp.com/{entry.fields.slug}?preview=1`
- **Post**: `https://demo.deptdxp.com/contentful/{entry.fields.slug}?preview=1`

You don't need to add previews for the child components, like Hero and Accordion, as they don't have a URL independent of the Page or Post that contains them.

### Contentful setup assumptions

- Each deployed stage of your application has its own Contentful environment.
- Developers working on content model changes can use an isolated Contentful environment.

### Defining the Content Model: Trying things out

For a greenfield project, you probably have no data yet, and no editors using the space yet. In this situation, you can mess with the data model in Contentful's UI for defining the content model. It's pretty good and will let you gain familiarity with what's possible inside the system.

As you go, you can run `npm run generate-typedefs` from the `contentful` directory to update the typescript representations of Contentful entities.

Before you commit, you may want to run `npm run bootstrap`. This script creates an initial migration file for each content type, and tracks those migrations in the contentful environment. You can run this whenever you make changes, but be aware that it will blow away your migration history. This can cause data loss, so only run this while you're still figuring out the initial schema, and haven't yet shared access with any editors.

Try to get your schema locked down as much as possible during this phase. Once you have data you care about, you'll start needing backward compatible migrations.

At some point, you'll need to start sharing the space with editors. This requires a mindset shift. Until this point, we've been totally happy to destroy all the entities in our environment; only the content model mattered. Now, we have editors who are working on writing content. They might be people who work for your client, so it's a good idea to avoid breaking their workflow or losing their work.

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

### Refreshing the staging environment

Sometimes, we'll merge some migrations to staging that end up not working, and we decide to go another way. After this has happened a few times, it's easy for the staging and production environments to diverge. To fix this, delete the staging environment, and make a new one based on the one from production.

As an extra benefit, you'll get a refreshed set of data copied down from production.

### Resources

- Video demonstration of a handful of migration https://contentful.wistia.com/medias/kkw7k4j7lp
- [Contentful migration docs](https://github.com/contentful/contentful-migration#readme) have a bunch of example migration scripts and detail what methods are available
