## Customizing Contentstack

Briefly, the process for customizing Contentstack is:

1. Create, update, or delete content types in the `Content models` section on Contentstack.
2. Update your local type definitions by running `csdx tsgen -a "delivery token alias" -o "app/@types/generated/contentstack/generated.d.ts"` in the project directory. Please read [Requirements for types generation](#requirements-for-types-generation)
3. Create or update an API endpoint in `app/contentstack/index.server.ts` to fetch the data you've generated and return it in the format you want.

- For example, a piece of content with the type of "article" might be retrieved using the method `getArticleBySlug()`

4. In a route, fetch the data in a loader function to be passed to the component.

5. Access the server-loaded data using `useLoaderData()` in the component.
   - We've created some very basic integrated components in `app/contentstack/components`.

## Requirements for types generation

To generate types from Contentstack content types, you need to install the `fork-contentstack-cli-tsgen` plugin. To do so, follow these steps:

### Install contentstack-cli globally

```bash
npm install -g contentstack-cli
```
### Install fork-contentstack-cli-tsgen plugin

```bash
csdx plugins:install fork-contentstack-cli-tsgen
```

#### Configure contentstack-cli to use the plugin

- Set the region in which your stack is created.
  (EU for Europe, AZURE-NA for Azure North America and NA for North America)

```bash
sdx config:set:region NA
```

Login to your Contentstack account

```bash
csdx auth:login
```
Add a token alias for your stack (You will need to add the Delivery Token, an alias, the api key, the token and the environment name)

```bash
csdx auth:tokens:add
```

### Generate types

Open a terminal and navigate to your dash project folder, and run the following command:

```bash
csdx tsgen -a "delivery token alias" -o "app/@types/generated/contentstack/generated.d.ts"
```

And your done, you can now import the types in your code.

