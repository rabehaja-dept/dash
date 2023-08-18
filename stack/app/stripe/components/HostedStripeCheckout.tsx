import { Button } from "~/components/interactive";
import { useStripe } from "@stripe/react-stripe-js";

export type HostedStripeCheckoutProps = {
  sessionId: string;
};

export const HostedStripeCheckout = ({
  sessionId,
}: HostedStripeCheckoutProps) => {
  const stripe = useStripe();

  const goCheckout = async () => {
    if (!stripe) {
      console.error("Stripe not loaded");
      return;
    }
    await stripe.redirectToCheckout({
      sessionId,
    });
  };

  return (
    <Button variant="primary" onClick={goCheckout}>
      Checkout
    </Button>
  );
};
