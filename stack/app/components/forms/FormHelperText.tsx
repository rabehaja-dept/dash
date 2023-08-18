import clsx from "clsx";

export type FormHelperTextProps = {
  helperText: string;
  className?: string;
};

export const FormHelperText = ({
  helperText,
  className,
}: FormHelperTextProps) => {
  return (
    <span
      className={clsx(
        "flex items-center rounded-input p-1 text-xs text-text-weak",
        className
      )}
    >
      {helperText}
    </span>
  );
};
