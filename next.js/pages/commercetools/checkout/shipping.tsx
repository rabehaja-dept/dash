import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useEffect, useState } from "react";
import { getActiveCart } from "~/commercetools/cart.server";
import { CheckoutInformation } from "~/commercetools/components/checkout/CheckoutInformation";
import { ShippingMethod } from "~/commercetools/components/checkout/ShippingMethod";
import { getShippingMethods } from "~/commercetools/shipping.server";
import Checkout from "~/layouts/commercetools/checkout-layout";
import styles from "./shipping.module.css";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import Spinner from "~/components/loader/Spinner";

const scaleUp = {
  hover: { scale: 1.05 },
};

export default function Shipping({
  cart,
  locale,
  shippingMethods,
  existingShippingMethod,
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(
    existingShippingMethod
  );

  const handleChange = async (shippingMethod) => {
    setIsSaving(true);
    const response = await fetch("/api/commercetools/cart/setShippingMethod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cart.id,
        shippingMethodId: shippingMethod,
      }),
    });
    if (!response.ok) {
      console.log(response);
    }
    setIsSaving(false);
  };

  useEffect(() => {
    if (selectedShippingMethod) {
      handleChange(selectedShippingMethod.id);
    }
  }, [selectedShippingMethod]);
  return (
    <Checkout>
      <CheckoutInformation cart={cart} />
      <form className={styles.form}>
        <ShippingMethod
          existingShippingMethod={existingShippingMethod}
          shippingOptions={shippingMethods}
          locale={locale}
          onShippingMethodChange={setSelectedShippingMethod}
        />
        <div className={styles.link}>
          <a href="/commercetools/cart" className={styles.icon}>
            <motion.button
              type="button"
              className={styles.returnButton}
              whileHover="hover"
              variants={scaleUp}
            >
              <FaChevronLeft />
              {"Return to cart"}
            </motion.button>
          </a>
          <Link href={"/commercetools/checkout/stripe/payment"}>
            <motion.button
              type="button"
              className={styles.button}
              disabled={isSaving}
              whileHover="hover"
              variants={scaleUp}
              onClick={() => setIsSaving(true)}
            >
              {isSaving ? <Spinner /> : "Continue with Stripe"}
            </motion.button>
          </Link>
        </div>
      </form>
    </Checkout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, req, res } = context;

  const [cart, shippingMethods] = await Promise.all([
    getActiveCart(req as NextApiRequest, res as NextApiResponse),
    getShippingMethods(),
  ]);

  const existingShippingMethod =
    shippingMethods?.find(
      (method) => method.id === cart?.shippingInfo?.shippingMethod?.id
    ) || null;

  return {
    props: {
      locale,
      cart,
      shippingMethods,
      existingShippingMethod,
    },
  };
};
