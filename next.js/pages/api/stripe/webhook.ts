import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { addStripeTransactionToPayment } from "~/commercetools/payment.server";
import {
  changeOrderPaymentState,
  changeOrderState,
} from "~/commercetools/order.server";

const apiVersion = "2022-11-15"; //STRIPE_API_VERSION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: apiVersion,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers["stripe-signature"] || "";

  let event: Stripe.Event;

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks);
  const payload = rawBody.toString();
  console.log(payload);

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret || ""
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  let commerceToolsOrderId: string | undefined;
  let commerceToolsPaymentId: string | undefined;

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
        return handleMetadataError(res);
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
        return handleMetadataError(res);
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

  return res.status(200).json({ success: true });
}

function handleMetadataError(res: NextApiResponse) {
  console.error("No associated CommerceTools metadata found");
  return res
    .status(400)
    .json({ message: `No associated CommerceTools metadata` });
}
