# Adyen

We've included an Adyen integration for use with e-commerce platforms. This integration allows you to use Adyen to process payments for your purchases made on your site.

## Setup

To use the Adyen integration, you'll need to have an Adyen account. You can sign up for an Adyen test account [here](https://www.adyen.com/signup).

Once you have an Adyen account, you'll need to add your Adyen API keys to your site's configuration. You can set up an API key in the [Adyen dashboard](https://ca-test.adyen.com/ca/ca/config/api_credentials_new.shtml). In order to integrate the [Adyen Web Drop In](https://docs.adyen.com/online-payments/web-drop-in) you will also need to set the `Client Key`, which can be found in the credentials configuration under 'Client settings'. Here you'll be able to generate the key and also to add allowed origin, which in these case would be the public URL of the application.

After the API keys are set up, you'll also need to set up webhooks. Webhooks are a crucial part of the integration as it is the way Adyen sends automatic updates to our application. These webhooks can be set up in the [Webhooks Page](https://ca-test.adyen.com/ca/ca/config/showthirdparty.shtml). To ensure that the webhooks communicate with the application make sure that the server configuration URL is set to the public URL of the application followed by `/api/adyen/webhooks`.

Values to add to your site's `.envrc` configuration:

- `ADYEN_API_KEY`: The API key.
- `ADYEN_MERCHANT_ACCOUNT`: The merchant account that is tied to the API key.
- `ADYEN_ENVIRONMENT`: LIVE or TEST.
- `ADYEN_BASE_URL`: The endpoint to communicate with Adyen API.
- `ADYEN_LIVE_ENDPOINT_URL_PREFIX`: The live endpoint URL prefix.
- `ADYEN_CLIENT_KEY`: The key needed for client facing integrations (web drop-in, web components, mobile integrations and plugins)
