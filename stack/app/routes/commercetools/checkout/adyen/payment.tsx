import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getActiveCart } from "~/commercetools/api/cart.server";
import { createPaymentSession } from "~/commercetools/adyen/payment";
import { getEnv } from "~/config";
import { Checkout } from "~/commercetools/adyen/components/checkout.client";
import { Suspense } from "react";

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const cart = await getActiveCart(request);

  if (!cart) {
    throw new Error("Something went wrong loading CommerceTools.");
  }

  const paymentSession = await createPaymentSession(cart.id);

  const configuration = {
    environment: "test",
    clientKey: getEnv("ADYEN_CLIENT_KEY"),
    analytics: {
      enabled: false, // Set to false to not send analytics data to Adyen.
    },
    session: {
      id: paymentSession.id, // Unique identifier for the payment session.
      sessionData: paymentSession.session_data, // The payment session data.
    },
    onPaymentCompleted: (result: any, component: any) => {
      console.log(result, component);
    },
    onError: (
      error: { name: any; message: any; stack: any },
      component: any
    ) => {
      console.error(error.name, error.message, error.stack, component);
    },
    // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
    paymentMethodsConfiguration: {
      card: {
        hasHolderName: true,
        holderNameRequired: true,
        billingAddressRequired: true,
      },
    },
  };

  return configuration;
};

export default function AdyenCheckoutPage() {
  const config = useLoaderData<any>();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h2 className="text-body-lg font-bold">Payment</h2>
      <p className="mb-4 text-body-sm text-text-weak">
        All transactions are processed securely by Adyen.
      </p>
      <div className="grid grid-cols-2">
        <div className="col-span-2">
          <Checkout config={config} />
        </div>
      </div>
    </Suspense>
  );
}
