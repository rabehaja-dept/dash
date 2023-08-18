import { useProductOptions } from "@shopify/hydrogen";
import type { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";

export type ProductWizardImageProps = {
  product: Product;
};

export const ProductWizardImage = ({ product }: ProductWizardImageProps) => {
  const { selectedVariant } = useProductOptions();

  const media = product.media.nodes;
  // @TODO
  // @ts-ignore -> ts complains about `.image` not existing on `ProductMedia` when it's a video.
  // I think that's fine for now though.
  const featuredMedia = selectedVariant?.image || media[0]?.image;

  if (!media.length) {
    return null;
  }

  return (
    <img
      className="h-full w-[80vw] flex-shrink-0 snap-start object-cover object-center transition-all md:h-auto md:w-auto"
      src={featuredMedia.url}
      alt={product.title}
    />
  );
};
