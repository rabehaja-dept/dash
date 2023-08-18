## Commercetools setup

To get started with the DASH Commercetools setup, you will need to set up some external services:

### Required

- **A Commercetools account and a project.** You can do this by following the [official documentation](https://docs.commercetools.com/getting-started/explore-merchant-center).
- **A payment processor.** Since Commercetools does not have a built-in payment processor like Shopify, an [Adyen](https://www.adyen.com/) or [Stripe](https://stripe.com/) account is required. We support both processors, but choose only one of them. Once you've chosen a payment processor, follow the setup guide for that processor:
  - [Adyen Setup guide](../adyen/)
  - [Stripe Setup guide](../stripe/)

### Optional

- If you wish to enable transactional emails for order confirmations and user registrations, we have a built-in integration with [Sendgrid](https://app.sendgrid.com/). You can sign up for an account [here](https://signup.sendgrid.com/). Once you've set up your account, follow the setup guide for Sendgrid:
  - [Sendgrid Setup guide](../sendgrid/)

## Configuration

For Commercetools to work with DASH, you need a set of API clients in Commercetools and set up the environment variables in the `.env` file. Besides this, some additional packages like SendGrid require API Extensions to be set up in Commercetools. Templates for these extensions can be found in the `stack/commercetools` folder.

### Environment variables

DASH requires two API clients. One administrator client and one for the frontend. The admin client has more permissions than the frontend client, as the admin client is used to create orders, update the cart, and manage the user accounts. The frontend client is used to fetch products, categories, and other data. The frontend client is also used to create session tokens for the user, which only have limited permissions.

#### Admin client

1. Navigate to Settings -> Developer Settings -> API Clients
2. Click "Create new API client"
3. Call this client something like "DASH (ADMIN)"
4. Set the scopes to "Admin client". This should automatically select all the required scopes for this client.
5. Click "Create API client" and it will show you the client ID, secret, scopes, api url, auth url and project key. Copy these values into the `.env` file into the following fields. **Note:** Make sure the scopes have quotes around them, since the scopes contain spaces.

```bash
export COMMERCETOOLS_PROJECT_KEY=
export COMMERCETOOLS_API_URL=
export COMMERCETOOLS_AUTH_URL=
export COMMERCETOOLS_CLIENT_ID=
export COMMERCETOOLS_SECRET=
export COMMERCETOOLS_SCOPES=""
```

#### Frontend client

1. Navigate to Settings -> Developer Settings -> API Clients
2. Click "Create new API client"
3. Call this client something like "DASH (WEB)"
4. Set the scopes to "Mobile & single-page application client". This should automatically select all the required scopes for this client.
5. Click "Create API client" and it will show you the client ID, secret, scopes, api url, auth url and project key. Copy these values into the `.env` file into the following fields. **Note:** Make sure the scopes have quotes around them, since the scopes contain spaces. **Note2:** The project key, api url and auth url are reused from the admin client and therefore do not need to be added again.

```bash
export COMMERCETOOLS_WEB_CLIENT_ID=
export COMMERCETOOLS_WEB_SECRET=
export COMMERCETOOLS_WEB_SCOPES=""
```

### Further configuration

To start extending the functionality of Commercetools, check out the [Commercetools Extensions](extensions.md) guide.

For payment setup, check out the [Payments](./payments.md) guide.
