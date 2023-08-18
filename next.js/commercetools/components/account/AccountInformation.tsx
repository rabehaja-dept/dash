import styles from "./accountInformation.module.css";

export default function AccountInformation({ firstName, lastName, email }) {
  return (
    <div className={styles.accountContainer}>
      <h1 className={styles.accountTitle}>Account Information</h1>
      <h3 className={styles.contactInfoTitle}>Contact information</h3>
      <div className={styles.contactInfo}>
        <p>
          {firstName} {lastName}
        </p>
        <p>{email}</p>
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.disabledButton} disabled>
          Edit
        </button>
        <button className={styles.disabledButton} disabled>
          Change Password
        </button>
      </div>
    </div>
  );
}
