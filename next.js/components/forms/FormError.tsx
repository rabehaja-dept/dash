import { FiXCircle } from "react-icons/fi";
import styles from "./form.module.css";

export type FormErrorProps = {
  error: string;
  className?: string;
};

export const FormError = ({ error, className }: FormErrorProps) => {
  return (
    <span className={`${styles.errorContainer} ${className}`}>
      <FiXCircle className={styles.iconAlertError} />
      {error}
    </span>
  );
};
