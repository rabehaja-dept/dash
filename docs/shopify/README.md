## Shopify

DASH's Shopify implementation strives to provide full ecommerce functionality with two exceptions:

1. The checkout flow. We use the standard headless Shopify approach and redirect to hosted Shopify for checkout.
2. Order management. We recommend using a simple hosted Shopify theme for this on most projects, since it's generally not key to the conversion funnel and it saves significant development time.

On the technical side, there are two major pieces to the Shopify integration:

1. The [Shopify Hydrogen framework](https://hydrogen.shopify.dev/) for the majority of logic, such as Shopify API calls, adding things to the cart, redirecting to checkout, etc.
2. A set of out-of-the-box components to receive data from Hydrogen's hooks and render them. Some of this is taken from the Hydrogen sample store, and quite a bit is custom to DASH.

### Moving to your own Shopify store

Because all Shopify API calls are made from the frontend, we store all the keys in `app/config.ts` (it's okay for them to be public).

To move to your own store instance, edit `SHOPIFY_STORE` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` inside `app/config.ts`. That's it!
