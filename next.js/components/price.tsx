import { TypedMoney } from "@deptdash/commercetools";
import { motion } from "framer-motion";

export type PriceProps = {
  price: TypedMoney | null;
  locale: string;
  className?: string;
};

const defaultCurrencyCode = "USD";

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
  return (
    <motion.div
      key={formattedAmount(price)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {formattedAmount(price)}
    </motion.div>
  );
};
