# DASH™ + Next.js + Shopify

## Getting started

To get started, you'll need to create a new Shopify store. You can do this by visiting [https://www.shopify.com/](https://www.shopify.com/) and clicking "Start free trial" or using an existing store.

Once you've created your store, you'll need to add the required environment variables to your `.envrc` file.

```bash
export NEXT_PUBLIC_SHOPIFY_STORE=...;
export NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
export NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION=...
```

You can find the values for these variables in your Shopify dashboard. Navigate to "Settings" > "Sales Channels" > "Online Store" > "Storefront API". You'll need to generate a Storefront access token and set the API version to whatever the latest version is.

### Adding products

Once you've created your store, you'll need to add some products. You can do this by navigating to "Products" > "All products" and clicking "Add product".
