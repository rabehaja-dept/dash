import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("commercetools");
  return (
    <div className={`${className}`}>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        {t("Quantity")}, {quantity}
      </label>
      <div className="flex items-center justify-center">
        <Form method="post">
          <input
            type="hidden"
            name="quantity"
            defaultValue={JSON.stringify({
              lineId,
              cartId,
              cartVersion,
              quantity: quantity - 1,
            })}
          />
          <button
            className="border-1 text-md hover:bg-background flex h-6 w-6 items-center justify-center border border-black transition disabled:cursor-wait"
            aria-label="Decrease quantity"
            type="submit"
          >
            &#8722;
          </button>
        </Form>
        <div className="text-md mx-1 flex h-6 w-6 cursor-default items-center justify-center bg-black text-white">
          {quantity}
        </div>
        <Form method="post">
          <input
            type="hidden"
            name="quantity"
            defaultValue={JSON.stringify({
              lineId,
              cartId,
              cartVersion,
              quantity: quantity + 1,
            })}
          />
          <button
            className="border-1 text-md hover:bg-background flex h-6 w-6 items-center justify-center border border-black transition disabled:cursor-wait"
            aria-label="Increase quantity"
            type="submit"
          >
            &#43;
          </button>
        </Form>
        {showRemoveButton && (
          <Form method="post">
            <input
              type="hidden"
              name="remove"
              defaultValue={JSON.stringify({ lineId, cartId, cartVersion })}
            />
            <button
              type="submit"
              className="ml-4 flex items-center text-[12px] underline"
            >
              {t("Remove")}
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
