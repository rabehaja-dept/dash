import { Cart } from "@commercetools/platform-sdk";
import { Link } from "~/components/interactive";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export type CheckoutInformationProps = {
  cart: Cart | null;
};

export function CheckoutInformation({ cart }: CheckoutInformationProps) {
  const { t } = useTranslation("commercetools");
  if (!cart) return null;

  return (
    <div className="mb-8 border border-border p-4 text-body-sm font-[400]">
      <div className="align-center mb-4 flex flex-row justify-between gap-4">
        <div className="flex gap-4 overflow-x-clip overflow-ellipsis">
          <span className="text-text-weak">{t("Contact")}</span>
          <span className="truncate">{cart?.customerEmail || ""}</span>
        </div>
        <Link to="/commercetools/checkout">{t("Change")}</Link>
      </div>

      {cart?.shippingAddress && (
        <>
          <hr className="bg-border" />
          <div
            className={clsx(
              "align-center mt-4 flex flex-row justify-between gap-4 text-text",
              { "mb-4": cart?.billingAddress }
            )}
          >
            <div className="flex overflow-x-clip overflow-ellipsis">
              <span className="mr-4 text-text-weak">Ship to</span>
              <span className="truncate">{`${cart?.shippingAddress?.streetNumber} ${cart?.shippingAddress?.streetName}, ${cart?.shippingAddress?.city}, ${cart?.shippingAddress?.region}, ${cart?.shippingAddress?.country}`}</span>
            </div>
            <Link to="/commercetools/checkout">{t("Change")}</Link>
          </div>
        </>
      )}

      {cart?.billingAddress && (
        <>
          <hr className="bg-border" />
          <div className="align-center mt-4 flex flex-row justify-between gap-4 text-text">
            <div className="flex">
              <span className="mr-4 overflow-x-clip overflow-ellipsis text-text-weak">
                Billing
              </span>
              <span className="truncate">{`${cart?.billingAddress?.streetNumber} ${cart?.billingAddress?.streetName}, ${cart?.billingAddress?.city}, ${cart?.billingAddress?.region}, ${cart?.billingAddress?.country}`}</span>
            </div>
            <Link to="/commercetools/checkout/billing">{t("Change")}</Link>
          </div>
        </>
      )}
    </div>
  );
}
