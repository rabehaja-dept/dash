# Create a Project

## Get access to the DEPT DASH™ GitHub repository

If you don't have access to the [DEPT DASH™ GitHub repository](https://github.com/deptagency/dash), you'll need to get access before you can create your own project. You can request access by posting in the `#dash-support` channel in Slack or by messaging a DEPT DASH™ team member.

## Use Node 16

**DEPT DASH™ requires Node 16**.

Before you begin setup, make sure you have Node 16 installed on your machine. We like to use [Node Version Manager](https://github.com/nvm-sh/nvm) ("`nvm`"). If you don't use version 16, the development server will throw an error; if you see an error about your Node version, make sure you're using version 16.

## Set up `direnv`

For managing environment variables, you'll need to set up [direnv](https://direnv.net). Follow the [setup instructions](https://direnv.net/#getting-started) for installation and hooking into whatever shell you're using.

Then, allow access to the variables by running

```bash
direnv allow
```

## Choose your flavor of DEPT DASH™

DEPT DASH™ comes in two flavors: Next.js and Remix. The Next.js edition is simpler, and doesn't include a database. The Remix edition is more complex, and includes an optional database and a CMS.

Take a look at the [current integrations](https://github.com/deptagency/dash#readme) provided by each edition to determine which one is right for your project. You'll be asked to choose which edition you want to use when you create your project.

<!-- @dash-remove-start db -->

## Set up Postgres _(if you need a database)_

**Most DASH projects don't actually need a database!** But if your's does, you'll need to get Postgres running on your machine. We recommend using [Postgres.app](https://postgresapp.com/) on macOS, but you can use any other method.

Verify Postgres is running on port `5432` and that the default username and password are set: `postgres` user with a password of `postgres`.

## Create your project

1. Navigate to the directory where you want to create your project.
2. Verify you're using Node 16.
3. Verify you have the [GitHub CLI](https://cli.github.com) installed, are logged in, and have access to the DEPT DASH™ GitHub repository.
4. Run:

```bash
/bin/bash -c "$(curl -fsSL https://deptagency.github.io/dash/install.sh)"
```

Answer the prompts to determine what's included in your stack.

Once the script finishes, you'll have a new directory with your project name. Navigate into it, and verify direnv has access to environment variables by running `direnv allow`.

**If you're using a database**, run:

```sh
npm run setup
```

**If you're using Strapi**, create a database called `strapi`:

```sh
> psql -f scripts/pg_init/*.sql
```

then run `npm run dev` to start the development server and start creating content!

## Deployment

**For Remix:**

DEPT DASH™ comes with out-of-the-box deployment targets for [Fly](https://fly.io/), [AWS](https://aws.amazon.com/), [Vercel](https://vercel.com/), and more will be added soon.

Here are some recommendations for choosing a deployment target:

- If your project is on the simpler side, and especially if it only uses third-party tools (not Strapi or Postgres), we recommend using Fly. Setting up and managing deployment is considerably simpler with Fly. Another good option for simple projects is Vercel, it's a great option if you want to have a preview environment for every pull request.
- If you need fine-grained control over how your infrastructure scales and is load balanced, or if you need other services, then we recommend AWS. It's much more complex to set up, but allows control over every facet of your deployment.

**For Next.js:**

Because the Next.js edition of DASH is much simpler (and has no database), we haven't explicitly set up a deployment target. We recommend using Vercel, as it's the simplest option and has a preview environment for every pull request. You can also use Netlify, or any other deployment target that supports Next.js.
