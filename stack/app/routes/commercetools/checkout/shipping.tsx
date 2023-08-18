import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  useTransition,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { i18n } from "~/i18n.server";
import { ShippingMethod as ShippingMethodType } from "@commercetools/platform-sdk";
import { ShippingMethod } from "~/commercetools/components/ShippingMethods";
import { Button, Link } from "~/components/interactive";
import {
  getActiveCart,
  setShippingMethod,
} from "~/commercetools/api/cart.server";
import { CheckoutInformation } from "~/commercetools/components/CheckoutInformation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { getShippingMethods } from "~/commercetools/api/shipping-method.server";

export type ShippingLoaderData = {
  shippingMethods: ShippingMethodType[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const cart = await getActiveCart(request);

  if (!cart || !cart.customerEmail || !cart.shippingAddress) {
    return redirect("/commercetools/checkout");
  }
  /**
   * You may want to update this logic to get shipping methods
   * for an individual cart and/or user location
   */
  const shippingMethods = await getShippingMethods();
  const locale = await i18n.getLocale(request);

  const existingShippingMethod = shippingMethods?.find(
    (method) => method.id === cart.shippingInfo?.shippingMethod?.id
  );

  return {
    cart,
    shippingMethods,
    existingShippingMethod,
    locale,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  /**
   * `shipping-option` comes from the `name` attribute
   *  of the radio input in the <ShippingMethod/> component
   */
  const shippingMethodId = formData.get("shipping-option") as string;

  const cart = await getActiveCart(request);

  if (!cart) {
    return redirect("/commercetools/checkout");
  }

  await setShippingMethod(cart.id, shippingMethodId);

  // Return null to reload the page with the new shipping method updated in the cart
  return null;
};

export default function Shipping() {
  const { shippingMethods, existingShippingMethod, locale, cart } =
    useLoaderData();
  const submit = useSubmit();
  const transition = useTransition();
  const isSaving = Boolean(transition.submission);
  const { t } = useTranslation("commercetools");

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true });
  };

  return (
    <>
      <CheckoutInformation cart={cart} />
      <Form method="post" onChange={handleChange}>
        <ShippingMethod
          existingShippingMethod={existingShippingMethod}
          shippingOptions={shippingMethods}
          locale={locale}
        />
        <div className="mb-12 mt-12 flex flex-col md:mb-20 md:flex-row md:items-center md:justify-between">
          <Link
            to="/commercetools/cart"
            className="mb-4 flex items-center md:mb-0"
          >
            <ChevronLeftIcon className="inline-block h-4 w-4 text-primary" />
            {t("Return to cart")}
          </Link>
          <div className="flex flex-col md:flex-col">
            {/* @dash-remove-start stripe */}
            <Button
              className="mb-4 bg-custom-blue uppercase"
              disabled={isSaving}
              to="/commercetools/checkout/stripe/payment"
            >
              {isSaving ? t("Saving...") : t("Continue with Stripe")}
            </Button>
            {/* @dash-remove-end */}
            {/* @dash-remove-start adyen */}
            <Button
              variant="primary"
              className="bg-custom-green uppercase"
              disabled={isSaving}
              to="/commercetools/checkout/adyen/payment"
            >
              {isSaving ? t("Saving...") : t("Continue with Adyen")}
            </Button>
            {/* @dash-remove-end */}
            {/* If only one is selected then the message should be Continue to Payment */}
          </div>
        </div>
      </Form>
    </>
  );
}
