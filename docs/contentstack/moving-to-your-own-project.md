# Moving to your own Contentstack project

Each stack is initialized with access to a demo Contentstack project. This keeps the code from crashing when you first `npm run dev`, and reduces the number of things you have to set up immediately.

Eventually, you'll want to start using your own Contentstack project. That means you'll need to switch over to a new project that you or your client controls.

Briefly, the process for customizing Contentstack is:

1. Create a stack in the [Contentstack dashboard](https://app.contentstack.com/). More at [Creating a Stack](https://www.contentstack.com/docs/developers/quickstart-in-5-mins/#create-a-stack).
2. Create a Content Type. More at [Creating a Content Type](https://www.contentstack.com/docs/developers/quickstart-in-5-mins/#create-a-content-type).
3. Create an Environment. More at [Creating an Environment](https://www.contentstack.com/docs/developers/quickstart-in-5-mins/#create-an-environment).
4. Create Content. More at [Creating Content](https://www.contentstack.com/docs/developers/quickstart-in-5-mins/#create-content).
5. Publish Content. More at [Publishing Content](https://www.contentstack.com/docs/developers/quickstart-in-5-mins/#publish-content).
6. Create a Delivery Token. More at [Creating a Delivery Token](https://www.contentstack.com/docs/developers/create-tokens/create-a-delivery-token/).
7. Update your `.envrc` file with the new Delivery Token. More at [Updating your .envrc file](#updating-your-envrc-file).


# Updating your `.envrc` file
Update the following environment variables with the values from your new Contentstack project:

```sh
export CONTENTSTACK_API_KEY=
export CONTENTSTACK_DELIVERY_TOKEN=
export CONTENTSTACK_ENVIRONMENT=
```
If you configured your Contentstack project on a different region than the default (US), you'll also need to add the following environment variable:

```sh
export CONTENTSTACK_REGION=
```