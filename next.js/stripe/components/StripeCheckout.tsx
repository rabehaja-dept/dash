import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "./stripe.module.css";

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
    if (!stripe || !clientSecret) {
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
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Something went wrong.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <PaymentElement id="payment-element" options={{ layout: "auto" }} />
      <div className={styles.buttonContainer}>
        <button
          className={styles.submitButton}
          disabled={isLoading || !stripe || !elements}
          type="submit"
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>
      </div>
      {message && (
        <div id="payment-message" className={styles.message}>
          {message}
        </div>
      )}
    </form>
  );
};
