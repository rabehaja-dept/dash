import { MetaFunction } from "@remix-run/node";
import { PaymentProcessing } from "~/commercetools/components/PaymentProcessing";

export const meta: MetaFunction = () => {
  return {
    title: "Processing Payment...",
  };
};

export default function Processing() {
  return (
    <section>
      <PaymentProcessing />
    </section>
  );
}
