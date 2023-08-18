import {
  useProductOptions,
  AddToCartButton,
  ProductOptionsProvider,
} from "@shopify/hydrogen";
import type { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";

import { Price } from "./Price";
import { Button } from "~/components/interactive/Button";
import Gallery from "./ProductGallery";
import ProductOptions from "./ProductOptions";

function AddToCartMarkup() {
  const { selectedVariant } = useProductOptions();
  const isOutOfStock = !selectedVariant?.availableForSale;

  return (
    <div className="mb-8 space-y-2">
      <AddToCartButton disabled={isOutOfStock}>
        <Button as="span" variant="primary" disabled={isOutOfStock}>
          {isOutOfStock ? "Out of Stock" : "Add to Bag"}
        </Button>
      </AddToCartButton>
    </div>
  );
}

function PriceMarkup() {
  const { selectedVariant } = useProductOptions();

  return (
    <div className="flex flex-row items-center gap-2">
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
  const initialVariant = product.variants.nodes[0];

  return (
    <>
      <ProductOptionsProvider
        data={product}
        initialVariantId={initialVariant.id}
      >
        <div className="my-16 grid grid-cols-1 gap-x-8 md:grid-cols-[7fr,5fr]">
          <div className="mb-8 mt-5 md:hidden">
            {product.vendor && (
              <div className="mb-2 text-sm font-medium text-gray-900">
                {product.vendor}
              </div>
            )}
            <h1>{product.title}</h1>
            <PriceMarkup />
          </div>

          <Gallery product={product} />

          <div>
            <div className="hidden flex-row items-end justify-between md:flex">
              <div>
                {product.vendor && <h5 className="mb-2">{product.vendor}</h5>}
                <h2>{product.title}</h2>
              </div>
              <PriceMarkup />
            </div>
            <div className="flex justify-between md:block"></div>
            <div className="mt-8">
              <div className="mb-2">
                <ProductOptions />
              </div>
              <AddToCartMarkup />
            </div>
            <div className="text-md pt-6 text-black">{product.description}</div>
          </div>
        </div>
      </ProductOptionsProvider>
    </>
  );
}
