import type { MetaFunction } from "@remix-run/node";
import Cart from "~/shopify/components/Cart";

export const meta: MetaFunction = () => ({
  title: "Your Cart",
  description: "Purchase your products.",
});

export default function CartRoute() {
  return (
    <section className="mx-10 my-10">
      <Cart />
    </section>
  );
}
