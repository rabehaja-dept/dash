import { Button } from "~/components/interactive/Button";
import { QuantitySelector } from "./QuantitySelector";
import { CartItem } from "./CartItem";
import { Price } from "./Price";
import {
  useCart,
  CartLineProvider,
  CartCheckoutButton,
} from "@shopify/hydrogen";

export default function Cart() {
  const { cost, lines } = useCart();

  return (
    <section>
      <div className="my-10">
        <h2>My Cart</h2>
      </div>
      {lines?.length > 0 ? (
        <div className="grid grid-cols-12 gap-x-6">
          {/* Table of items in the cart & quantities */}
          <table className="col-span-12 table-auto outline outline-1 outline-border-weak lg:col-span-9">
            <thead>
              <tr>
                <th className="p-4 text-left">Product</th>
                {/**
                 * Hide Quantity and total columns on smaller screens &
                 * stack other options inside the product column
                 */}
                <th className="hidden p-4 text-left md:table-cell">Quantity</th>
                <th className="hidden p-4 text-right md:table-cell">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => {
                return (
                  <CartLineProvider key={line.id} line={line}>
                    <tr key={i} className="border-t border-border-weak">
                      <td className="p-4">
                        <CartItem />
                      </td>

                      <td className="flex items-center justify-center p-4 text-center md:table-cell">
                        <QuantitySelector
                          className="hidden md:table-cell"
                          lineId={line.id}
                          quantity={line.quantity}
                          showRemoveButton={true}
                        />
                      </td>

                      <td className="hidden p-4 text-right md:table-cell">
                        <Price
                          amount={
                            parseFloat(line.merchandise.priceV2.amount) *
                            line.quantity
                          }
                          currencyCode={line.merchandise.priceV2.currencyCode}
                          className="text-md font-bold"
                        />
                      </td>
                    </tr>
                  </CartLineProvider>
                );
              })}
            </tbody>
          </table>

          {/* Total & Checkout Button */}
          <aside className="relative col-span-12 mt-6 lg:col-span-3 lg:mt-0">
            <div className="sticky top-4">
              <h3 className="flex justify-between text-lg font-bold">
                <span>Sub Total:</span>
                <Price
                  amount={cost?.subtotalAmount.amount || "0"}
                  currencyCode={cost?.subtotalAmount.currencyCode || "USD"}
                  className="text-md font-bold"
                />
              </h3>
              <p>Taxes and shipping calculated at checkout</p>
              <CartCheckoutButton className="mt-4 w-full">
                <Button variant="primary" block as="div">
                  Checkout
                </Button>
              </CartCheckoutButton>
            </div>
          </aside>
        </div>
      ) : (
        <div>Your cart is empty</div>
      )}
    </section>
  );
}
