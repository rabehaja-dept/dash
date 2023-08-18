import { useProductOptions } from "@shopify/hydrogen";

export type ProductWizardOptionSelectionProps = {
  name: string;
  value: string;
  isSelected: boolean;
};

export const ProductWizardOptionSelection = ({
  name,
  value,
  isSelected,
}: ProductWizardOptionSelectionProps) => {
  const { setSelectedOption } = useProductOptions();

  return (
    <>
      <div className="col-span-1">
        <label>
          <input
            className="sr-only"
            type="radio"
            name={`option[${name}]`}
            value={value}
            checked={isSelected}
            onChange={() => setSelectedOption(name, value)}
          />
          <div
            className={`rounded-md border-2 border-border-weak ${
              isSelected ? " border-border-base" : ""
            }`}
          >
            <div
              className={`m-1 cursor-pointer p-2 text-center text-xs font-light`}
            >
              {value}
            </div>
          </div>
        </label>
      </div>
    </>
  );
};
