import { useRef } from "react";
import { MiniCartLineItem } from "./MiniCartLineItem";
import { Cart, LineItem } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";

export type CartDetailsProps = {
  cart: Cart;
  locale: string;
};

export function CartDetails({ cart, locale }: CartDetailsProps) {
  const { id, version, lineItems } = cart;
  const currencyCode = cart?.totalPrice?.currencyCode;
  const scrollRef = useRef(null);
  const { t } = useTranslation("commercetools");

  if (!lineItems?.length) {
    return (
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{t("Your cart is empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <section ref={scrollRef} aria-labelledby="cart-contents">
      <ul className="grid gap-4">
        {lineItems.map((line: LineItem) => (
          <MiniCartLineItem
            key={line.id}
            cartId={id}
            cartVersion={version}
            currencyCode={currencyCode}
            line={line}
            locale={locale}
          />
        ))}
      </ul>
    </section>
  );
}
