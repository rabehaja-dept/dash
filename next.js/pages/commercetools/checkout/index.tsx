import { Cart, Customer } from "@deptdash/commercetools";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getActiveCart } from "~/commercetools/cart.server";
import { DeliveryMethod } from "~/commercetools/components/checkout/DeliveryMethod";
import { ValidatedFormCheckbox } from "~/components/forms/ValidatedFormCheckboxProps";
import ValidatedFormInput from "~/components/forms/ValidatedFormInput";
import ValidatedSelect from "~/components/forms/ValidatedSelect";
import { useCountries } from "~/hooks/useCountries";
import Checkout from "~/layouts/commercetools/checkout-layout";
import { getCurrentCustomerHandler } from "~/pages/api/commercetools/customer";
import styles from "./checkout.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Spinner from "~/components/loader/Spinner";

const scaleUp = {
  hover: { scale: 1.05 },
};

interface CheckoutIndexProps {
  locale: string;
  user: Customer | null;
  cart: Cart | null;
}

export type FormInputs = {
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

export default function CheckoutIndex({
  locale,
  user,
  cart,
}: CheckoutIndexProps) {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("ship");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data) => {
    setIsLoading(true);
    const url = "/api/commercetools/cart/addAddressesAndEmailToCart";
    if (!cart) {
      setIsLoading(false);
      throw new Error("Something went wrong loading Commercetools.");
    }
    const dataToSend = {
      cartId: cart.id,
      version: cart.version,
      email: data.email,
      shippingAddress: {
        email: data.email,
        firstName: data.shippingFirstName,
        lastName: data.shippingLastName,
        streetName: data.shippingStreetName,
        streetNumber: data.shippingStreetNumber,
        city: data.shippingCity,
        country: data.shippingCountry,
        region: data.shippingRegion,
        postalCode: data.shippingPostalCode,
        phone: data.shippingPhone,
      },
      billingAddress:
        billingSameAsShipping === true
          ? {
              firstName: data.shippingFirstName,
              lastName: data.shippingLastName,
              streetName: data.shippingStreetName,
              streetNumber: data.shippingStreetNumber,
              city: data.shippingCity,
              country: data.shippingCountry,
              region: data.shippingRegion,
              postalCode: data.shippingPostalCode,
            }
          : {
              firstName: data.billingFirstName,
              lastName: data.billingLastName,
              streetName: data.billingStreetName,
              streetNumber: data.billingStreetNumber,
              additionalStreetInfo: data.billingAddressMore,
              city: data.billingCity,
              country: data.billingCountry,
              region: data.billingRegion,
              postalCode: data.billingPostalCode,
            },
    };

    axios
      .post(url, dataToSend)
      .then((response) => {
        setIsLoading(false);
        router.push("/commercetools/checkout/shipping");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const { allCountries, getCountryRegions } = useCountries();

  const defaultShippingCountry =
    allCountries.find(
      (country) => country.value === cart?.shippingAddress?.country
    ) || null;

  const defaultShippingRegion = getCountryRegions(
    defaultShippingCountry || {
      label: "",
      value: "",
    }
  )?.find((region) => region.value === cart?.shippingAddress?.region);

  const defaultBillingCountry =
    allCountries.find(
      (country) => country.value === cart?.billingAddress?.country
    ) || null;

  const defaultBillingRegion = getCountryRegions(
    defaultBillingCountry || {
      label: "",
      value: "",
    }
  )?.find((region) => region.value === cart?.billingAddress?.region);
  const findCountry = (addressCountry) =>
    allCountries.find((country) => country.value === addressCountry) || null;

  const [selectedBillingCountry, setSelectedBillingCountry] = useState(
    findCountry(cart?.billingAddress?.country)
  );

  const [selectedShippingCountry, setSelectedShippingCountry] = useState(
    findCountry(cart?.shippingAddress?.country)
  );

  const [shippingCountryRegions, setShippingCountryRegions] = useState([]);
  const [billingCountryRegions, setBillingCountryRegions] = useState([
    { label: "", value: "" },
  ]);
  const [selectedShippingCountryRegion, setSelectedShippingCountryRegion] =
    useState([{ label: "", value: "" }]);

  const [selectedBillingCountryRegion, setSelectedBillingCountryRegion] =
    useState([{ label: "", value: "" }]);

  const handleShippingCountryChange = (event) => {
    const selectedCountry = allCountries.find(
      (country) => country.value === event.target.value
    );
    setSelectedShippingCountry(selectedCountry);

    if (selectedShippingCountry) {
      const regions = getCountryRegions(selectedShippingCountry);
      setShippingCountryRegions(regions);
    } else {
      setShippingCountryRegions([]);
    }
  };

  const handleBillingCountryChange = (event) => {
    const selectedCountry = allCountries.find(
      (country) => country.value === event.target.value
    );
    setSelectedBillingCountry(selectedCountry);

    if (selectedBillingCountry) {
      const regions = getCountryRegions(selectedBillingCountry);
      setBillingCountryRegions(regions);
    } else {
      setBillingCountryRegions([]);
    }
  };

  const handleBillingRegionChange = (event) => {
    setSelectedBillingCountryRegion(event);
  };

  const handleRegionChange = (event) => {
    setSelectedShippingCountryRegion(event);
  };

  useEffect(() => {
    if (selectedShippingCountry) {
      const regions = getCountryRegions(selectedShippingCountry);
      setShippingCountryRegions(regions);
    } else {
      setShippingCountryRegions([]);
    }
  }, [selectedShippingCountry, getCountryRegions]);

  useEffect(() => {
    if (selectedBillingCountry) {
      const regions = getCountryRegions(selectedBillingCountry);
      setBillingCountryRegions(regions);
    } else {
      setBillingCountryRegions([]);
    }
  }, [selectedBillingCountry, getCountryRegions]);

  const methods = useForm();

  return (
    <Checkout>
      <div className={styles.container}>
        <div className={`${styles.container} ${styles.marginTop}`}>
          <div className={`${styles.container} ${styles.marginTop}`}>
            <h2 className={styles.title}>{"Contact information"}</h2>
            {!user && (
              <div className={styles.linkContainer}>
                {"Already have an account?"}&nbsp;
                <Link href="/commercetools/login">{"Log in"}</Link>
              </div>
            )}
          </div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ValidatedFormInput
                name="email"
                label=""
                placeholder="Email"
                required
                {...methods.register("email", {
                  required: "Please enter a valid email",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                })}
                defaultValue={cart.customerEmail}
              />
              <DeliveryMethod
                value={deliveryMethod}
                setValue={setDeliveryMethod}
              />

              <div className={styles.shippingAddressContainer}>
                <h2 className={styles.shippingAddressTitle}>
                  Shipping address
                </h2>
                <ValidatedFormInput
                  name="shippingFirstName"
                  label=""
                  placeholder="First Name"
                  required
                  defaultValue={cart.shippingAddress?.firstName}
                  {...methods.register("shippingFirstName", {
                    required: "First Name is required",
                  })}
                />

                <ValidatedFormInput
                  name="shippingLastName"
                  label="Last Name"
                  placeholder="Last Name"
                  required
                  defaultValue={cart.shippingAddress?.lastName}
                  {...methods.register("shippingLastName", {
                    required: "Last Name is required",
                  })}
                />

                <ValidatedSelect
                  name="shippingCountry"
                  required
                  onChange={handleShippingCountryChange}
                  defaultValue={defaultShippingCountry?.value}
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  {allCountries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </ValidatedSelect>
                <div className={styles.shippingStreet}>
                  <ValidatedFormInput
                    name="shippingStreetNumber"
                    label=""
                    placeholder="Street Number"
                    className={styles.shippingStreetNumber}
                    required
                    defaultValue={cart?.shippingAddress?.streetNumber}
                    {...methods.register("shippingStreetNumber", {
                      required: "Street Number is required",
                    })}
                  />

                  <ValidatedFormInput
                    name="shippingStreetName"
                    label=""
                    placeholder="Street Name"
                    className={styles.shippingStreetName}
                    required
                    defaultValue={cart?.shippingAddress?.streetName}
                    {...methods.register("shippingStreetName", {
                      required: "Street Name is required",
                    })}
                  />
                </div>

                <ValidatedFormInput
                  name="shippingAddressMore"
                  label=""
                  placeholder="Apartment, suite, etc. (optional)"
                  defaultValue={cart.shippingAddress?.additionalStreetInfo}
                  {...methods.register("shippingAddressMore")}
                />

                <ValidatedFormInput
                  name="shippingCity"
                  label=""
                  placeholder="City"
                  defaultValue={cart.shippingAddress?.city}
                  {...methods.register("shippingCity", {
                    required: "City is required",
                  })}
                />
                <ValidatedSelect
                  name="shippingRegion"
                  required
                  onChange={handleRegionChange}
                  placeholder="Region/Province"
                  defaultValue={defaultShippingRegion?.value}
                >
                  <option value="" disabled>
                    Select a Region
                  </option>
                  {shippingCountryRegions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </ValidatedSelect>
                <ValidatedFormInput
                  name="shippingPostalCode"
                  label=""
                  placeholder="Postal Code"
                  defaultValue={cart.shippingAddress?.postalCode}
                  {...methods.register("shippingPostalCode", {
                    required: "Postal Code is required",
                  })}
                />

                <ValidatedFormInput
                  name="shippingPhone"
                  label=""
                  placeholder="Phone"
                  defaultValue={cart.shippingAddress?.phone}
                  {...methods.register("shippingPhone", {
                    required: "Phone is required",
                  })}
                />
              </div>

              <div className={styles.shippingAddressContainer}>
                <h2 className={styles.shippingAddressTitle}>Billing address</h2>

                <div className="mb-4">
                  <ValidatedFormCheckbox
                    name="billingSameAsShipping"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setBillingSameAsShipping(e.target.checked);
                    }}
                    label="Same as shipping address"
                  />
                </div>
                {!billingSameAsShipping && (
                  <div>
                    <ValidatedFormInput
                      name="billingFirstName"
                      label=""
                      placeholder="First Name"
                      required
                      defaultValue={cart.billingAddress?.firstName}
                      {...methods.register("billingFirstName", {
                        required: "First Name is required",
                      })}
                    />

                    <ValidatedFormInput
                      name="billingLastName"
                      label="Last Name"
                      placeholder="Last Name"
                      required
                      defaultValue={cart.billingAddress?.lastName}
                      {...methods.register("billingLastName", {
                        required: "Last Name is required",
                      })}
                    />

                    <ValidatedSelect
                      name="billingCountry"
                      required
                      onChange={handleBillingCountryChange}
                      placeholder="Country"
                      defaultValue={defaultBillingCountry?.value}
                    >
                      <option value="" disabled>
                        Select a Country
                      </option>
                      {allCountries.map((country) => (
                        <option
                          key={country.value}
                          value={country.value}
                          defaultValue={defaultBillingCountry?.value}
                        >
                          {country.label}
                        </option>
                      ))}
                    </ValidatedSelect>

                    <div className={styles.shippingStreet}>
                      <ValidatedFormInput
                        name="billingStreetNumber"
                        label=""
                        placeholder="Street Number"
                        className={styles.shippingStreetNumber}
                        required
                        defaultValue={cart?.billingAddress?.streetNumber}
                        {...methods.register("billingStreetNumber", {
                          required: "Street Number is required",
                        })}
                      />

                      <ValidatedFormInput
                        name="billingStreetName"
                        label=""
                        placeholder="Street Name"
                        className={styles.shippingStreetName}
                        defaultValue={cart?.billingAddress?.streetName}
                        required
                        {...methods.register("billingStreetName", {
                          required: "Street Name is required",
                        })}
                      />
                    </div>

                    <ValidatedFormInput
                      name="billingAddressMore"
                      label=""
                      placeholder="Apartment, suite, etc. (optional)"
                      defaultValue={cart.billingAddress?.additionalStreetInfo}
                    />

                    <ValidatedFormInput
                      name="billingCity"
                      label=""
                      placeholder="City"
                      defaultValue={cart.billingAddress?.city}
                    />
                    <ValidatedSelect
                      name="billingRegion"
                      required
                      onChange={handleBillingRegionChange}
                      placeholder="Region/Province"
                      defaultValue={defaultBillingRegion?.value}
                    >
                      <option value="" disabled>
                        Select a Region
                      </option>
                      {billingCountryRegions.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </ValidatedSelect>
                    <ValidatedFormInput
                      name="billingPostalCode"
                      label=""
                      placeholder="Postal Code"
                      defaultValue={cart.billingAddress?.postalCode}
                    />
                  </div>
                )}
              </div>
              <motion.button
                type="submit"
                className={styles.button}
                whileHover="hover"
                variants={scaleUp}
              >
                {isLoading ? <Spinner /> : "Continue"}
              </motion.button>
            </form>
          </FormProvider>
        </div>
      </div>
    </Checkout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, req, res } = context;
  const user = await getCurrentCustomerHandler(
    req as NextApiRequest,
    res as NextApiResponse
  );
  const cart = await getActiveCart(
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      locale,
      user,
      cart,
    },
  };
};
