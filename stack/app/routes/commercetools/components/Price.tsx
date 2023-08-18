/**
 * Why create this from scratch?
 * We can't access the internationalization context from the Shopify / Hydrogen context.
 */

import { ProductVariant } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";
import { defaultCurrencyCode } from "~/i18n-config";

export type PriceProps = {
  activeVariant: ProductVariant | undefined;
};

export const Price = ({ activeVariant }: PriceProps) => {
  const { i18n } = useTranslation();
  const price = activeVariant?.prices?.[0];
  const currencyCode = price?.value.currencyCode;

  const formattedAmount = (amount: string | number): string => {
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      style: "currency",
      currency: currencyCode || defaultCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: price?.value.fractionDigits || 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  return price?.value.centAmount ? (
    <h1>{formattedAmount(price?.value.centAmount / 100)}</h1>
  ) : null;
};
