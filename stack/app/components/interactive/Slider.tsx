import * as RadixSlider from "@radix-ui/react-slider";
import clsx from "clsx";

export type SliderProps = {
  label: string;
  defaultValue: number[];
  max: number;
  min: number;
  step?: number;
  inverted?: boolean;
  className?: string;
};

/**
 * A slider component
 * @see https://www.radix-ui.com/docs/primitives/components/slider
 */
export const Slider = ({
  label,
  defaultValue,
  max,
  min,
  step,
  inverted = false,
  className,
}: SliderProps) => (
  <RadixSlider.Root
    className={clsx("flex h-[1px] w-full items-center", className)}
    defaultValue={defaultValue}
    min={min}
    max={max}
    step={step}
    inverted={inverted}
  >
    <RadixSlider.Track className="flex h-[2px] flex-1 bg-border">
      <RadixSlider.Range />
    </RadixSlider.Track>
    <RadixSlider.Thumb
      aria-label={label}
      className="block h-4 w-4 rounded-full bg-primary"
    />
  </RadixSlider.Root>
);
