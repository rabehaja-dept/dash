import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  createStripePaymentIntent,
  createCheckoutSession,
} from "~/stripe/index.server";
import { StripeProvider, StripeCheckout } from "~/stripe/components";
import { getEnv } from "~/config";
import {
  createStripePaymentInCommercetools,
  addStripeTransactionToPayment,
} from "~/commercetools/api/payment.server";
import {
  addPaymentToOrder,
  createOrderFromMyCart,
} from "~/commercetools/api/order.server";
import { getActiveCart } from "~/commercetools/api/cart.server";
import { Cart, LineItem } from "@commercetools/platform-sdk";
import { i18n } from "~/i18n.server";
import { CheckoutInformation } from "~/commercetools/components/CheckoutInformation";
import { useTranslation } from "react-i18next";

export type LoaderData = {
  cart: Cart | null;
  clientSecret: string;
  sessionId: string;
  returnUrl: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const cart = await getActiveCart(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  const { currencyCode, centAmount } = cart.totalPrice;

  // Create an order in Commercetools
  const order = await createOrderFromMyCart(cart, request);

  if (!order) {
    throw new Error("Could not create order");
  }

  const summary = cart.lineItems
    .map((item: LineItem) => item.name[locale])
    .join(", ");

  const returnUrl =
    getEnv("PUBLICLY_AVAILABLE_ORIGIN") +
    `/commercetools/orders/stripe/${order.id}`;

  // Create a payment in CommerceTools
  const payment = await createStripePaymentInCommercetools({
    request,
    centAmount,
    currencyCode,
  });

  // Create a Stripe Payment Intent with the order amount and currency
  const stripePaymentIntent = await createStripePaymentIntent({
    amount: centAmount,
    currency: currencyCode,
    metadata: {
      summary,
      commerceToolsCartId: cart.id,
      commerceToolsOrderId: order.id,
      commerceToolsPaymentId: payment.id,
    },
  });

  const { id } = await createCheckoutSession({
    line_items: cart.lineItems.map((item: LineItem) => ({
      price_data: {
        currency: currencyCode,
        product_data: {
          name: item.name[locale],
          description: item.name[locale],
        },
        unit_amount: item.price.value.centAmount,
      },
      quantity: item.quantity,
    })),
    metadata: { summary },
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: cart.customerEmail,
    success_url:
      getEnv("PUBLICLY_AVAILABLE_ORIGIN") +
      `/commercetools/orders/stripe/${order.id}`,
    cancel_url:
      getEnv("PUBLICLY_AVAILABLE_ORIGIN") +
      "/commercetools/orders/stripe/cancel",
  });

  const { client_secret } = stripePaymentIntent;
  // Add pending payment to CT order
  await addStripeTransactionToPayment(
    "Authorization",
    payment.id,
    stripePaymentIntent
  );
  // Add payment to order
  await addPaymentToOrder(order.id, payment, request);

  return {
    cart,
    clientSecret: client_secret || "",
    sessionId: id, // For Hosted Checkout, not used in this example
    returnUrl,
  };
};

export default function StripeCheckoutPage() {
  const { cart, clientSecret, returnUrl } = useLoaderData();
  const { t } = useTranslation("commercetools");

  return (
    <>
      <CheckoutInformation cart={cart} />
      <div className="mt-4 lg:mt-8">
        <h2 className="text-body-lg font-bold">Payment</h2>
        <p className="mb-4 text-body-sm text-text-weak">
          {t("All transactions are processed securely by Stripe.")}
        </p>

        <StripeProvider clientSecret={clientSecret}>
          <div className="grid grid-cols-2">
            <div className="col-span-2">
              <StripeCheckout
                clientSecret={clientSecret}
                returnUrl={returnUrl}
              />
            </div>
          </div>
        </StripeProvider>
      </div>
    </>
  );
}
