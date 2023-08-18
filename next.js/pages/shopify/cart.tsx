import {
  CartLineProvider,
  CartCheckoutButton,
  useCart,
  CartCost,
} from "@shopify/hydrogen-react";
import CartItem from "~/shopify/components/CartItem";

export default function Cart() {
  const { lines } = useCart();

  return (
    <>
      <h1>Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Style</th>
            <th>Quantity</th>
            <th>Price Each</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <CartLineProvider key={line.id} line={line}>
              <CartItem />
            </CartLineProvider>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td>
              <CartCheckoutButton>Checkout Now</CartCheckoutButton>
            </td>
            <td></td>
            <td>Grand Total:</td>
            <td>
              <strong>
                <CartCost />
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
