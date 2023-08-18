import { useState } from "react";

export type ColorSelectorProps = {
  options: { name: string; color: string; disabled?: boolean }[];
};

export function ColorSelector({ options }: ColorSelectorProps) {
  const [selected, setSelected] = useState(options[0].name);

  return (
    <div className="-ml-1 flex flex-row justify-start">
      {options.map(({ name, color, disabled }) => (
        <label
          title={name}
          key={name}
          className={`mx-2 transition-all ${
            disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"
          }`}
        >
          <div
            className={`rounded-full bg-transparent p-[2px] ${
              !disabled
                ? name === selected
                  ? "outline outline-2 outline-black"
                  : "hover:outline hover:outline-2 hover:outline-border"
                : "outline-grey-dark outline outline-2"
            }`}
          >
            <div
              className={`relative rounded-full p-3`}
              style={{ backgroundColor: color }}
            >
              {disabled && (
                <div className="absolute top-0 -mt-[3px] h-[30px] w-[2px] rotate-45 bg-black opacity-100" />
              )}
            </div>
          </div>

          <input
            className="hidden"
            disabled={disabled}
            type="radio"
            name="color"
            value={name}
            checked={name === selected}
            onChange={(e) => setSelected(e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
