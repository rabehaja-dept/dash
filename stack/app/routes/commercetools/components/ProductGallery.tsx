import { ProductProjection, ProductVariant } from "@commercetools/platform-sdk";
import { ZoomableImage } from "./ZoomableImage";

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export type GalleryProps = {
  product: ProductProjection;
  locale: string;
  activeVariant?: ProductVariant;
};
export default function Gallery({
  product,
  locale,
  activeVariant,
}: GalleryProps) {
  const media = product.masterVariant.images;

  const featuredMedia = activeVariant?.images?.[0] || media?.[0];
  const featuredMediaSrc = featuredMedia?.url.split("?")[0];
  const galleryMedia = media?.filter(
    (med) => !med.url.includes(featuredMediaSrc || "")
  );

  if (!media?.length) {
    return null;
  }

  return (
    <div className="no-scrollbar scroll-snap-x flex h-[485px] place-content-start gap-4 overflow-x-scroll scroll-smooth md:grid md:h-auto md:grid-cols-2">
      <div className="md:flex-shrink-none h-full w-[80vw] flex-shrink-0 snap-start object-cover object-center md:col-span-2 md:h-auto md:w-full">
        <ZoomableImage
          src={featuredMedia?.url || ""}
          zoomSrc={featuredMediaSrc || ""} // TODO: Add zoomSrc to the selected variant
          alt={product.name[locale]}
        />
      </div>

      {galleryMedia?.map((med, index) => {
        return (
          <img
            key={index}
            className="h-full w-[80vw] flex-shrink-0 snap-start object-cover object-center transition-all md:h-auto md:w-auto"
            src={med.url}
            alt={med.label}
          />
        );
      })}
    </div>
  );
}
