import { STRIPE_PUBLISHABLE_KEY } from "~/config";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const StripeProvider = ({
  children,
  clientSecret,
}: {
  children: React.ReactNode;
  clientSecret: string;
}) => {
  const options = {
    // passing the client secret obtained from the server
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
