import {
  Cart,
  Customer,
  ProductProjection,
  ProductVariant,
} from "@commercetools/platform-sdk";
import { Form, useTransition } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Price } from "~/commercetools/components/Price";
import { Button } from "~/components/interactive/Button";
import Gallery from "./ProductGallery";
import { ProductVariants } from "./ProductVariants";

export type ProductDetailsProps = {
  product: ProductProjection;
  locale: string;
  children?: React.ReactNode;
  cart: Cart;
  customer: Customer | null;
};

export const ProductDetails = ({
  product,
  locale,
  cart,
  customer,
}: ProductDetailsProps) => {
  const [activeVariant, setActiveVariant] = useState<
    ProductVariant | undefined
  >(product.masterVariant);
  const transition = useTransition();
  const { t } = useTranslation("commercetools");

  const cartCurrency = cart?.totalPrice?.currencyCode;
  const isAddingToCart = transition.state === "submitting";

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

  return (
    <div className="m-10">
      <div className="my-16 grid grid-cols-1 gap-x-8 md:grid-cols-[7fr,5fr]">
        <div className="mb-8 mt-5 md:hidden">
          <h1>{product?.name[locale]}</h1>
          {activeVariant?.prices?.[0] && (
            <Price
              price={activeVariant.prices[0].value}
              locale={locale}
              className="text-xl font-bold"
            />
          )}
        </div>

        <Gallery
          product={product}
          locale={locale}
          activeVariant={activeVariant}
        />

        <div>
          <div className="hidden flex-row items-end justify-between md:flex">
            <div>
              <h2>{product?.name[locale]}</h2>
            </div>
            {activeVariant?.prices?.[0] && (
              <Price
                price={price}
                locale={locale}
                className="text-xl font-bold"
              />
            )}
          </div>
          <div className="flex justify-between md:block"></div>
          <div className="mt-8">
            <div className="mb-2"></div>
            <ProductVariants
              product={product}
              locale={locale}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
            />
          </div>
          <div className="text-md mb-6 pt-6 text-black">
            {product?.description?.[locale]}
          </div>
          <div className="mb-8 space-y-2">
            <Form method="post">
              <input
                type="hidden"
                name="addToCartAction"
                value={JSON.stringify({
                  activeVariant,
                  id: cart.id,
                  version: cart.version,
                })}
              />
              <Button
                type="submit"
                disabled={
                  !activeVariant?.availability?.isOnStock || isAddingToCart
                }
              >
                {activeVariant
                  ? !activeVariant?.availability?.isOnStock
                    ? t("Out of Stock")
                    : isAddingToCart
                    ? t("Adding to Bag...")
                    : t("Add to Bag")
                  : t("Unavailable")}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
