import clsx from "clsx";

export type LabelProps = {
  variant: "filled" | "outlined" | "soft";
  rounded?: boolean;
  children: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export const Label = ({
  variant = "filled",
  rounded = false,
  children,
  icon,
  className,
}: LabelProps) => {
  return (
    <span
      className={clsx(
        "max-w- inline-flex flex-row items-center justify-start whitespace-nowrap px-3 py-1 text-body-sm",
        {
          "rounded-full": rounded,
          "bg-background-canvas-dark text-text-light": variant === "filled",
          "border-1 border border-text bg-transparent text-text":
            variant === "outlined",
          "bg-gray-100 text-text": variant === "soft",
        },
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </span>
  );
};
