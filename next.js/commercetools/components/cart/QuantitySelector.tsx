import axios from "axios";
import { useCommercetoolsCart } from "~/commercetools/context/CommercetoolsCartContext";
import { motion } from "framer-motion";

export type QuantitySelectorProps = {
  lineId: string;
  cartId: string;
  cartVersion: number;
  quantity: number;
  showRemoveButton?: boolean; // shows/hides the "remove" text button.
  className?: string;
};

export function QuantitySelector({
  cartId,
  cartVersion,
  lineId,
  quantity,
  showRemoveButton = true,
  className = "",
}: QuantitySelectorProps) {
  const { cart, setCart } = useCommercetoolsCart();

  return (
    <div
      className={`${className}`}
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.post(
              "/api/commercetools/cart/updateCartById",
              {
                cartId,
                version: cartVersion,
                actions: [
                  {
                    action: "changeLineItemQuantity",
                    lineItemId: lineId,
                    quantity: quantity - 1,
                  },
                ],
              }
            );
            setCart(response.data.response);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <button aria-label="Decrease quantity" type="submit">
          &#8722;
        </button>
      </form>

      <motion.div
        key={quantity}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {quantity}
      </motion.div>

      {/* form for increasing quantity */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.post(
              "/api/commercetools/cart/updateCartById",
              {
                cartId,
                version: cartVersion,
                actions: [
                  {
                    action: "changeLineItemQuantity",
                    lineItemId: lineId,
                    quantity: quantity + 1,
                  },
                ],
              }
            );
            setCart(response.data.response);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <button type="submit">&#43;</button>
      </form>

      {/* form for removing item */}
      {showRemoveButton && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post(
                "/api/commercetools/cart/updateCartById",
                {
                  cartId,
                  version: cartVersion,
                  actions: [
                    {
                      action: "removeLineItem",
                      lineItemId: lineId,
                    },
                  ],
                }
              );
              setCart(response.data.response);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <button
            type="submit"
            style={{
              marginLeft: "10px",
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            Remove
          </button>
        </form>
      )}
    </div>
  );
}
