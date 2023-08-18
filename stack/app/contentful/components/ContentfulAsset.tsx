import type { SpecificLocale, Asset } from "~/@types/generated/contentful";
import { getSrcSet, getImageProps } from "../contentful-render";

export interface ContentfulAssetProps {
  asset: SpecificLocale<Asset>;
  wrapperClassName?: string;
  assetClassName?: string;
  imageSizes?: Array<string>;
}

/**
 * @param asset A contentful asset.
 * @param wrapperClassName CSS class names to append to the image wrapper
 * @param assetClassName CSS class names to append to the image itself.
 * @param sizeQueries an array of CSS size strings to generate img attribute sizes.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
 */
export function ContentfulAsset({
  asset,
  wrapperClassName,
  assetClassName,
  imageSizes,
}: ContentfulAssetProps) {
  const isImage = asset.fields.file.contentType.startsWith("image");
  const isVideo = asset.fields.file.contentType.startsWith("video");
  const imagesSizeQueries = imageSizes?.join(", ");

  return (
    <>
      {isImage && (
        <div className={wrapperClassName}>
          <picture>
            <source
              className={assetClassName}
              type="image/webp"
              srcSet={getSrcSet({
                // We know this is an image, so it's safe to assume image is set
                width: asset.fields.file.details.image!.width,
                url: asset.fields.file.url,
              })}
              sizes={imagesSizeQueries}
            />
            {
              // This is safe to ignore because we know alt text is coming from getImageProps()
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                className={assetClassName}
                sizes={imagesSizeQueries}
                {...getImageProps(asset)}
              />
            }
          </picture>
        </div>
      )}
      {isVideo && (
        <div className={wrapperClassName}>
          <video
            className={assetClassName}
            src={asset.fields.file.url}
            controls
          />
        </div>
      )}
    </>
  );
}
