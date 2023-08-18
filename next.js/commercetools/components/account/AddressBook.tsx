import Address from "./Address";
import styles from "./addressBook.module.css";

export default function AddressBook({
  defaultBillingAddress,
  defaultShippingAddress,
}) {
  return (
    <div className={styles.addressBookContainer}>
      <div className={styles.addressBookHeader}>
        <h1 className={styles.addressBookTitle}>Address Book</h1>
        <button className={styles.manageAddressButton} disabled>
          Manage Address
        </button>
      </div>
      <div className={styles.addresses}>
        <Address type="Billing" address={defaultBillingAddress?.address} />
        <Address type="Shipping" address={defaultShippingAddress?.address} />
      </div>
    </div>
  );
}
