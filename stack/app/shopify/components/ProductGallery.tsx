// @ts-nocheck
//TODO: This is a temporary fix to make this shopify-built component work with TypeScript.
import { useProductOptions } from "@shopify/hydrogen";
import type { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import { ZoomableImage } from "./ZoomableImage";

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export type GalleryProps = {
  product: Product;
};
export default function Gallery({ product }: GalleryProps) {
  const { selectedVariant } = useProductOptions();
  const media = product.media.nodes;

  const featuredMedia = selectedVariant?.image || media[0]?.image;
  const featuredMediaSrc = featuredMedia?.url.split("?")[0];
  const galleryMedia = media.filter(
    (med) => !med.image.url.includes(featuredMediaSrc)
  );

  if (!media.length) {
    return null;
  }

  return (
    <div className="no-scrollbar scroll-snap-x flex h-[485px] place-content-start gap-4 overflow-x-scroll scroll-smooth md:grid md:h-auto md:grid-cols-2">
      <div className="md:flex-shrink-none h-full w-[80vw] flex-shrink-0 snap-start object-cover object-center md:col-span-2 md:h-auto md:w-full">
        <ZoomableImage
          src={selectedVariant?.image?.url}
          zoomSrc={selectedVariant?.image?.url} // TODO: Add zoomSrc to the selected variant
          alt={product.title}
        />
      </div>

      {galleryMedia.map((med) => {
        return (
          <img
            key={med.id || med.image.id}
            className="h-full w-[80vw] flex-shrink-0 snap-start object-cover object-center transition-all md:h-auto md:w-auto"
            src={med.image.url}
            alt={med.image.altText}
          />
        );
      })}
    </div>
  );
}
