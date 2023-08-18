import Link from "next/link";
import styles from "./NewAccount.module.css";

export default function NewAccount() {
  const message =
    "Creating an account has many benefits: check out faster, keep more than one address, track orders and more.";

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.heading}>New Account</h2>
        <p className={styles.message}>{message}</p>
        <Link href="/commercetools/register">
          <button className={styles.button}>CREATE AN ACCOUNT</button>
        </Link>
      </div>
    </div>
  );
}
