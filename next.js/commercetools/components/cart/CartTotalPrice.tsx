import { Cart } from "@deptdash/commercetools";
import { Price } from "~/components/price";
import styles from "./cartTotalPrice.module.css";

export type CartTotalPriceProps = {
  locale: string;
  cart: Cart;
};

export function CartTotalPrice({ locale, cart }: CartTotalPriceProps) {
  const total = cart?.totalPrice;
  const shippingAmount = cart?.shippingInfo?.price;
  const includedTax = cart?.taxedPrice?.totalTax;

  return (
    <div className={styles.container}>
      <div className={styles.colSpan1}>
        <span>"Included Tax"</span>
      </div>
      <div className={`${styles.colSpan1} ${styles.textRight}`}>
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
      <div className={styles.colSpan1}>
        <span>"Shipping"</span>
      </div>
      <div className={`${styles.colSpan1} ${styles.textRight}`}>
        <span>
          {shippingAmount ? (
            <Price price={shippingAmount} locale={locale} />
          ) : (
            <span>-</span>
          )}
        </span>
      </div>
      <div className={`${styles.textTitleSm} ${styles.colSpan1}`}>
        <span className={styles.fontBold}>Total</span>
      </div>
      <div
        className={`${styles.textTitleSm} ${styles.colSpan1} ${styles.textRight} ${styles.fontBold}`}
      >
        <span>
          <Price price={total} locale={locale} />
        </span>
      </div>
    </div>
  );
}
