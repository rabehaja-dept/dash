import styles from "./form.module.css";

export type FormHelperTextProps = {
  helperText: string;
  className?: string;
};

export const FormHelperText = ({
  helperText,
  className,
}: FormHelperTextProps) => {
  return (
    <span className={`${styles.helperTextContainer} ${className}`}>
      {helperText}
    </span>
  );
};
