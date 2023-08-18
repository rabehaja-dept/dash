import { Order, Address } from "@commercetools/platform-sdk";
import { GoogleMap } from "~/components/plugins";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/interactive";
import { useTranslation } from "react-i18next";

export type OrderSummaryProps = {
  order: Order;
  orderLocation: { lat: number; lng: number };
};

export const OrderSummary = ({ order, orderLocation }: OrderSummaryProps) => {
  const {
    id,
    customerEmail,
    shippingAddress,
    billingAddress,
    shippingInfo,
    paymentInfo, // TODO: Wire up payment method
  } = { ...order };
  const { t } = useTranslation("commercetools");
  return (
    <>
      <div className="flex items-center gap-4">
        <CheckCircleIcon className="h-12 w-12 text-primary" />
        <div>
          {/* You'll want to change this to an external order number */}
          <span className="text-body-sm text-text-weak">
            {t("Order")} #{id}
          </span>
          <h2 className="text-body-lg">{t("Thank you!")}</h2>
        </div>
      </div>
      <div className="mt-8 border border-border">
        <GoogleMap
          height="450px"
          width="100%"
          defaultCenter={{ lat: orderLocation.lat, lng: orderLocation.lng }}
        >
          <MapLocation lat={orderLocation.lat} lng={orderLocation.lng} />
        </GoogleMap>
        <div className="p-4">
          <h3 className="text-body-lg">{t("Your order has been placed.")}</h3>
          <p className="text-body-sm text-text-weak">
            {t(
              "We're getting your order ready and will keep you updated when it ships!"
            )}
          </p>
          <Button variant="secondary" className="mt-4">
            {t("TRACK ORDER")}
          </Button>
        </div>
      </div>
      <div className="mt-8 text-ellipsis border border-border p-4 font-[400]">
        <h3 className="mb-4 text-body-lg">{t("Customer information")}</h3>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div>
            <div className="mb-4 overflow-hidden">
              <h4 className="mb-2 text-body-sm font-bold">
                {t("Contact information")}
              </h4>
              <p className="truncate text-ellipsis text-body-sm text-text-weak">
                {customerEmail || t("No email on file.")}
              </p>
            </div>
            <div className="mb-4 overflow-hidden">
              <h4 className="mb-2 text-body-sm font-bold">
                {t("Shipping address")}
              </h4>
              <OrderAddress address={shippingAddress} />
            </div>
            <div className="mb-4 overflow-hidden">
              <h4 className="mb-2 text-body-sm font-bold">
                {t("Shipping method")}
              </h4>
              <p className="truncate text-ellipsis text-body-sm text-text-weak">
                {shippingInfo?.shippingMethodName ||
                  t("No shipping method on file.")}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-4 overflow-hidden">
              <h4 className="mb-2 text-body-sm font-bold">
                {t("Payment method")}
              </h4>
              <p className="truncate text-ellipsis text-body-sm text-text-weak">
                {t("Coming soon.")}
                {/*  TODO: Wire up payment method */}
              </p>
            </div>
            <div className="mb-4 overflow-hidden">
              <h4 className="mb-2 text-body-sm font-bold">
                {t("Billing address")}
              </h4>
              <OrderAddress address={billingAddress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function OrderAddress({ address }: { address: Address | undefined }) {
  const { t } = useTranslation("commercetools");
  if (!address)
    return (
      <div className="mb-4 overflow-hidden">
        <span className="truncate text-ellipsis text-body-sm text-text-weak">
          {t("No address on file.")}
        </span>
      </div>
    );
  return (
    <>
      <div className="truncate text-ellipsis text-body-sm text-text-weak">
        {address?.firstName} {address?.lastName}
      </div>
      <div className="truncate text-ellipsis text-body-sm text-text-weak">
        {`${address?.streetNumber} ${address?.streetName}`}
      </div>
      <div className="truncate text-ellipsis text-body-sm text-text-weak">
        {address?.additionalAddressInfo}
      </div>
      <div className="truncate text-ellipsis text-body-sm text-text-weak">
        {`${address?.city} ${address?.state || address?.region} ${
          address?.postalCode
        }`}
      </div>
      <div className="truncate text-ellipsis text-body-sm text-text-weak">
        {address?.country}
      </div>
    </>
  );
}

function MapLocation({ lat, lng }: { lat: number; lng: number }) {
  return (
    <>
      <div className="h-12 w-12">
        <MapPinIcon className="absolute h-12 w-12 text-black" />
      </div>
    </>
  );
}
