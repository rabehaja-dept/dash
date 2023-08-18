## Commercetools Extensions

Commercetools allows you to extend the functionality of the platform by using API Extensions. These extensions allow you to listen to events and perform actions when a specific event occurs. For example, you can listen to the `OrderCreated` event and send an email to the customer when an order is created. These extensions cannot be configured in merchant center and therefore have to be created via the API.

Check out the [Commercetools API Extensions](https://docs.commercetools.com/api/projects/api-extensions) documentation for more details.

### Sendgrid

To send transactional emails to customers (order confirmations, etc.), we've set up a Sendgrid integration.

To start using the Sendgrid API extension, follow these steps:

1. Make sure the step to add the admin client is completed. We reuse these env vars to set up other API Extensions.
2. Follow the steps in the [Sendgrid Setup guide](../sendgrid/) to set up the environment variables.
3. Add a new environment variable called `COMMERCETOOLS_HTTP_EXTENSION_SECRET`. This is a secret that is used to authenticate the incoming calls from the Commercetools API Extensions.
4. Navigate to the `stack/commercetools` folder.
5. Run `npm run commercetools:setup` to create the extensions in your Commercetools project.

These extensions are triggered when a customer is created and when an order is created. These events trigger Sendgrid to send out the respective transactional emails! For more information regarding the email templates, please refer to the [Sendgrid Setup guide](../sendgrid/).
