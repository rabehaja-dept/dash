import { motion } from "framer-motion";
import { FormError } from "./FormError";
import styles from "./formCheckbox.module.css";

export type FormCheckboxProps = {
  name: string;
  label: string;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  inputProps: any; // use any for simplicity
};

export const FormCheckbox = ({
  name,
  label,
  disabled = false,
  onBlur,
  error,
  className,
  inputProps,
}: FormCheckboxProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          name={name}
          id={name}
          disabled={disabled}
          onBlur={onBlur}
          className={`${styles.checkboxInput} ${
            disabled ? styles.disabledCheckbox : ""
          } ${error ? styles.errorCheckbox : ""}`}
          {...inputProps}
        />
        <label htmlFor={name} className={styles.checkboxLabel}>
          {label}
        </label>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {error && <FormError error={error} />}
      </motion.div>
    </div>
  );
};
