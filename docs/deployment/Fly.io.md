## Deploying using Fly.io

[Fly.io](https://fly.io/) has excellent support for Remix applications, so we've decided to set up a development flow using Fly.io for DEPT DASH™ projects that lack complexity (read: no database).

Do the following to prepare for your first deployment:

1. Install the Fly.io command line tools ("flyctl")

```bash
# homebrew
brew install flyctl
# linux or others
curl -L https://fly.io/install.sh | sh
# windows
iwr https://fly.io/install.ps1 -useb | iex
```

2. Sign up for Fly.io by visiting https://fly.io/docs/hands-on/sign-up/.
3. Log into Fly.io using
   ```
   flyctl auth login
   ```
4. Generate an auth token using
   ```
   flyctl auth token
   ```
5. Add the token as `FLY_API_TOKEN` to your Github Secrets
6. Update your Fly configuration based on your needs:

   **If you're using a single-trunk branching strategy:**

   - Update the app name and other settings in the `fly.toml` file. The default app name is `dash-demo` and will need to be changed.

   **If you're using a multi-trunk branching strategy (e.g. staging and production environments):**

   - Remove the first line (app = "dash-demo") from the `fly.toml` file
   - Update the Fly deployment yml file (`.github/workflows/fly_deploy.yml`) to use the correct Fly project name for each environment. You'll need to create a separate Fly project for each environment. See [this thread](https://community.fly.io/t/managing-multiple-environments/107/20) for additional context.

   The updated job will look something like this, with app names added to the `flyctl deploy` commands.

   ```yml
   jobs:
      deploy:
         name: 🎈 Deploy app
         runs-on: ubuntu-latest
         steps:
            - name: ⬇️ Checkout repo
            uses: actions/checkout@v3

            - name: 🛸 Setup Fly
            uses: superfly/flyctl-actions/setup-flyctl@master

            - name: 🎈 Deploy to Fly (main)
            if: github.ref == 'refs/heads/main'
            run: flyctl deploy -a "my-app-main" --remote-only
            env:
               FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

            - name: 🎈 Deploy to Fly (staging)
            if: github.ref == 'refs/heads/staging'
            run: flyctl deploy -a "my-app-staging" --remote-only
            env:
               FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

            - name: 🎈 Deploy to Fly (production)
            if: github.ref == 'refs/heads/production'
            run: flyctl deploy -a "my-app-production" --remote-only
            env:
               FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

   ```

> For more detailed instructions about the Fly deployment process, see the [Fly.io documentation for Remix](https://fly.io/docs/getting-started/remix/) or the [Fly.io getting started guide](https://fly.io/docs/hands-on/).
