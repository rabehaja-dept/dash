import type { ImgHTMLAttributes } from "react";
import { Button, Label } from "../interactive";

export type FeatureProps = {
  className?: string;
  title: string;
  description: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
  contentPosition?: "left" | "right";
  textAlign?: "left" | "center";
  backgroundColor?: string;
  button?: {
    label: string;
    to: string;
  };
  article?: {
    category: string;
    categoryTo: string;
    date: string;
  };
};

export const Feature = ({
  className = "",
  title,
  description,
  imageProps,
  contentPosition = "left",
  textAlign = "left",
  backgroundColor,
  button,
  article,
}: FeatureProps) => {
  return (
    <div
      className={`mb-8 ${className}`}
      style={{
        backgroundColor: backgroundColor ? backgroundColor : "transparent",
      }}
    >
      <div
        className={`mx-4 mb-8 flex flex-wrap justify-center gap-x-10 py-4 md:mx-auto md:w-3/4 md:flex-nowrap lg:gap-x-20 lg:py-10 xl:gap-x-28`}
      >
        {imageProps && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            className={`object-contain md:w-1/2 ${
              contentPosition === "left" && "md:order-2"
            }`}
            {...imageProps}
          />
        )}
        <div
          className={`${imageProps ? "" : "md:w-3/4"} ${
            textAlign === "center" ? "text-center" : ""
          }`}
        >
          {article && (
            <div className="my-5 flex flex-row items-center">
              <Label variant="filled">{article.category}</Label>
              <span className="ml-4 text-sm">{article.date}</span>
            </div>
          )}
          <h1 className="my-4 text-4xl sm:text-5xl xl:text-6xl">{title}</h1>
          <div className="my-4 mt-6 text-lg sm:text-xl md:mt-8 xl:text-2xl">
            {description}
          </div>
          {button && (
            <Button className="md:mt-2" to={button.to}>
              {button.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
