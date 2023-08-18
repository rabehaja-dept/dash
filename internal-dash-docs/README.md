# DEPT DASH™ Internal Readme

This guide is for things the DEPT DASH™ maintainers and contributors need to know, but not users of DASH.

## Project structure

The repo consists of a few different things:

- `/stack`, a [Remix Stack](https://remix.run/docs/en/v1/pages/stacks) for building a full-stack web application. This is the main entry point for interacting with this project.
  - Includes React components `/stack/app/components`, many of which include [storybook stories](https://deptagency.github.io/dash/storybook).
- `/next.js`, a [Next.js](https://nextjs.org/) stack for building a statically-generated web application.
- `/cdk-webapp`, A cloud development kit ("CDK") for deploying your web application.
- `/demo`, a demo project showing how DEPT DASH™ works.
- `/docs`, comprehensive documentation about how to get set up, how to contribute to DEPT DASH™, and how to use this stack in your own project.
- `/internal-dash-docs`, an internal readme for the maintainers of and contributors to DEPT DASH™. (you're reading this right now)

## Feature removal process

Since DASH has a variety of features that many projects won't need, we have a process to remove features when users spin up the stack. We include all features by default and remove them as needed (rather than the opposite: adding features as needed). This is mainly done for maintainability: the entire DASH codebase should work with _all_ features included, and it's easier to view everything in place at once.

### How it works for the end user

1. When someone initializes the stack via `./createStack.sh`, we ask which features they want (contentful, strapi, DB, shopify, etc.).
2. The removal process is triggered for each feature they want removed. See below for how this process works.
3. `npm run format` is run to fix all the broken indentation.
4. The stack is ready to go for the user!

Alternatively, for #1, we set the `INTEGRATIONS` environment variable to set the answer to these items during CI. Example of a command that will run without any interaction in CI:

```
INTEGRATIONS="db, shopify, algolia" ./createStack.sh my-remix-app
```

### The removal process

There are two parts to the removal process.

First, we execute commands embedded in comments in our source files for string manipulation. For example, if you need to remove or replace a line of code when a feature is removed, you should do so using this comment system. See below for details.

Second, we execute a bash script for each removal category, if the script exists. These live at `stack/remix.init/scripts/<category>.sh` (for example `stack/remix.init/scripts/contentful.sh`). These should primarily be used to delete entire directories from the filesystem, `npm uninstall`, and `npm pkg delete`. If you need to do something unique to remove a feature, you can do it in these scripts, but it's best to avoid string manipulation as much as possible (since that's what the comment command system is for).

### Comment commands

There are several commands that can be used:

- `@dash-remove <category>`
- `@dash-replace <category>: <replace with>`
- `@dash-remove-next-line <category>`
- `@dash-replace-next-line <category>: <replace with>`
- `@dash-remove-start <category>` with a matching `@dash-remove-end`

These can be used in these types of comments:

- `//`
- `{/* */}` (for TSX)
- `#`

#### Examples

##### Remove a line

To remove a line of code when the `contentful` feature category is removed:

```
import { getNavContainer } from "./contentful/index.server"; // @dash-remove contentful
```

or

```
// @dash-remove-next-line contentful
import { getNavContainer } from "./contentful/index.server";
```

##### Remove multiple lines

To remove multiple lines of code when the `contentful` feature category is removed:

```
import { getNavContainer } from "./contentful/index.server"; // @dash-remove contentful
import { INavContainer, SpecificLocale } from "./@types/generated/contentful"; // @dash-remove contentful
import { NavProvider } from "./contentful/components/NavProvider"; // @dash-remove contentful
```

or

```
// @dash-remove-next-line contentful
import { getNavContainer } from "./contentful/index.server";
// @dash-remove-next-line contentful
import { INavContainer, SpecificLocale } from "./@types/generated/contentful";
// @dash-remove-next-line contentful
import { NavProvider } from "./contentful/components/NavProvider";
```

or

```
// @dash-remove-start contentful
import { getNavContainer } from "./contentful/index.server";
import { INavContainer, SpecificLocale } from "./@types/generated/contentful";
import { NavProvider } from "./contentful/components/NavProvider";
// @dash-remove-end
```

##### Remove TSX

To remove a line of TSX when the `contentful` feature category is removed:

```
{/* @dash-remove-next-line contentful */}
<NavProvider navContainers={{ primaryNav }}>
```

This works the same as everywhere else, except you'll usually need to use `@dash-remove-next-line` or `@dash-remove-start` since prettier won't let you have a comment on the same line.

##### Remove example environment variables

```
# @dash-remove-start strapi
export STRAPI_URL=http://localhost:1337
export STRAPI_API_TOKEN=
# @dash-remove-end
```

##### Remove a line in the Dockerfile

This works the same as everywhere else (just with Dockerfile style comments):

```
# @dash-remove-next-line db
RUN npx prisma generate
```

##### Replace a line

To replace a line with a new line when the `contentful` feature category is removed:

```
import { Nav } from "~/contentful/components/Nav"; // @dash-replace contentful: import { Nav } from "~/components/Nav";
```

or

```
// @dash-replace-next-line contentful: import { Nav } from "~/components/Nav";
import { Nav } from "~/contentful/components/Nav";
```

Remember that `npm run format` will fix formatting afterwards, so you don't need to worry about indentation and such.

## Running the stack in Docker locally

Make sure the docker daemon is running locally.

Set up a test environment file that's suitable for docker (which uses the dotenv format). For the most part, this means copying everything in your local `.envrc` file to `docker.env` and removing the `export ` on each line to match the dotenv format. There's one change though: our docker image expects standard `PGUSER` style environment variables instead of a `DATABASE_URL`, so remove the `DATABASE_URL` variable in your `docker.env` and instead add something similar to this (you may need to adjust slightly for your local setup):

```
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=host.docker.internal
PGPORT=5432
PGDATABASE=remix
```

If you're using strapi, you'll also need the contents of `strapi/.env`, something like this:

```
STRAPI_APP_KEYS=key1,key2
STRAPI_API_TOKEN_SALT=tokensalt
STRAPI_ADMIN_JWT_SECRET=adminjwtsecret
STRAPI_JWT_SECRET=jwtsecret
```

Build the docker image in the `/stack` directory: `docker build -t dash .`

Run docker, exposed to port 5000 locally: `docker run -p 5000:80 --env-file docker.env --add-host host.docker.internal:host-gateway -t dash`. The `--add-host` part may change depending on your local architecture (check the docker documentation on how to expose the local network to docker).

Alternatively, the same thing but with an interactive shell: `docker run -p 5000:80 --env-file docker.env --add-host host.docker.internal:host-gateway -it dash /bin/bash`

## Deploying demo instances

### Secrets for Fly

```
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) \
PUBLICLY_AVAILABLE_ORIGIN="https://dash-demo.fly.dev" \
CONTENTFUL_SPACE_ID=jcdjo56lmw8q \
CONTENTFUL_PREVIEW_ACCESS_TOKEN=6Sovo60Z0rGOYvNmnr_pKBp5pXCKkJqRkUHODg4YXyA \
CONTENTFUL_ENV_ID=master \
ALGOLIA_APP_ID=RHVCHJW67L \
ALGOLIA_INDEX=demo_content \
ALGOLIA_STORE_INDEX=shopify_products_recently_ordered_count_desc \
ALGOLIA_SEARCH_KEY=5e56001b6c4b76edb3d2b69ca5951b75 \
SENTRY_DSN=https://1b71de85d6ee44a2a2de573d8d4f27d8@o1233685.ingest.sentry.io/6466228 \
--app dash-demo
```
