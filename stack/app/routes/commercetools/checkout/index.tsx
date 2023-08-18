import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedFormCheckbox,
  ValidatedFormInput,
  ValidatedSelect,
} from "~/components/forms";
import { z } from "zod";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { DeliveryMethod } from "~/commercetools/components/DeliveryMethod";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useMemo, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  addAddressesAndEmailToCart,
  getActiveCart,
} from "~/commercetools/api/cart.server";
import { handleGetCurrentCustomer } from "~/commercetools/api/customer.server";
import { Cart, Customer } from "@commercetools/platform-sdk";
import { i18n } from "~/i18n.server";
import { useCountries } from "~/hooks/useCountries";
import { Button, Link } from "~/components/interactive";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface LoaderData {
  cart: Cart;
  locale: string;
  user: Customer | null;
}

export type FormData = {
  email: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingStreetName: string;
  shippingStreetNumber: string;
  shippingAddressMore?: string;
  shippingCity: string;
  shippingCountry: { label: string; value: string };
  shippingRegion: { label: string; value: string };
  shippingPostalCode: string;
  shippingPhone: string;
  shippingDeliveryMethod: string;
  billingFirstName: string;
  billingLastName: string;
  billingStreetName: string;
  billingStreetNumber: string;
  billingAddressMore: string;
  billingCity: string;
  billingCountry: { label: string; value: string };
  billingRegion: { label: string; value: string };
  billingPostalCode: string;
  billingSameAsShipping: string;
};

export const action: ActionFunction = async ({ request }) => {
  let cart = await getActiveCart(request);
  const data = await request.formData();

  const billingSameAsShipping = data.get("billingSameAsShipping") === "on";

  const form = billingSameAsShipping
    ? await validator.validate(data)
    : await validatorWithBillingInfo.validate(data);

  // Throw error if something went wrong loading Commercetools
  if (!cart) throw new Error("Something went wrong loading Commercetools.");

  // Throw error if form is state invalid
  if (form.error) return validationError(form.error);

  // Save email & address data to cart
  const formData = form.data as FormData;

  await addAddressesAndEmailToCart(
    cart.id,
    cart.version,
    formData.email,
    {
      email: formData.email,
      firstName: formData.shippingFirstName,
      lastName: formData.shippingLastName,
      streetName: formData.shippingStreetName,
      streetNumber: formData.shippingStreetNumber,
      city: formData.shippingCity,
      country: formData.shippingCountry.value,
      region: formData.shippingRegion.value,
      postalCode: formData.shippingPostalCode,
      phone: formData.shippingPhone,
    },
    formData.billingSameAsShipping === "on"
      ? {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          streetName: formData.shippingStreetName,
          streetNumber: formData.shippingStreetNumber,
          city: formData.shippingCity,
          country: formData.shippingCountry.value,
          region: formData.shippingRegion.value,
          postalCode: formData.shippingPostalCode,
        }
      : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          streetName: formData.billingStreetName,
          streetNumber: formData.billingStreetNumber,
          additionalStreetInfo: formData.billingAddressMore,
          city: formData.billingCity,
          country: formData.billingCountry.value,
          region: formData.billingRegion.value,
          postalCode: formData.billingPostalCode,
        },
    request
  );

  return redirect("/commercetools/checkout/shipping");
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const locale = await i18n.getLocale(request);
  const cart = await getActiveCart(request);
  const user = await handleGetCurrentCustomer(request);

  if (!cart) {
    throw new Error("Something went wrong loading Commercetools.");
  }

  return {
    cart,
    locale,
    user,
  };
};

const country = z.object({ label: z.string(), value: z.string() });
const region = z.object({ label: z.string(), value: z.string() });
// Base shipping info schema
const shippingInfo = {
  email: z.string().regex(new RegExp(/^\S+@\S+\.\S+$/), {
    message: "Please enter a valid email",
  }),
  shippingFirstName: z.string().min(1, { message: "First Name is required" }),
  shippingLastName: z.string().min(1, { message: "Last Name is required" }),
  shippingStreetName: z.string().min(1, { message: "Street is required" }),
  shippingStreetNumber: z
    .string()
    .min(1, { message: "Street Number is required" }),
  shippingAddressMore: z.string().optional(),
  shippingCity: z.string().min(1, { message: "City is required" }),
  shippingCountry: country.required(),
  shippingRegion: region.required(),
  shippingDeliveryMethod: z.string().optional(),
  shippingPostalCode: z.string().min(1, { message: "Postal Code is required" }),
  shippingPhone: z.string().min(1, { message: "Phone is required" }),
  billingSameAsShipping: z.string().optional(),
};
// Base billing info schema
const billingInfo = {
  billingFirstName: z.string().min(1, { message: "First Name is required" }),
  billingLastName: z.string().min(1, { message: "Last Name is required" }),
  billingStreetName: z.string().min(1, { message: "Street is required" }),
  billingStreetNumber: z
    .string()
    .min(1, { message: "Street Number is required" }),
  billingAddressMore: z.string().optional(),
  billingCity: z.string().min(1, { message: "City is required" }),
  billingCountry: country.required(),
  billingRegion: region.required(),
  billingPostalCode: z.string().min(1, { message: "Postal Code is required" }),
};

// Default validator when billing address is the same as shipping address
export const validator = withZod(z.object(shippingInfo));
// Validator when billing address is different from shipping address
export const validatorWithBillingInfo = withZod(
  z.object({
    ...shippingInfo,
    ...billingInfo,
  })
);

export default function Checkout() {
  const { user, cart } = useLoaderData<LoaderData>();
  const { state } = useNavigation();
  const { t } = useTranslation("commercetools");

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("ship");

  /**
   * This is a big block of code that is used to populate the country and region
   * and repeats itself in the billing and shipping address forms.
   * Feel free to rip this out and replace it with your own implementation.
   */
  const { allCountries, getCountryRegions } = useCountries();

  const defaultShippingCountry =
    allCountries.find(
      (country) => country.value === cart?.shippingAddress?.country
    ) || null;
  const defaultBillingCountry =
    allCountries.find(
      (country) => country.value === cart?.billingAddress?.country
    ) || null;
  const defaultShippingRegion = getCountryRegions(
    defaultShippingCountry || {
      label: "",
      value: "",
    }
  )?.find((region) => region.value === cart?.shippingAddress?.region);
  const defaultBillingRegion = getCountryRegions(
    defaultBillingCountry || {
      label: "",
      value: "",
    }
  )?.find((region) => region.value === cart?.billingAddress?.region);

  const [selectedShippingCountry, setSelectedShippingCountry] = useState(
    defaultShippingCountry
  );
  const selectedShippingCountryRegion = useMemo(() => {
    if (!selectedShippingCountry) {
      return [{ label: "", value: "" }];
    } else {
      return getCountryRegions(selectedShippingCountry);
    }
  }, [getCountryRegions, selectedShippingCountry]);

  const [selectedBillingCountry, setSelectedBillingCountry] = useState(
    defaultBillingCountry
  );
  const selectedBillingCountryRegion = useMemo(() => {
    if (!selectedBillingCountry) {
      return [{ label: "", value: "" }];
    } else {
      return getCountryRegions(selectedBillingCountry);
    }
  }, [getCountryRegions, selectedBillingCountry]);
  /**
   * End of country and region code
   */

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="mt-4 lg:mt-8">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 whitespace-nowrap text-xl font-bold">
              {t("Contact information")}
            </h2>
            {!user && (
              <div className="ml-2 pb-2 text-xs">
                {t("Already have an account?")}&nbsp;
                <Link to="/commercetools/login">{t("Log in")}</Link>
              </div>
            )}
          </div>
          <ValidatedForm
            validator={
              billingSameAsShipping ? validator : validatorWithBillingInfo
            }
            method="post"
            subaction="shipping"
          >
            <ValidatedFormInput
              name="email"
              label=""
              placeholder={t("Email")}
              defaultValue={cart.customerEmail}
            />
            <DeliveryMethod
              value={deliveryMethod}
              setValue={setDeliveryMethod}
            />
            <div className="mt-4 lg:mt-8">
              <h2 className="mb-4 whitespace-nowrap text-xl font-bold">
                {t("Shipping address")}
              </h2>
              <ValidatedFormInput
                name="shippingFirstName"
                label=""
                placeholder={t("First Name")}
                defaultValue={cart.shippingAddress?.firstName}
              />
              <ValidatedFormInput
                name="shippingLastName"
                label=""
                placeholder={t("Last Name")}
                defaultValue={cart.shippingAddress?.lastName}
              />
              <ValidatedSelect
                name="shippingCountry"
                label=""
                placeholder={t("Country") as string}
                options={allCountries}
                onChange={setSelectedShippingCountry}
                defaultValue={defaultShippingCountry}
              />
              <div className="grid grid-cols-3 gap-1">
                <ValidatedFormInput
                  name="shippingStreetNumber"
                  label=""
                  placeholder={t("Street Number")}
                  className="col-span-3 lg:col-span-1"
                  defaultValue={cart.shippingAddress?.streetNumber}
                />
                <ValidatedFormInput
                  name="shippingStreetName"
                  label=""
                  placeholder={t("Street Name")}
                  className="col-span-3 lg:col-span-2"
                  defaultValue={cart.shippingAddress?.streetName}
                />
              </div>

              <ValidatedFormInput
                name="shippingAddressMore"
                label=""
                placeholder={t("Apartment, suite, etc. (optional)")}
                defaultValue={cart.shippingAddress?.additionalStreetInfo}
              />
              <ValidatedFormInput
                name="shippingCity"
                label=""
                placeholder={t("City")}
                defaultValue={cart.shippingAddress?.city}
              />
              <ValidatedSelect
                name="shippingRegion"
                className={clsx(
                  !selectedShippingCountry && "hidden",
                  "transition-all"
                )}
                label=""
                placeholder={t("Region/Province") as string}
                options={
                  selectedShippingCountryRegion || [{ value: "", label: "" }]
                }
                defaultValue={defaultShippingRegion}
              />
              <ValidatedFormInput
                name="shippingPostalCode"
                label=""
                placeholder={t("Postal Code")}
                defaultValue={cart.shippingAddress?.postalCode}
              />
              <ValidatedFormInput
                name="shippingPhone"
                label=""
                placeholder={t("Phone")}
                defaultValue={cart.shippingAddress?.phone}
              />
            </div>

            <div className="mt-4 lg:mt-8">
              <div className="mb-4">
                <h2 className="whitespace-nowrap text-xl font-bold">
                  {t("Billing address")}
                </h2>
                <ValidatedFormCheckbox
                  name="billingSameAsShipping"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setBillingSameAsShipping(e.target.checked);
                  }}
                  className="pt-6"
                  label={t("Same as shipping address")}
                />
              </div>
            </div>
            {!billingSameAsShipping && (
              <div>
                <ValidatedFormInput
                  name="billingFirstName"
                  label=""
                  placeholder={t("First Name")}
                  defaultValue={cart.billingAddress?.firstName}
                />
                <ValidatedFormInput
                  name="billingLastName"
                  label=""
                  placeholder={t("Last Name")}
                  defaultValue={cart.billingAddress?.lastName}
                />
                <ValidatedSelect
                  name="billingCountry"
                  label=""
                  placeholder={t("Country") as string}
                  options={allCountries}
                  onChange={setSelectedBillingCountry}
                  defaultValue={defaultBillingCountry}
                />
                <div className="grid grid-cols-3 gap-1">
                  <ValidatedFormInput
                    name="billingStreetNumber"
                    label=""
                    placeholder={t("Street Number")}
                    className="col-span-3 lg:col-span-1"
                    defaultValue={cart.billingAddress?.streetNumber}
                  />
                  <ValidatedFormInput
                    name="billingStreetName"
                    label=""
                    placeholder={t("Street Name")}
                    className="col-span-3 lg:col-span-2"
                    defaultValue={cart.billingAddress?.streetName}
                  />
                </div>

                <ValidatedFormInput
                  name="billingAddressMore"
                  label=""
                  placeholder={t("Apartment, suite, etc. (optional)")}
                  defaultValue={cart.billingAddress?.additionalStreetInfo}
                />
                <ValidatedFormInput
                  name="billingCity"
                  label=""
                  placeholder={t("City")}
                  defaultValue={cart.billingAddress?.city}
                />
                <ValidatedSelect
                  name="billingRegion"
                  className={clsx(
                    !selectedBillingCountry && "hidden",
                    "transition-all"
                  )}
                  label=""
                  placeholder={t("Region/Province") as string}
                  options={
                    selectedBillingCountryRegion || [{ value: "", label: "" }]
                  }
                  defaultValue={defaultBillingRegion}
                />
                <ValidatedFormInput
                  name="billingPostalCode"
                  label=""
                  placeholder={t("Postal Code")}
                  defaultValue={cart.billingAddress?.postalCode}
                />
              </div>
            )}
            <div className="mb-12 mt-12 flex items-center justify-between md:mb-20">
              <Link to="/commercetools/cart" className="flex items-center">
                <ChevronLeftIcon className="inline-block h-4 w-4 text-primary" />
                {t("Return to cart")}
              </Link>
              <Button
                type="submit"
                className="text-sm font-semibold uppercase"
                disabled={state === "submitting"}
              >
                {state === "submitting"
                  ? t("Saving...")
                  : t("Continue to shipping")}
              </Button>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </>
  );
}
