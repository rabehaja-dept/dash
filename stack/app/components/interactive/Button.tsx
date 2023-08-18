import { Link } from "@remix-run/react";
import clsx from "clsx";

/**
 * A styled button component.
 */
export type ButtonProps = {
  as?: React.ElementType;
  ariaLabel?: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "white" | "custom";
  rounded?: boolean;
  type?: "button" | "submit" | "reset";
  block?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  to?: string; // Remix link
  href?: string; // HTML link
  onClick?: (...e: any) => void | Promise<void>;
};

export const Button = (props: ButtonProps) => {
  const { variant = "primary", block, icon, rounded, disabled, to } = props;

  /**
   * Base styling for all buttons.
   * Theoretically, you should be able to change almost all button styles here.
   * If you need to add a new variant, add it to the `variantStyling` object.
   */
  const baseStyling = clsx(
    "inline-block text-center py-4 px-8 whitespace-nowrap rounded-button",
    {
      "w-full": block,
      "rounded-full": rounded,
      "cursor-not-allowed opacity-50": disabled,
    }
  );
  // Styles applied to all buttons with icons
  const iconBaseStyling = clsx("flex items-center justify-center", {
    "rounded-full": rounded,
  });
  // Variant specific styles
  const variantStyling = clsx({
    "bg-primary hover:bg-primary-targeted active:bg-primary-targeted focus:ring focus:ring-primary-targeted focus:bg-primary-targeted text-white":
      variant === "primary",
    "bg-white hover:bg-primary-hover active:bg-primary-hover focus:bg-primary-hover text-primary outline outline-1 outline-primary":
      variant === "secondary",
    "bg-transparent hover:bg-primary-hover active:bg-primary-hover focus:bg-primary-hover text-primary":
      variant === "tertiary",
    "bg-white hover:bg-gray-100 text-black": variant === "white",
    "bg-transparent text-black": variant === "custom",
  });
  /**
   * end of styles
   */

  if (icon) {
    // Wrap in a Remix Link if a `to` prop is provided
    return to ? (
      <Link to={to}>
        <IconButton
          iconBaseStyling={iconBaseStyling}
          variantStyling={variantStyling}
          {...props}
        />
      </Link>
    ) : (
      <IconButton
        iconBaseStyling={iconBaseStyling}
        variantStyling={variantStyling}
        {...props}
      />
    );
  }

  return to ? (
    // Remix link component for routing
    <Link to={to}>
      <BaseButton
        baseStyling={baseStyling}
        variantStyling={variantStyling}
        {...props}
      />
    </Link>
  ) : (
    <BaseButton
      baseStyling={baseStyling}
      variantStyling={variantStyling}
      {...props}
    />
  );
};

// base button component
function BaseButton({
  ariaLabel,
  disabled,
  className = "",
  children,
  href,
  onClick,
  type,
  as: Component = "button",
  baseStyling,
  variantStyling,
}: ButtonProps & {
  baseStyling: string;
  variantStyling: string;
}) {
  return (
    <Component
      className={clsx(baseStyling, variantStyling, className)}
      disabled={disabled}
      href={href}
      target={href ? "_blank" : undefined}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </Component>
  );
}

// button with icon
function IconButton({
  icon,
  iconPosition = "left",
  ariaLabel,
  disabled,
  className = "",
  children,
  href,
  onClick,
  type,
  as: Component = "button",
  iconBaseStyling,
  variantStyling,
}: ButtonProps & {
  iconBaseStyling: string;
  variantStyling: string;
}) {
  return (
    <Component
      className={clsx(iconBaseStyling, variantStyling, className)}
      disabled={disabled}
      href={href}
      target={href ? "_blank" : undefined}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel || "Button Icon"}
      aria-disabled={disabled}
    >
      {iconPosition === "left" && icon}
      {children && (
        <span
          className={clsx({
            "mr-6": iconPosition === "left",
            "ml-6": iconPosition === "right",
          })}
        >
          {children}
        </span>
      )}
      {iconPosition === "right" && icon}
    </Component>
  );
}
