import { Address as CTAddress } from "@commercetools/platform-sdk";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/interactive";

interface Props {
  type: "Billing" | "Shipping";
  address?: CTAddress;
}

export default function Address(props: Props) {
  const { t } = useTranslation("commercetools");
  const { type, address } = props;
  return (
    <div className="w-1/2">
      <div className="flex flex-col">
        <h3 className="pb-[16px] pt-[32px] text-body-sm font-bold text-text-base">
          {t("Default")} {type} {t("Address")}
        </h3>
        <p className="text-text-base">{getAddress(address, type)}</p>
        <div className="flex pt-4">
          <Button
            className="inline-block px-0 py-0 text-left font-sourceCodePro text-body-sm text-text-base underline"
            disabled
            variant="custom"
          >
            {t("ADD ADDRESS")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAddress(address: CTAddress | undefined, type: string): string {
  if (!address) return `You have not set a default ${type} address.`;
  return `${address.streetName} ${address.streetNumber}, ${address.city}, ${address.country}`;
}
