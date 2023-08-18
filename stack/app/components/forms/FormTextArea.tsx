import clsx from "clsx";
import { motion } from "framer-motion";
import { FormError } from "./FormError";
import { FormHelperText } from "./FormHelperText";

export type FormTextAreaProps = {
  name: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  inputProps: React.InputHTMLAttributes<HTMLTextAreaElement>;
};

export const FormTextArea = ({
  name,
  label,
  helperText,
  placeholder,
  error,
  className,
  required = false,
  inputProps,
}: FormTextAreaProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        className="mb-1 ml-1 block text-xs font-bold text-text"
        htmlFor={name}
      >
        {label} {required && <span className="text-alert-error">*</span>}
      </label>
      <textarea
        className={clsx(
          "block w-full rounded-input border border-border-weak p-2 focus:outline-none focus:ring-1 focus:ring-border-targeted",
          error && "border-alert-error",
          "placeholder:text-sm placeholder:font-light placeholder:text-text-weak"
        )}
        id={name}
        placeholder={placeholder}
        {...inputProps}
      ></textarea>
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
};
