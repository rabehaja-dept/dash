import { useState } from "react";
import clsx from "clsx";

export type SizeSelectorProps = {
  options: { name: string; size: string; disabled?: boolean }[];
};

export function SizeSelector({ options }: SizeSelectorProps) {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex flex-row justify-start">
      {options.map(({ name, size, disabled }) => (
        <label
          title={name}
          key={name}
          className={clsx("mx-2 transition-all", {
            "cursor-not-allowed": disabled,
            "cursor-pointer": !disabled,
          })}
          tabIndex={disabled ? -1 : 0}
          onKeyUp={(e) => {
            if (e.key === "Enter" && !disabled) {
              setSelected(size);
            }
          }}
          aria-disabled={disabled}
          aria-label={name}
        >
          <div
            className={clsx(
              "bg-transparent p-[3px]",
              {
                "outline outline-2 outline-background-canvas-dark":
                  !disabled && size === selected,
              },
              {
                "hover:outline hover:outline-2 hover:outline-border":
                  !disabled && size !== selected,
              }
            )}
          >
            <div
              className={clsx(
                "align-center flex h-[30px] w-[30px] flex-col justify-center bg-background-canvas-dark text-center text-[14px]",
                {
                  "bg-background-canvas-light text-text-weak": disabled,
                  "text-white": !disabled,
                }
              )}
            >
              {size}
            </div>
          </div>

          <input
            className="hidden"
            type="radio"
            name="size"
            value={size}
            checked={selected === size}
            onChange={(e) => setSelected(e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
