import { TypedMoney } from "@commercetools/platform-sdk";
import { defaultCurrencyCode } from "~/i18n-config";

export type PriceProps = {
  price: TypedMoney | null;
  locale: string;
  className?: string;
};

export const Price = ({ price, className, locale }: PriceProps) => {
  let value;

  if (!price) return <span>-</span>;

  const formattedAmount = (price: TypedMoney): string => {
    /**
     * Get price amount from key depending on one of possible types: 'centPrecision', 'highPrecision'
     */
    if (price?.type === "centPrecision") {
      value = price?.centAmount;
    } else if (price) {
      value = price?.preciseAmount;
    } else {
      value = 0;
    }

    value /= Math.pow(10, price?.fractionDigits || 0);
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: price?.currencyCode || defaultCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: price?.fractionDigits || 2,
    }).format(value);
  };
  return <div className={`${className}`}>{formattedAmount(price)}</div>;
};
