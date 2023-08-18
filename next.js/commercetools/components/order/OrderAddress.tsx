import styles from "./address.module.css";
import { Address } from "@deptdash/commercetools";

export default function OrderAddress({
  address,
}: {
  address: Address | undefined;
}) {
  if (!address)
    return (
      <div className={styles.addressContainer}>
        <span className={styles.addressText}>No address on file</span>
      </div>
    );

  return (
    <>
      <div className={styles.addressText}>
        {address?.firstName} {address?.lastName}
      </div>
      <div className={styles.addressText}>
        {`${address?.streetNumber} ${address?.streetName}`}
      </div>
      <div className={styles.addressText}>{address?.additionalAddressInfo}</div>
      <div className={styles.addressText}>
        {`${address?.city} ${address?.state || address?.region} ${
          address?.postalCode
        }`}
      </div>
      <div className={styles.addressText}>{address?.country}</div>
    </>
  );
}
