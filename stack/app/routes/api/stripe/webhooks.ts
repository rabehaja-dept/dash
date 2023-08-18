import Stripe from "stripe";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEnv } from "~/config";
import { addStripeTransactionToPayment } from "~/commercetools/api/payment.server";
import {
  changeOrderPaymentState,
  changeOrderState,
} from "~/commercetools/api/order.server";

export const action = async ({ request }: ActionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
    // @ts-ignore
    apiVersion: getEnv("STRIPE_API_VERSION", { default: null }),
  });

  const endpointSecret = getEnv("STRIPE_WEBHOOK_SECRET");
  const signature = request.headers.get("stripe-signature") || "";
  const payload = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    return json({ message: `Webhook Error: ${err}` }, 400);
  }

  let commerceToolsOrderId: string | undefined;
  let commerceToolsPaymentId: string | undefined;

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const succeededEvent = event.data.object as Stripe.PaymentIntent;

      const stripeSucceededPaymentIntent = await stripe.paymentIntents.retrieve(
        succeededEvent.id
      );

      commerceToolsOrderId =
        stripeSucceededPaymentIntent.metadata.commerceToolsOrderId;

      commerceToolsPaymentId =
        stripeSucceededPaymentIntent.metadata.commerceToolsPaymentId;

      if (!commerceToolsOrderId && commerceToolsPaymentId) {
        return handleMetadataError();
      }
      /**
       * 1. Update the order payment state to "Paid"
       * 2. Add a transaction to the payment
       * 3. Update the order state to "Confirmed"
       * 4. Up to you!
       */
      await changeOrderPaymentState(commerceToolsOrderId, "Paid");
      await addStripeTransactionToPayment(
        "Charge",
        commerceToolsPaymentId,
        stripeSucceededPaymentIntent
      );
      await changeOrderState(commerceToolsOrderId, "Confirmed");

      break;
    case "payment_intent.payment_failed":
      const failedEvent = event.data.object as Stripe.PaymentIntent;
      const stripeFailedPaymentIntent = await stripe.paymentIntents.retrieve(
        failedEvent.id
      );

      commerceToolsOrderId =
        stripeFailedPaymentIntent.metadata.commerceToolsOrderId;

      commerceToolsPaymentId =
        stripeFailedPaymentIntent.metadata.commerceToolsPaymentId;

      if (!commerceToolsOrderId && commerceToolsPaymentId) {
        return handleMetadataError();
      }
      // Update CommerceTools to show the payment was successful
      await changeOrderPaymentState(
        stripeFailedPaymentIntent.metadata.commerceToolsOrderId,
        "CancelAuthorization"
      );
      await addStripeTransactionToPayment(
        "CancelAuthorization",
        commerceToolsPaymentId,
        stripeFailedPaymentIntent
      );
      await changeOrderState(commerceToolsOrderId, "Open");
      break;
    case "invoice.payment_succeeded":
      const invoicePaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event invoice.payment_succeeded
      break;
    case "subscription_schedule.canceled":
      const subscriptionScheduleCanceled = event.data.object;
      // Then define and call a function to handle the event subscription_schedule.canceled
      break;
    case "invoice.upcoming":
      const invoiceUpcoming = event.data.object;
      // Then define and call a function to handle the event invoice.upcoming
      break;
    case "charge.captured":
      const chargeCaptured = event.data.object;
      // Then define and call a function to handle the event charge.captured
      break;
    // ... handle other event types
    default:
      console.info(`Unhandled event type ${event.type}`);
  }

  return json({ success: true }, 200);
};

function handleMetadataError() {
  console.error("No associated CommerceTools metadata found");
  return json(
    {
      message: `No associated CommerceTools metadata`,
    },
    400
  );
}
