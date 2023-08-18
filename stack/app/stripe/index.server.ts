import Stripe from "stripe";
import { getEnv } from "~/config";

const STRIPE_SECRET_KEY = getEnv("STRIPE_SECRET_KEY");

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  // @ts-ignore
  apiVersion: getEnv("STRIPE_API_VERSION", { default: null }),
  maxNetworkRetries: 3,
});

export const createStripePaymentIntent = async ({
  amount,
  currency,
  metadata,
  customer,
}: {
  amount: number;
  currency: string;
  metadata?: {
    summary: string;
    commerceToolsCartId: string;
    commerceToolsOrderId: string;
    commerceToolsPaymentId: string;
  };
  customer?: string; // "External ID"
}): Promise<Stripe.PaymentIntent> => {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      customer,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  return paymentIntent;
};

export const getPaymentIntentById = async ({
  id,
}: {
  id: string;
}): Promise<Stripe.PaymentIntent> => {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(id);
  return paymentIntent;
};

export const createCustomer = async ({
  params,
}: {
  params: Stripe.CustomerCreateParams;
}): Promise<Stripe.Customer> => {
  const customer: Stripe.Customer = await stripe.customers.create(params);

  return customer;
};

export const createCheckoutSession = async (
  params: Stripe.Checkout.SessionCreateParams
): Promise<Stripe.Checkout.Session> => {
  const session: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  return session;
};

export const getSession = async ({ id }: { id: string }) => {
  const session = await stripe.checkout.sessions.retrieve(id);
  return session;
};
