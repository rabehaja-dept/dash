# Moving to your own Sanity project

Sanity has it's own Sanity Studio, which is a web-based editor for your content. You can find more information about it here: https://www.sanity.io/docs/sanity-studio.
You might want to create your own Sanity Studio or you might want to get data from a Sanity Studio that you already have. In both cases, you'll need to move to your own Sanity project.

# Create the Sanity project (if you don't have one; if you have one - skip this step)

Assuming that you already have an account on Sanity, you can create a new project by following these steps:

1. Run in your console: `npm create sanity@latest` and follow the instructions. (This will create a new Sanity project and a new Sanity Studio, once you hav the project created you can sync it with your Shopify project)
   1.1 If you already have a Sanity project, you can select which project to use, otherwise select `Create a new project`. Once you get to the point of selecting a template, select `E-commerce (Shopify)`.
2. Once you have your Sanity project created, you can sync it with your Shopify project by following these steps:

- Log in into your Shopify account and go to Apps.
- Search for Sanity Connect and install it.
- Go to the Sanity Connect app and click on `Connect to Sanity`.
- Select the project you want to connect to and click on `Connect`.
- You should see a message saying that the connection was successful.

3. You can now run your Sanity Studio locally by running `npm run dev` in your console on the project folder.
   Then you should be able to see your Sanity Studio running on `http://localhost:3333/`. If your sync with Shopify was successful, you should be able to see your products and collections.
4. You can run `sanity deploy` on the project folder to deploy your Sanity Studio to the web. You can find more information about this here: https://www.sanity.io/docs/deployment

# Move to your own Sanity project

To move to your own Sanity project, you'll need to do the following:

1. Get your projectId and dataset from your Sanity project. You can get them on https://www.sanity.io/manage by going to your project. You can get your projectId under `PROJECT ID` and your dataset on Datasets tab.
2. Change the values of `SANITY_STUDIO_DATASET` and `SANITY_STUDIO_PROJECT_ID` in your `.envrc` file with your projectId and dataset.

# Moving to your own Shopify project

Checkout the [Shopify](../shopify/README.md) documentation to learn how to move to your own Shopify project.
