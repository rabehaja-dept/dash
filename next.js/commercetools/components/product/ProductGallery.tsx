import { ProductProjection, ProductVariant } from "@deptdash/commercetools";
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
    <div>
      <div>
        <ZoomableImage
          src={featuredMedia?.url || ""}
          zoomSrc={featuredMediaSrc || ""}
          alt={product.name[locale]}
        />
      </div>

      {galleryMedia?.map((med, index) => {
        return <img key={index} src={med.url} alt={med.label} />;
      })}
    </div>
  );
}
