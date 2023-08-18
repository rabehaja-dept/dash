import { XCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export type FormErrorProps = {
  error: string;
  className?: string;
};

export const FormError = ({ error, className }: FormErrorProps) => {
  return (
    <span
      className={clsx(
        "flex items-center rounded-input p-1 text-xs text-text",
        className
      )}
    >
      <XCircleIcon className="mr-1 h-4 text-alert-error" />
      {error}
    </span>
  );
};
