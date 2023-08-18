import { ShippingMethod as ShippingMethodType } from "@commercetools/platform-sdk";
import { Price } from "./Price";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type ShippingMethodProps = {
  shippingOptions: ShippingMethodType[];
  existingShippingMethod?: ShippingMethodType;
  locale: string;
  onShippingMethodChange?: (shippingMethod: ShippingMethodType) => void;
};

export const ShippingMethod = ({
  shippingOptions,
  existingShippingMethod,
  locale,
  onShippingMethodChange,
}: ShippingMethodProps) => {
  // Find the default shipping option
  const defaultShippingOption = shippingOptions.find(
    (shippingOption) => shippingOption.isDefault
  );
  // Set the default shipping option as the selected shipping option or use the first shipping option
  const [selectedShippingOption, setSelectedShippingOption] = useState(
    existingShippingMethod || defaultShippingOption || shippingOptions[0]
  );

  // run the onShippingMethodChange callback to set the initial shipping method
  if (onShippingMethodChange) {
    onShippingMethodChange(selectedShippingOption);
  }
  const { t } = useTranslation("commercetools");
  return (
    <div>
      <h2 className="mb-4 text-body-lg font-bold">{t("Shipping method")}</h2>
      <div className="border border-border">
        {shippingOptions.map((shippingOption, i) => {
          return (
            <div
              className={clsx("flex items-start p-4", {
                "border-b border-border": i < shippingOptions.length - 1,
              })}
              key={shippingOption.id}
            >
              <input
                type="radio"
                id={shippingOption.id}
                name="shipping-option"
                value={shippingOption.id}
                checked={selectedShippingOption.id === shippingOption.id}
                className="mr-4 mt-1 h-4 w-4 cursor-pointer text-primary accent-primary focus:ring-primary"
                onChange={() => {
                  setSelectedShippingOption(shippingOption);
                  if (onShippingMethodChange) {
                    onShippingMethodChange(shippingOption);
                  }
                }}
              ></input>
              <label
                htmlFor={shippingOption.id}
                className="w-full cursor-pointer"
              >
                <h3 className="flex w-full justify-between text-body-sm font-bold">
                  <span>
                    {shippingOption.localizedName
                      ? shippingOption.localizedName[locale]
                      : shippingOption.name}
                  </span>
                  <Price
                    price={shippingOption.zoneRates[0].shippingRates[0].price}
                    locale={locale}
                  />
                </h3>
                <span className="text-body-sm font-[400] text-text-weak">
                  {shippingOption.localizedDescription
                    ? shippingOption.localizedDescription[locale]
                    : ""}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
