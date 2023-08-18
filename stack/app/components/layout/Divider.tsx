import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";

export type DividerProps = {
  className?: string;
  orientation?: Separator.Orientation;
};

export const Divider = ({
  className,
  orientation = "horizontal",
}: DividerProps) => {
  return orientation === "horizontal" ? (
    <Separator.Root
      className={clsx("h-[1px] w-full bg-border", className)}
      decorative
      orientation="horizontal"
    />
  ) : (
    <Separator.Root
      className={clsx("h-full w-[1px] bg-border", className)}
      decorative
      orientation="vertical"
    />
  );
};
