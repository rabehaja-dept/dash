import { Address } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";

export type BillingIngformationProps = {
  data: Address[];
  defaultAddressId?: string;
};

export const BillingInformation = ({
  data,
  defaultAddressId,
}: BillingIngformationProps) => {
  const { t } = useTranslation("commercetools");
  return (
    <div>
      {data?.map((address) => (
        <div
          key={address.id}
          className="border-weak mt-[40px] border pb-[40px] pl-[40px] pr-[40px] pt-[40px]"
        >
          <h3 className="flex pb-[16px] text-body-lg font-bold text-text-base">
            {t("Billing address")}{" "}
            {defaultAddressId === address.id ? "(default)" : null}
          </h3>
          <div className="border-weak border-b" />
          <div className="flex flex-col overflow-hidden md:flex-row">
            <div className="w-1/2">
              <h3 className="pb-[16px] pt-[32px] text-body-sm font-bold text-text-base">
                {t("Address details")}
              </h3>
              <p>
                {address.streetName}, {address.streetNumber}
              </p>
              {address.additionalStreetInfo && (
                <p>{address.additionalAddressInfo}</p>
              )}
              <p>{address.postalCode}</p>
              <p>
                {address.city}, {address.region}
              </p>
              <p>{address.country}</p>
            </div>
            <div className="w-1/2">
              <h3 className="pb-[16px] pt-[32px] text-body-sm font-bold text-text-base">
                {t("Contact details")}
              </h3>
              <p className="truncate text-ellipsis">
                {address.firstName} {address.lastName}
              </p>
              <p className="truncate text-ellipsis">{address.email}</p>
              <p className="truncate text-ellipsis">{address.phone}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
