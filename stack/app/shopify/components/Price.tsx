/**
 * Why create this from scratch?
 * We can't access the internationalization context from the Shopify / Hydrogen context.
 */

import { useTranslation } from "react-i18next";

export type PriceProps = {
  amount: string | number;
  currencyCode: string;
  className?: string;
};

export const Price = ({ amount, currencyCode, className }: PriceProps) => {
  const { i18n } = useTranslation();
  const formattedAmount = (amount: string | number): string => {
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      style: "currency",
      currency: currencyCode || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  return <div className={`${className}`}>{formattedAmount(amount)}</div>;
};
