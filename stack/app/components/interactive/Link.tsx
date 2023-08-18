import { Link as RemixLink } from "@remix-run/react";
import clsx from "clsx";

export type LinkProps = {
  variant?: "primary" | "dark" | "unstyled";
  underlined?: boolean;
  children: string | React.ReactNode;
  to?: string; // Use this for internal links
  href?: string; // Use this for external links
  rel?: string;
  target?: string;
  as?: React.ElementType;
  onClick?: (...e: any) => void | Promise<void>;
  className?: string;
};

export const Link = ({
  variant = "primary",
  children,
  underlined,
  to,
  href,
  rel,
  target = "_blank",
  onClick,
  as: Component = "a",
  className,
}: LinkProps) => {
  const baseStyling = "inline-block whitespace-nowrap text-sm cursor-pointer";
  const underlinedStyling = clsx({
    underline: underlined,
  });
  const variantStyling = clsx({
    "text-primary hover:text-primary-targeted": variant === "primary",
    "text-black hover:opacity-75": variant === "dark",
  });

  if (to) {
    return (
      <RemixLink
        to={to}
        rel={rel}
        onClick={onClick}
        className={clsx(
          variant !== "unstyled" && [
            baseStyling,
            underlinedStyling,
            variantStyling,
          ],
          className
        )}
      >
        {children}
      </RemixLink>
    );
  }

  return (
    <Component
      href={href}
      rel={rel}
      target={target}
      onClick={onClick}
      className={clsx(
        variant !== "unstyled" && [
          baseStyling,
          underlinedStyling,
          variantStyling,
        ],
        className
      )}
    >
      {children}
    </Component>
  );
};
