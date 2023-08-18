import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "~/components/interactive";

export type StripeCheckoutProps = {
  clientSecret: string;
  returnUrl: string;
};

export const StripeCheckout = ({
  clientSecret,
  returnUrl,
}: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        default:
          setMessage("");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Something went wrong.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    // Stripe handles errors and validation
    <form onSubmit={handleSubmit} className="border border-border p-4">
      <PaymentElement id="payment-element" options={{ layout: "auto" }} />
      <div className="flex justify-end">
        <Button
          className="mt-8"
          disabled={isLoading || !stripe || !elements}
          type="submit"
        >
          {isLoading ? "Processing..." : "Pay now"}
        </Button>
      </div>

      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="mt-4">
          {message}
        </div>
      )}
    </form>
  );
};
