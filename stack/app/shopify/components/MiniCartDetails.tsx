import { useRef } from "react";
import { useCart, CartLineProvider } from "@shopify/hydrogen";
import { MiniCartLineItem } from "./MiniCartLineItem";

export function CartDetails() {
  const { lines } = useCart();
  const scrollRef = useRef(null);

  if (lines.length === 0) {
    return (
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <form>
      <section ref={scrollRef} aria-labelledby="cart-contents">
        <ul className="grid gap-4">
          {lines.map((line) => {
            return (
              <CartLineProvider key={line.id} line={line}>
                <MiniCartLineItem />
              </CartLineProvider>
            );
          })}
        </ul>
      </section>
    </form>
  );
}
