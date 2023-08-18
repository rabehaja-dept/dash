## Frequently asked questions

### How do user accounts work?

When a user creates a Commercetools account in DASH, we're creating a customer in Commercetools and storing the user's information there.

The current user flow is simplified, meaning that there is no email address confirmation flow, nor a password reset flow. Currently, a user has to be logged in to complete the checkout flow.

### How do I deal with different currencies?

The currencies shown in the store are determined by the currency of a user's cart. If a user has a cart with a currency, that currency will be used. If a user does not have a cart, the currency will be determined by the `defaultCurrency` in the `i18n-config.ts` file.

We currently set the currency of a cart using the `defaultCurrency` in the `i18n-config.ts` file. **You'll probably want to change this setup.** You can do so by creating a custom middleware that sets the currency of a cart based on the user's location and checking that against the currencies you support.
