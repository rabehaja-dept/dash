import { Cart } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";
import { Price } from "~/commercetools/components/Price";

export type CartTotalPriceProps = {
  locale: string;
  cart: Cart;
};

export function CartTotalPrice({ locale, cart }: CartTotalPriceProps) {
  const total = cart?.totalPrice;
  const shippingAmount = cart?.shippingInfo?.price;
  const includedTax = cart?.taxedPrice?.totalTax;
  const { t } = useTranslation("commercetools");

  return (
    <div className="grid grid-cols-2 gap-y-4">
      <div className="col-span-1">
        <span>{t("Included Tax")}</span>
      </div>
      <div className="col-span-1 text-right">
        <span>
          {includedTax ? (
            <Price
              price={includedTax}
              locale={locale}
              className="text-text-weak"
            />
          ) : (
            <span>-</span>
          )}
        </span>
      </div>
      <div className="col-span-1">
        <span>{t("Shipping")}</span>
      </div>
      <div className="col-span-1 text-right">
        <span>
          {shippingAmount ? (
            <Price price={shippingAmount} locale={locale} />
          ) : (
            <span>-</span>
          )}
        </span>
      </div>
      <div className="col-span-1 text-title-sm">
        <span className="font-bold">Total</span>
      </div>
      <div className="col-span-1 text-right text-title-sm font-bold">
        <span>
          <Price price={total} locale={locale} />
        </span>
      </div>
    </div>
  );
}
