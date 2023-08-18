import { Address } from "@commercetools/platform-sdk";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import AccountInformation from "~/commercetools/components/account/AccountInformation";
import AddressBook from "~/commercetools/components/account/AddressBook";
import { authorize } from "~/commercetools/api/auth.server";
import { handleGetCurrentCustomer } from "~/commercetools/api/customer.server";
import Menu from "../../../commercetools/components/account/menu";

export interface UserAccountInformation {
  firstName: string;
  lastName: string;
  email: string;
}
export interface UserAddressBook {
  defaultBillingAddress?: {
    address?: Address;
  };
  defaultShippingAddress?: {
    address?: Address;
  };
}
export interface UserInformation {
  accountInformation: UserAccountInformation;
  addressesBook: UserAddressBook;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<UserInformation | null> => {
  await authorize(request);

  const customer = await handleGetCurrentCustomer(request);

  if (customer) {
    return {
      accountInformation: {
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email,
      },
      addressesBook: {
        defaultBillingAddress: {
          address: getAddressByAddressId(
            customer.addresses,
            customer.defaultBillingAddressId
          ),
        },
        defaultShippingAddress: {
          address: getAddressByAddressId(
            customer.addresses,
            customer.defaultShippingAddressId
          ),
        },
      },
    };
  }
  return null;
};

export default function Account() {
  const { t } = useTranslation("commercetools");
  const { accountInformation, addressesBook } =
    useLoaderData<UserInformation>();
  return (
    <section className="relative w-full">
      <div className="flex justify-start py-6">
        <div className="w-full py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row">
              <div className="mb-4 px-4 sm:w-full md:w-1/4">
                <div className="flex flex-col">
                  <Menu />
                </div>
              </div>
              <div className="w-full px-4 md:flex-1">
                <h2 className="text-title-md font-bold text-text-base">
                  {t("My Account")}
                </h2>
                <AccountInformation
                  email={accountInformation.email}
                  firstName={accountInformation.firstName}
                  lastName={accountInformation.lastName}
                />
                <AddressBook
                  defaultShippingAddress={addressesBook?.defaultShippingAddress}
                  defaultBillingAddress={addressesBook?.defaultBillingAddress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function getAddressByAddressId(
  addresses: Address[],
  id: string | undefined
): Address | undefined {
  return addresses.find((address) => address.id === id);
}
