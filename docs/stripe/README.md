## Stripe payment integration

We've included a Stripe integration for use with e-commerce platforms. This integration allows you to use Stripe to process payments for your purchases made on your site.

### Setup

#### Accounts

First, you need to create a Stripe account. You can do this by visiting [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register).

After you have created your Stripe account, you need to create a new API key. You can do this by visiting [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys). Once you've created the API key, add the `Secret Key` to your `.env` file as `STRIPE_SECRET_KEY`. You'll also need to set the `STRIPE_API_VERSION` to the correct version of the Stripe API. You can find the latest version of the Stripe API [here](https://stripe.com/docs/api).

Additionally, add the `Publishable key` to your site's `config.ts` file as the following variable:

```
STRIPE_PUBLISHABLE_KEY
```

> Note: DASH™ was written using the Stripe API version `2022-11-15`. If you're using a different version of the Stripe API, you may need to make code and package updates to ensure that DASH™ works correctly with your Stripe account.

#### Webhooks

Stripe communicates the status of payments to Commercetools using webhooks (server-to-server). So, you need to create a new webhook endpoint in the Stripe admin dashboard to communicate with Commercetools. You can do this by visiting [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks). You'll need to provide a URL to which Stripe can send the webhook requests. By default, this is set up as `https://<your-domain>/api/stripe/webhooks` - there's a `webhooks.ts` file that handles these requests. You can also use a different URL, but you'll need to set that up manually.

Once you've created the webhook endpoint, you'll need to add the `Signing Secret` to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

### Summary

After setup, your `.env` file should include the following variables:

```bash
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_API_VERSION
```

And your `config.ts` file should include the following variable:

```ts
STRIPE_PUBLISHABLE_KEY;
```
