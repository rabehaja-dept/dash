import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const StripeProvider = ({
  stripePublishableKey,
  children,
  clientSecret,
}: {
  stripePublishableKey: string;
  children: React.ReactNode;
  clientSecret: string;
}) => {
  const stripePromise = loadStripe(stripePublishableKey);
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
