import { useEffect } from "react";
import AdyenCheckout from "@adyen/adyen-web";

export type CheckoutProps = {
  config: any;
};

export function Checkout({ config }: CheckoutProps) {
  useEffect(() => {
    async function init() {
      const checkout = await AdyenCheckout(config);
      checkout.create("dropin").mount("#drop-in-container");
    }
    init();
  });

  return (
    <div>
      <div id="drop-in-container" />
    </div>
  );
}
