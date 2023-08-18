## Deploying with Vercel

We've set up a couple GitHub actions for handling deployments to Vercel:

- The [first action](https://github.com/deptagency/dash/blob/main/stack/.github/workflows/vercel_deploy.yml) handles deploying the production version of your app on pushes to the `main` branch. You can change the branch that triggers this action by editing the `vercel_deploy` build step in `main.yml` .
- We've also added a [second action](https://github.com/deptagency/dash/blob/main/stack/.github/workflows/vercel_preview_deploy.yml) to trigger a [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments) on every opened pull request. This automatically deploys the branch to a temporary Vercel deployment target. A bot will then add or edit an existing comment to link to the latest Vercel preview url. We think this is super handy, but you can turn this off by simply removing the `vercel_preview_deploy.yml` workflow file.

> We chose to write GitHub Actions instead of connecting Vercel directly to our repository so we could have more fine-grained control over our CI/CD process. If you prefer to connect your repository to Vercel directly, you can do so by following the [Vercel documentation](https://vercel.com/docs/git-integrations/vercel-for-github). You can also use the [Vercel CLI](https://vercel.com/download). If so, you can remove the `vercel_deploy.yml`, `vercel_preview_deploy.yml` workflow files and the `vercel_deploy` build step in `main.yml`. Or simply select the `I'll configure this myself` option when prompted during the stack initialization process.

## Configuring Vercel

Before your first deployment, make sure you have a [Vercel account](https://vercel.com/) and have created a [new project](https://vercel.com/new). We recommend using the [Vercel CLI](https://vercel.com/download) and running

```bash
vercel project add [your-project-name]
```

Once you've created a project, add three secrets to your repository:

- `VERCEL_TOKEN` You can find this in your [Vercel account settings](https://vercel.com/account/tokens).
- `VERCEL_ORG_ID` You can find this in your [Vercel account settings](https://vercel.com/account). It may be a personal account ID or a team ID.
- `VERCEL_PROJECT_ID` You can find this in your Vercel project settings.

## Environment Variables

The last step before your first deployment is adding environment variables to Vercel. The quantity and type of variables may vary wildly depending on your chosen stack. You should add all of the variables in your `.envrc` file - do this via your Vercel project's environment variable settings.

![Project's domain URL](https://dept-dash-demo-videos.s3.amazonaws.com/Vercel+-+Domain.png)

Note: You must add the environment variable `PUBLICLY_AVAILABLE_ORIGIN` to your project's environment variables in Vercel. **Make sure to include https:// in the value of the environment variable.**

You can find the value by going to your Vercel dashboard and clicking on the project you just deployed. Then, click on the `Settings` tab and then on the `Domains` tab. You will see the domain URL of your project. Copy the URL and add it to the environment variable `PUBLICLY_AVAILABLE_ORIGIN`.

![Add the environment variable `PUBLICLY_AVAILABLE_ORIGIN` to your project at Vercel](https://dept-dash-demo-videos.s3.amazonaws.com/PUBLICLY_AVAILABLE_ORIGIN.png)
