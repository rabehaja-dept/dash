import type { ImgHTMLAttributes } from "react";
import { Button } from "~/components/interactive";

export type CardProps = {
  title?: string;
  description?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
  button?: {
    label: string;
    to: string;
  };
};

export const Card = ({ title, description, imageProps, button }: CardProps) => {
  return (
    <div className="rounded-card relative flex-shrink-0 basis-full overflow-hidden bg-background-accent-base px-8 py-6 text-center">
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        imageProps && <img className="mb-4" {...imageProps} />
      }
      {title && <div className="mb-2 text-2xl">{title}</div>}
      {description && (
        <div className="mb-4 text-base text-text-weak">{description}</div>
      )}
      {button && <Button to={button.to}>{button.label}</Button>}
    </div>
  );
};
