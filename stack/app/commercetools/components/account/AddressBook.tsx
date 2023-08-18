import { useTranslation } from "react-i18next";
import { Button } from "~/components/interactive";
import { UserAddressBook } from "~/routes/commercetools/account";
import Address from "./Address";
export type AddressBookInformation = UserAddressBook;
export default function AddressBook({
  defaultBillingAddress,
  defaultShippingAddress,
}: AddressBookInformation) {
  const { t } = useTranslation("commercetools");
  return (
    <div className="border-weak mt-[40px] border pb-[40px] pl-[40px] pr-[40px] pt-[40px]">
      <div className="flex justify-between">
        <h1 className="flex pb-[16px] text-body-lg font-bold text-text-base">
          {t("Address Book")}
        </h1>
        <Button
          className="px-0 py-0 font-sourceCodePro text-body-sm text-text-base underline"
          disabled
          variant="custom"
        >
          {t("MANAGE ADDRESS")}
        </Button>
      </div>
      <div className="border-weak border-b" />
      <div className="flex">
        <Address type="Billing" address={defaultBillingAddress?.address} />
        <Address type="Shipping" address={defaultShippingAddress?.address} />
      </div>
    </div>
  );
}
