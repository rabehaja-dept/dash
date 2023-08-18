import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import type { ParsedUrlQuery } from "querystring";
import { getProduct } from "~/commercetools/product.server";
import {
  Cart,
  Customer,
  ProductProjection,
  ProductVariant,
} from "@deptdash/commercetools";
import Layout from "~/layouts/commercetools/base-layout";
import Gallery from "~/commercetools/components/product/ProductGallery";
import { Price } from "~/components/price";
import { ProductVariants } from "~/commercetools/components/product/ProductVariants";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getActiveCart } from "~/commercetools/utils/cart";
import { useCommercetoolsCart } from "~/commercetools/context/CommercetoolsCartContext";
import { motion } from "framer-motion";
import styles from "./slug.module.css";
import Spinner from "~/components/loader/Spinner";
import { getCurrentCustomerHandler } from "~/pages/api/commercetools/customer";

const scaleUp = {
  hover: { scale: 1.05 },
};

interface ProductPageProps {
  product?: ProductProjection;
  locale: string;
  customer: Customer | null;
}

export default function ProductPage({
  product,
  locale,
  customer,
}: ProductPageProps) {
  const { handleSubmit } = useForm();
  const [activeVariant, setActiveVariant] = useState<
    ProductVariant | undefined
  >(product.masterVariant);
  const { cart, setCart } = useCommercetoolsCart();
  const [cartCurrency, setCartCurrency] = useState<string | undefined>(
    cart?.totalPrice?.currencyCode
  ); // Use state for cartCurrency
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddToCart() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/commercetools/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cart.id,
          version: cart.version,
          sku: activeVariant.sku,
        }),
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to add to cart");
      }

      const activeCart = await getActiveCart();
      setCart(activeCart);
      setIsLoading(false);
    } catch (error) {
      // Handle error
      setIsLoading(false);
      console.error(error);
    }
  }

  const prices = activeVariant?.prices?.filter(
    (price) => price.value?.currencyCode === cartCurrency
  );

  const embeddedPrice = prices?.filter(
    (price) => price.customerGroup?.id === customer?.customerGroup?.id
  );

  const price = embeddedPrice?.length
    ? embeddedPrice[0]?.value
    : prices?.length
    ? prices[0]?.value
    : null;

  if (!product) {
    return (
      <Layout>
        <div>
          <h2>This product doesn't exist</h2>
        </div>
      </Layout>
    );
  }
  const gridTemplateColumns = "2fr 2fr";
  return (
    <Layout>
      <div>
        <div style={{ display: "grid", gridTemplateColumns }}>
          <Gallery
            product={product}
            locale={locale}
            activeVariant={activeVariant}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>
                <h2>{product?.name[locale]}</h2>
              </div>
              {activeVariant?.prices?.[0] && (
                <Price price={price} locale={locale} />
              )}
            </div>
            <div>
              <ProductVariants
                product={product}
                locale={locale}
                activeVariant={activeVariant}
                setActiveVariant={setActiveVariant}
              />
            </div>
            <div>{product?.description?.[locale]}</div>
            <div>
              <form onSubmit={handleSubmit(handleAddToCart)}>
                <motion.button
                  type="submit"
                  className={styles.button}
                  disabled={!activeVariant?.availability?.isOnStock}
                  whileHover="hover"
                  variants={scaleUp}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : activeVariant ? (
                    !activeVariant?.availability?.isOnStock ? (
                      "Out of Stock"
                    ) : (
                      "Add to Bag"
                    )
                  ) : (
                    "Unavailable"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<
  ProductPageProps,
  ParsedUrlQuery
> = async (context) => {
  const locale = context.locale || context.defaultLocale || "en-US";
  const productSlug = context.params?.slug;
  const customer = await getCurrentCustomerHandler(
    context.req as NextApiRequest,
    context.res as NextApiResponse
  );

  if (!productSlug || Array.isArray(productSlug)) {
    return {
      notFound: true,
    };
  }

  const product = await getProduct(productSlug, locale);

  return {
    props: {
      product: product.length ? product[0] : undefined,
      locale,
      customer,
    },
  };
};
