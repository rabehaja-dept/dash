import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getActiveCart } from "~/commercetools/cart.server";
import { LineItem } from "@deptdash/commercetools";
import {
  addPaymentToOrder,
  createOrderFromMyCart,
} from "~/commercetools/order.server";
import {
  addStripeTransactionToPayment,
  createStripePaymentInCommercetools,
} from "~/commercetools/payment.server";
import {
  createCheckoutSession,
  createStripePaymentIntent,
} from "~/stripe/index.server";
import { CheckoutInformation } from "~/commercetools/components/checkout/CheckoutInformation";
import styles from "./payment.module.css";
import { StripeProvider, StripeCheckout } from "~/stripe/components";
import Checkout from "~/layouts/commercetools/checkout-layout";
import { useCommercetoolsCart } from "~/commercetools/context/CommercetoolsCartContext";

export default function StripeCheckoutPage({
  myCart,
  clientSecret,
  sessionId,
  stripeOrderUrl,
  stripePublishableKey,
}) {
  const { cart, setCart } = useCommercetoolsCart();
  setCart(myCart);
  return (
    <Checkout>
      <CheckoutInformation cart={cart} />
      <div className={styles.paymentContainer}>
        <h2 className={styles.title}>Payment</h2>
        <p className={styles.subtitle}>
          All transactions are processed securely by Stripe.
        </p>

        <StripeProvider
          stripePublishableKey={stripePublishableKey}
          clientSecret={clientSecret}
        >
          <div className={styles.gridContainer}>
            <div className={styles.stripeElement}>
              <StripeCheckout
                clientSecret={clientSecret}
                returnUrl={stripeOrderUrl}
              />
            </div>
          </div>
        </StripeProvider>
      </div>
    </Checkout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cart = await getActiveCart(
    context.req as NextApiRequest,
    context.res as NextApiResponse
  );
  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }
  const { currencyCode, centAmount } = cart.totalPrice;

  // Create an order in Commercetools
  const order = await createOrderFromMyCart(
    context.req as NextApiRequest,
    context.res as NextApiResponse,
    cart.id
  );

  if (!order) {
    throw new Error("Could not create order");
  }

  const summary = cart.lineItems
    .map((item: LineItem) => item.name[context.locale])
    .join(", ");

  const stripeOrderUrl = `${process.env.PUBLICLY_AVAILABLE_ORIGIN}/commercetools/orders/stripe/${order?.id}`;
  const payment = await createStripePaymentInCommercetools({
    req: context.req as NextApiRequest,
    res: context.res as NextApiResponse,
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
          name: item.name[context.locale],
          description: item.name[context.locale],
        },
        unit_amount: item.price.value.centAmount,
      },
      quantity: item.quantity,
    })),
    metadata: { summary },
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: cart.customerEmail,
    success_url: stripeOrderUrl,
    cancel_url: `${process.env.PUBLICLY_AVAILABLE_ORIGIN}/commercetools/orders/stripe/cancel`,
  });
  const { client_secret } = stripePaymentIntent;
  // Add pending payment to CT order
  await addStripeTransactionToPayment(
    "Authorization",
    payment.id,
    stripePaymentIntent
  );
  // Add payment to order
  await addPaymentToOrder(
    context.req as NextApiRequest,
    context.res as NextApiResponse,
    order.id,
    payment
  );
  return {
    props: {
      myCart: cart,
      clientSecret: client_secret || "",
      sessionId: id, // For Hosted Checkout, not used in this example
      stripeOrderUrl,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  };
};
