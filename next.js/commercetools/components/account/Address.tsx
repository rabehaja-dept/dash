import styles from "./address.module.css";

export default function Address({ type, address }) {
  const formattedAddress = getAddress(address, type);

  return (
    <div className={styles.addressContainer}>
      <div className={styles.addressFlex}>
        <h3 className={styles.addressTitle}>Default {type} Address</h3>
        <p className={styles.addressText}>{formattedAddress}</p>
        <div>
          <button className={styles.addAddressButton} disabled>
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
}

function getAddress(address, type) {
  if (!address) return `You have not set a default ${type} address.`;
  return `${address.streetName} ${address.streetNumber}, ${address.city}, ${address.country}`;
}
