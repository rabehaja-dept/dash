import clsx from "clsx";
import { motion } from "framer-motion";
import { FormError } from "./FormError";

export type FormCheckboxProps = {
  name: string;
  label: string;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
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
    <div className={`flex flex-col items-start justify-center ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          name={name}
          id={name}
          disabled={disabled}
          onBlur={onBlur}
          className={clsx(
            "h-4 w-4 cursor-pointer border-border bg-primary text-primary accent-primary transition duration-200 checked:bg-primary",
            {
              "outline-alert-error": error,
              "cursor-not-allowed ": disabled,
            }
          )}
          {...inputProps}
        />
        <label htmlFor={name} className={clsx("ml-2 text-sm text-text")}>
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
