import { useProductOptions } from "@shopify/hydrogen";
import type { ProductOption } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import { ProductWizardOptionSelection } from "./ProductWizardOptionSelection";

/**
 * An component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */
export default function ProductWizardOptions() {
  const { options, selectedOptions } = useProductOptions();

  // Cast to ProductOption to avoid type errors
  const productOptions: ProductOption[] =
    options?.map((option) => ({
      ...(option as ProductOption),
    })) || [];

  const scrollToNextOption = (id: number) => {
    const nextOption = document.getElementById(`option-${id + 1}`);
    if (nextOption) {
      nextOption.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      {productOptions.map(({ name, values }, i) => {
        return (
          <>
            <div className="mb-16" id={`option-${i}`}>
              <fieldset key={name} className="my-8">
                <legend className="mb-2 text-sm font-medium text-black">
                  <span className="font-bold">{name}</span>
                </legend>
                <span className="my-6 text-xs text-text-weak">
                  Select a {name.toLocaleLowerCase()} option
                </span>
                <div className={`grid grid-cols-2 items-center gap-4 py-6`}>
                  {values.map((value: string) => {
                    const isSelected = selectedOptions
                      ? selectedOptions[name] === value
                      : false;
                    const id = `option-${name}-${value}`;

                    return (
                      <div key={id} onClick={() => scrollToNextOption(i)}>
                        <ProductWizardOptionSelection
                          name={name}
                          value={value}
                          isSelected={isSelected}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </>
        );
      })}
    </>
  );
}
