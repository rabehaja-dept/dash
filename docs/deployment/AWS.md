## Deploying to AWS

Your stack comes with a GitHub Actions that handles automatically deploying your app to production and staging environments. In practice, that means you'll need to set up a `staging` and `production` branch in your workflow.

Prior to your first deployment, you'll need to do two things:

1. Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. Do not push your app yet, as we'll add some secrets to the github repo.

```sh
git remote add origin <ORIGIN_URL>
```

2. Add an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

That's it! Now that everything is set up, you can commit and push your changes to your repo. Every commit to your `production` branch will trigger a deployment to your production environment, and every commit to your `staging` branch will trigger a deployment to your staging environment.

**Depending on your stack integrations you will need to add more environment variables**