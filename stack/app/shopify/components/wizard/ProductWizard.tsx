import {
  useProductOptions,
  AddToCartButton,
  ProductOptionsProvider,
} from "@shopify/hydrogen";
import type { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import { Price } from "../Price";
import { Button } from "~/components/interactive/Button";
import ProductWizardOptions from "./ProductWizardOptions";
import { ProductWizardImage } from "./ProductWizardImage";

function AddToCartMarkup() {
  const { selectedVariant } = useProductOptions();
  const isSelected = !!selectedVariant;
  const isOutOfStock = isSelected && !selectedVariant?.availableForSale;

  return (
    <div className="w-full space-y-2">
      <AddToCartButton disabled={isOutOfStock} className="w-full">
        <Button
          as="span"
          variant="primary"
          disabled={!isSelected || isOutOfStock}
          block
        >
          {isOutOfStock ? "Out of Stock" : "Add to Bag"}
        </Button>
      </AddToCartButton>
    </div>
  );
}

type PriceMarkUpProps = {
  product: Product;
};

function PriceMarkup({ product }: PriceMarkUpProps) {
  const { selectedVariant } = useProductOptions();

  if (!selectedVariant) {
    return (
      <div className="flex flex-row items-center gap-2">
        Starting at
        <Price
          amount={product.priceRange.minVariantPrice.amount || "0"}
          currencyCode={
            product.priceRange.minVariantPrice.currencyCode || "USD"
          }
          className="text-[2rem] font-bold"
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row items-center gap-2">
      {selectedVariant?.compareAtPriceV2?.amount && (
        <Price
          amount={parseFloat(selectedVariant.compareAtPriceV2.amount)}
          currencyCode={selectedVariant.compareAtPriceV2.currencyCode || "USD"}
          className="text-gray-500 line-through"
        />
      )}
      <Price
        amount={selectedVariant?.priceV2?.amount || "0"}
        currencyCode={selectedVariant?.priceV2?.currencyCode || "USD"}
        className="text-[2rem] font-bold"
      />
    </div>
  );
}

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <ProductOptionsProvider data={product} initialVariantId={null}>
        <section className="relative mx-4 mb-48 mt-16 grid grid-cols-4 gap-12 md:mx-24">
          <div className="top-0 col-span-4 md:col-span-3">
            <div className="sticky top-32 text-2xl font-bold">
              <ProductWizardImage product={product} />
            </div>
          </div>
          <div className="col-span-4 h-full md:col-span-1">
            <h1>{product.title}</h1>
            <ProductWizardOptions />
            <div className="flex flex-col gap-4 bg-background-accent-base p-4">
              <PriceMarkup product={product} />
              <AddToCartMarkup />
            </div>
          </div>
        </section>
      </ProductOptionsProvider>
    </>
  );
}
