import { useState } from "react";
import styles from "./shippingMethod.module.css";
import { ShippingMethod as ShippingMethodType } from "@deptdash/commercetools";
import { Price } from "~/components/price";
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

  return (
    <div>
      <h2 className={styles.title}>Shipping method</h2>
      <div className={styles.container}>
        {shippingOptions.map((shippingOption, i) => {
          return (
            <div
              className={`${styles.flexItemsStart} ${
                i < shippingOptions.length - 1 ? styles.border : ""
              }`}
              key={shippingOption.id}
            >
              <input
                type="radio"
                id={shippingOption.id}
                name="shipping-option"
                value={shippingOption.id}
                checked={selectedShippingOption.id === shippingOption.id}
                className={styles.radioInput}
                onChange={() => {
                  setSelectedShippingOption(shippingOption);
                  if (onShippingMethodChange) {
                    onShippingMethodChange(shippingOption);
                  }
                }}
              ></input>
              <label htmlFor={shippingOption.id} className={styles.label}>
                <h3 className={styles.itemTitle}>
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
                <span className={styles.itemDescription}>
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
