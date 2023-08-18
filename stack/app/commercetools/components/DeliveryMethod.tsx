import { BuildingStorefrontIcon, TruckIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export type DeliveryMethodProps = {
  value: string;
  setValue: (value: string) => void;
};

export const DeliveryMethod = ({ value, setValue }: DeliveryMethodProps) => {
  const { t } = useTranslation("commercetools");
  return (
    <div className="mt-4 lg:mt-8">
      <h2 className="mb-4 text-xl font-bold">{t("Delivery method")}</h2>
      <label className="border-1 border-weak flex cursor-pointer items-center border p-6">
        <input
          type="radio"
          id="ship"
          name="deliveryMethod"
          value="ship"
          checked={value === "ship"}
          className="h-4 w-4 cursor-pointer text-primary accent-primary focus:ring-primary"
          onChange={(e) => setValue(e.target.value)}
        />
        <TruckIcon className="ml-4 mr-2 h-6 w-6" />
        {t("Ship")}
      </label>
      <label className="border-1 border-weak flex cursor-pointer items-center border border-t-0 p-6">
        {/* This is disabled by default */}
        <input
          type="radio"
          id="pickUp"
          disabled
          name="deliveryMethod"
          value="pickUp"
          checked={value === "pickUp"}
          className="h-4 w-4 cursor-pointer text-primary accent-primary focus:ring-primary"
          onChange={(e) => setValue(e.target.value)}
        />
        <BuildingStorefrontIcon className="ml-4 mr-2 h-6 w-6" />
        {t("Pick up")}
      </label>
    </div>
  );
};
