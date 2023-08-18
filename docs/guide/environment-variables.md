# Configuration variables

DEPT DASH™ uses a mixture of environment variables and a config file (`app/config.ts`) to hold configuration options.

The following logic determines where config options are stored;

- If the value is secret, then it should be an environment variable.
- If the value changes for each environment (local, CI, staging, production), then it should be an environment variable.
- All other values should be in the config file.
For example, there are several Shopify configuration values, and they're all public (since they're used on the client anyway), and they don't change per environment (because you'll always point to the same store instance), so they're stored in the config file at `app/config.ts`.
For environment variables, new projects have an `.envrc.example` file that can be copied to `.envrc` to get started. All the values in the example are either blank or are public from the DEPT DASH™ demo site.

## Using environment variables

### On the server

Use `getEnv` from `/app/config.ts` to access an environment variable on the server (for example, in a `loader`). Example: `const yourFavoriteEnvironmentVariable = getEnv("YOUR_FAV_ENV");`.

### On the client

Use `getEnv` in your route's `loader`, then pass the value through to the components that need it on the client. It probably goes without saying, but as soon as your `loader` returns an environment variable, it should be considered public since it's sent to the client. Be careful which values you send to the client.

## Adding or editing in development

To add new environment variables or edit existing ones in your local development environment, edit the `.envrc` file and run `direnv allow` in your console to allow the change.

## Manually adding or editing in CI (GitHub Actions)

In order for CI to run, you'll need to add all applicable environment variables to GitHub as repository secrets.

DEPT DASH™ includes a script that will help you update or create environment variables using the GitHub cli. The script will take the environment variables that exists in your local `.envrc` file and push them into your repository's GitHub secrets.

To run the script:

1. Install the GitHub cli -> https://cli.github.com/manual/installation.
2. Run the script

```bash
scripts/update-github-secrets.sh
```

Or if you want to edit these manually instead:

1. In your GitHub repo, go to `Settings -> Secrets -> Actions`. Add or edit these values as needed.
2. In `.github/workflows/main.yml`, use these values as needed, usually with an `env:` step to set up the environment that runs in CI. More information on GitHub Secrets can be found [here](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Adding or editing in production

Environment variables for production are stored in AWS Secrets Manager. The initial entry will be created when the app is deployed, but you'll likely need to adjust these values over time as development progresses.

To add or edit environment variables in production:

1. Login to the AWS console for your project.
2. Search for `Secrets Manager` and navigate there.
3. Make sure you're in the correct region for the deployed app.
4. You should see a secret named like this: `/dept-dash/<projectName>/<stage>/environment` (for example: `/dept-dash/demo/production/environment`). Click into it.
5. Click `Retrieve secret value`.
6. Click `Edit` and make your changes.
7. Click `Save`.

Note that containers read these values when they first start up, so they'll need to be restarted in order to read the updated values. The easiest way to do this is to trigger a deploy in CI.

## Adding or editing config file variables

The config file (`app/config.ts`) is committed to the repo, so adding or editing values is straightforward: edit the file as you would with any code and commit it. All environments will read the same configuration.
