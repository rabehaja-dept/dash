import type { ImgHTMLAttributes } from "react";

export type GalleryCardProps = {
  title: string;
  description: string;
  imageProps: ImgHTMLAttributes<HTMLImageElement>;
};

export const GalleryCard = ({
  title,
  description,
  imageProps,
}: GalleryCardProps) => {
  return (
    <div className="rounded-card relative flex-shrink-0 basis-full overflow-hidden">
      <div className="grid grid-cols-3 gap-6">
        <div className="m-auto">
          {
            // eslint-disable-next-line jsx-a11y/alt-text
            <img {...imageProps} />
          }
        </div>
        <div className="col-span-2 m-auto">
          <div className="-mt-1 mb-2 text-2xl">{title}</div>
          <div className="text-base text-gray-700">{description}</div>
        </div>
      </div>
    </div>
  );
};
