import Link from "next/link";
import styles from "./checkoutinformation.module.css";
import { Cart } from "@deptdash/commercetools";

export type CheckoutInformationProps = {
  cart: Cart | null;
};

export const CheckoutInformation = ({ cart }: CheckoutInformationProps) => {
  if (!cart) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header}>
          <span className={styles.label}>Contact</span>
          <span>{cart?.customerEmail || ""}</span>
        </div>
        <Link href="/commercetools/checkout">Change</Link>
      </div>

      {cart?.shippingAddress && (
        <>
          <hr className={styles.hr} />
          <div
            className={`${styles.address} ${
              cart?.billingAddress ? "" : styles.address
            }`}
          >
            <div>
              <span className={`${styles.label} ${styles.labelMargin}`}>
                Ship to
              </span>
              <span>{`${cart?.shippingAddress?.streetNumber} ${cart?.shippingAddress?.streetName}, ${cart?.shippingAddress?.city}, ${cart?.shippingAddress?.region}, ${cart?.shippingAddress?.country}`}</span>
            </div>
            <Link href="/commercetools/checkout">Change</Link>
          </div>
        </>
      )}

      {cart?.billingAddress && (
        <>
          <hr className={styles.hr} />
          <div className={styles.address}>
            <div>
              <span className={`${styles.label} ${styles.labelMargin}`}>
                Billing
              </span>
              <span>{`${cart?.billingAddress?.streetNumber} ${cart?.billingAddress?.streetName}, ${cart?.billingAddress?.city}, ${cart?.billingAddress?.region}, ${cart?.billingAddress?.country}`}</span>
            </div>
            <Link href="/commercetools/checkout/billing">Change</Link>
          </div>
        </>
      )}
    </div>
  );
};
