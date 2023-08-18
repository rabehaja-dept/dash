import {
  useCart,
  CartLineQuantityAdjustButton,
  CartLineQuantity,
} from "@shopify/hydrogen";

import { Link } from "~/components/interactive/Link";

export type QuantitySelectorProps = {
  lineId: string;
  quantity: number;
  showRemoveButton?: boolean; // shows/hides the "remove" text button.
  className?: string;
};

export function QuantitySelector({
  lineId,
  quantity,
  showRemoveButton = true,
  className = "",
}: QuantitySelectorProps) {
  const { linesRemove } = useCart();

  return (
    <div className={`${className}`}>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center justify-center">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="border-1 text-md hover:bg-background flex h-6 w-6 items-center justify-center border border-black transition disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity
          as="div"
          className="text-md mx-1 flex h-6 w-6 cursor-default items-center justify-center bg-black text-white"
        />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="border-1 text-md hover:bg-background flex h-6 w-6 items-center justify-center border border-black transition disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
        {showRemoveButton && (
          <Link
            to="#"
            variant="dark"
            as="button"
            underlined
            onClick={() => linesRemove([lineId])}
            className="ml-4 flex items-center text-[12px]"
          >
            Remove
          </Link>
        )}
      </div>
    </div>
  );
}
