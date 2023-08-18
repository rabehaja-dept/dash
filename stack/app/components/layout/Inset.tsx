import type { ReactNode } from "react";

export type InsetProps = {
  className?: string;
  children: ReactNode;
  padded?: boolean;
};

export const Inset = ({
  className = "",
  children,
  padded = false,
}: InsetProps) => {
  return (
    <div
      className={`mx-4 mb-8 md:mx-auto md:w-3/4 ${
        padded ? "py-4 lg:py-10" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
