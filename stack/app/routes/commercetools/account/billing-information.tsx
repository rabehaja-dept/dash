import { Address } from "@commercetools/platform-sdk";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BillingInformation } from "~/commercetools/components/BillingInformation";
import { authorize } from "~/commercetools/api/auth.server";
import { handleGetCurrentCustomer } from "~/commercetools/api/customer.server";
import Menu from "~/commercetools/components/account/menu";

export interface UserInformation {
  addresses: Address[];
  defaultBillingAddressId: string | undefined;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<UserInformation | null> => {
  await authorize(request);
  const customer = await handleGetCurrentCustomer(request);
  if (customer) {
    return {
      addresses: customer.addresses?.length
        ? customer.addresses.filter((address) =>
            customer.billingAddressIds?.includes(address.id || "")
          )
        : [],
      defaultBillingAddressId: customer.defaultBillingAddressId,
    };
  }
  return null;
};

export default function AccountBillingInformation() {
  const { addresses, defaultBillingAddressId } = useLoaderData();

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
                  Billing information
                </h2>
                <BillingInformation
                  data={addresses}
                  defaultAddressId={defaultBillingAddressId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
