import clsx from "clsx";
import * as RadixAspectRatio from "@radix-ui/react-aspect-ratio";

export type AspectRatioProps = {
  ratio: number;
  children: React.ReactNode; // HTMLImageElement
  className?: string;
};

export const AspectRatio = ({
  ratio,
  children,
  className,
}: AspectRatioProps) => (
  <div className={clsx("overflow-hidden", className)}>
    <RadixAspectRatio.Root ratio={ratio} className={className}>
      {children}
    </RadixAspectRatio.Root>
  </div>
);
