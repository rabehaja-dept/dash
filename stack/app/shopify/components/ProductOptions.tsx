import { useProductOptions } from "@shopify/hydrogen";
import type { ProductOption as Option } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import { ProductOption } from "./ProductOption";
/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */
export default function ProductOptions() {
  const { options, selectedOptions } = useProductOptions();

  // Cast to ProductOption to avoid type errors
  const productOptions: Option[] =
    options?.map((option) => ({
      ...(option as Option),
    })) || [];

  return (
    <>
      {productOptions.map(({ name, values }) => {
        return (
          <fieldset key={name} className="my-8">
            <legend className="mb-2 text-sm font-medium text-black">
              <span className="font-bold">{name}: </span>
              {selectedOptions ? selectedOptions[name] : ""}
            </legend>
            <div className="flex flex-wrap items-center gap-4">
              {values.map((value: string) => {
                const isSelected = selectedOptions
                  ? selectedOptions[name] === value
                  : false;
                const id = `option-${name}-${value}`;

                return (
                  <ProductOption
                    key={id}
                    name={name}
                    value={value}
                    isSelected={isSelected}
                  />
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
