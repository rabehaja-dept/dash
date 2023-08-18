import {
  ProductProvider,
  useProduct,
  ProductPrice,
  AddToCartButton,
  MediaFile,
} from "@shopify/hydrogen-react";
import type { Product as ProductType } from "@shopify/hydrogen-react/storefront-api-types";
import ProductNotFound from "./product-not-found";

interface ProductDetailsProps {
  product: ProductType;
}

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
  product,
}) => {
  return product ? (
    <ProductProvider
      data={product}
      initialVariantId={product?.variants[0]?.id || ""}
    >
      <ProductInfo />
    </ProductProvider>
  ) : (
    <ProductNotFound />
  );
};

const ProductInfo: React.FunctionComponent = () => {
  const { product, variants, selectedVariant, setSelectedVariant } =
    useProduct();
  const variantId = variants[0]?.id || "";

  if (!selectedVariant) {
    setSelectedVariant(variants[0]);
  }

  return (
    <section>
      {product.vendor && <div>{product.vendor}</div>}
      <h1>{product?.title}</h1>
      <ProductPrice
        data={product}
        priceType="regular"
        valueType="min"
        variantId={variantId}
      />
      <article>
        {product?.media?.nodes?.length > 0 &&
          product.media.nodes.map((node, index) => (
            <MediaFile
              key={index}
              data={node}
              mediaOptions={{
                image: {
                  style: {
                    maxWidth: "40%",
                    height: "auto",
                  },
                },
              }}
            />
          ))}
        <p>{product.description}</p>
      </article>
      {variants?.map((variant) => (
        <button
          onClick={() => setSelectedVariant(variant)}
          key={variant?.id}
          style={
            variant?.id === selectedVariant?.id
              ? { backgroundColor: "lightgrey" }
              : {}
          }
        >
          {variant?.title}
        </button>
      ))}
      <br />
      <br />
      <AddToCartButton
        variantId={selectedVariant?.id || variantId}
        quantity={1}
      >
        Add to Cart
      </AddToCartButton>
    </section>
  );
};

export default ProductDetails;
