import { useProductOptions } from "@shopify/hydrogen";

export type ProductOptionProps = {
  name: string;
  value: string;
  isSelected: boolean;
};

export const ProductOption = ({
  name,
  value,
  isSelected,
}: ProductOptionProps) => {
  const { setSelectedOption } = useProductOptions();

  return (
    <label>
      <input
        className="sr-only"
        type="radio"
        name={`option[${name}]`}
        value={value}
        checked={isSelected}
        onChange={() => setSelectedOption(name, value)}
      />
      <div className={`${isSelected ? "border-2 border-black" : ""}`}>
        <div
          className={`m-1 cursor-pointer border border-black p-2 text-xs font-light ${
            isSelected ? "bg-black text-white" : "text-black"
          }`}
        >
          {value}
        </div>
      </div>
    </label>
  );
};
