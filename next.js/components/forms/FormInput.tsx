import React from "react";
import { motion } from "framer-motion";
import { FormError } from "./FormError";
import { FormHelperText } from "./FormHelperText";
import styles from "./form.module.css";

export type FormInputProps = {
  name: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> &
    React.RefAttributes<HTMLInputElement>;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      label,
      helperText,
      placeholder,
      error,
      className,
      required = false,
      inputProps,
    },
    ref
  ) => {
    return (
      <div className={`${styles.formInputContainer} ${className}`}>
        <input
          ref={ref}
          className={styles.formInput}
          id={name}
          placeholder={placeholder}
          {...inputProps}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {error ? (
            <FormError error={error} />
          ) : helperText ? (
            <FormHelperText helperText={helperText} />
          ) : null}
        </motion.div>
      </div>
    );
  }
);
