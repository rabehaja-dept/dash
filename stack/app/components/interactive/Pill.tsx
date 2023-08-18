import clsx from "clsx";

export type PillProps = {
  className?: string;
  variant: "primary" | "dark";
  children: string;
  selected?: boolean;
};

export function Pill({
  className,
  variant = "primary",
  selected = false,
  children,
}: PillProps) {
  const backgroundClassNames = clsx({
    "bg-primary": variant === "primary" && selected,
    "bg-black": variant === "dark" && selected,
    "bg-white outline outline-1 outline-black hover:bg-background":
      variant === "primary" && !selected,
    "bg-black hover:bg-white hover:text-black": variant === "dark" && !selected,
  });

  const textClassNames = clsx("font-bold cursor-default", {
    "text-white": (variant === "primary" && selected) || variant === "dark",
    "text-black": variant === "primary" && !selected,
  });

  return (
    <span
      className={clsx(
        "flex h-8 max-w-max cursor-pointer items-center justify-center rounded-full px-2 py-2 text-sm font-normal transition-colors hover:opacity-90",
        backgroundClassNames,
        textClassNames,
        className
      )}
    >
      {children}
    </span>
  );
}
