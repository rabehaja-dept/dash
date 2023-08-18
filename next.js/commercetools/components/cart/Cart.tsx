import { Cart as CartType, LineItem } from "@deptdash/commercetools";
import Link from "next/link";
import { CartItem } from "~/commercetools/components/cart/CartItem";
import { QuantitySelector } from "~/commercetools/components/cart/QuantitySelector";
import { useCommercetoolsCart } from "~/commercetools/context/CommercetoolsCartContext";
import { Price } from "~/components/price";
import styles from "./cart.module.css";
import { motion } from "framer-motion";

const scaleUp = {
  hover: { scale: 1.05 },
};

export default function Cart() {
  const { cart, setCart } = useCommercetoolsCart();
  const lineItems = cart?.lineItems;
  const totalPrice = cart?.totalPrice;

  return (
    <section className={styles.cartSection}>
      <div>
        <h2 className={styles.cartHeading}>My Cart</h2>
      </div>
      {lineItems?.length > 0 ? (
        <div>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((line: LineItem, i: number) => {
                return (
                  <tr key={i}>
                    <td>
                      <CartItem
                        data={line}
                        cartId={cart.id}
                        cartVersion={cart.version}
                        locale={"en-US"}
                        language={""}
                      />
                    </td>

                    <td>
                      <QuantitySelector
                        cartId={cart.id}
                        lineId={line.id}
                        quantity={line.quantity}
                        showRemoveButton={true}
                        cartVersion={cart.version}
                      />
                    </td>

                    <td>
                      <Price price={line.totalPrice} locale={"en-US"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <aside className={styles.cartAside}>
            <div>
              <h3 className={styles.cartTotal}>
                <span>Subtotal:</span>
                <Price price={totalPrice} locale={"en-US"} />
              </h3>
              <p className={styles.cartNote}>
                Taxes and shipping calculated at checkout
              </p>
              <Link href="/commercetools/checkout">
                <motion.button
                  type="button"
                  className={styles.button}
                  whileHover="hover"
                  variants={scaleUp}
                >
                  Checkout
                </motion.button>
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div>Your cart is empty</div>
      )}
    </section>
  );
}
