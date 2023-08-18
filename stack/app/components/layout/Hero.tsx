import type { CSSProperties } from "react";
import type { ImgHTMLAttributes } from "react";
import { Button } from "~/components/interactive/Button";

type HeroSize = "small" | "medium" | "large" | "responsive";

interface ImageBackground {
  imageProps: ImgHTMLAttributes<HTMLImageElement>;
}

interface ColorBackground {
  color: string;
}

export type HeroBackground = ImageBackground | ColorBackground;

export type HeroProps = {
  className?: string;
  title: string;
  background?: HeroBackground;
  spotlightImage?: {
    position: "left" | "right";
    imageProps: ImgHTMLAttributes<HTMLImageElement>;
  };
  pretext?: string;
  subtext?: string;
  size?: HeroSize;
  edges?: {
    topMask?: boolean;
    bottomMask?: boolean;
    rounded?: boolean;
  };
  button?: {
    label: string;
    to: string;
  };
};

function getWrapperSize(size: HeroSize): string {
  if (size === "small") {
    return "h-[340px]";
  } else if (size === "medium") {
    return "h-[440px]";
  } else if (size === "large") {
    return "h-[700px]";
  } else if (size === "responsive") {
    return "h-[440px] md:h-[700px]";
  }
  return "";
}

function getBackgroundStyle(
  background?: HeroBackground
): CSSProperties | undefined {
  if (background && "color" in background) {
    return {
      background: background.color,
    };
  }
}

export const Hero = ({
  className = "",
  title,
  background,
  spotlightImage,
  pretext,
  subtext,
  size = "medium",
  edges = { bottomMask: true },
  button,
}: HeroProps) => {
  return (
    <div
      className={`${getWrapperSize(size)} relative ${
        edges.rounded && "rounded-2xl"
      } ${className}`}
      style={getBackgroundStyle(background)}
    >
      {background && "imageProps" in background && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          {...background.imageProps}
          className="h-full w-full object-cover"
          alt="Hero background"
        />
      )}
      {edges.topMask && (
        <svg
          className="absolute top-0 h-[40px] w-full"
          preserveAspectRatio="none"
          width="1920"
          height="80"
          viewBox="0 0 1920 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 75C38 44 453 21 958 21C1488 21 1920 47 1920 80H1920V0L6.58325e-06 0L0 75.3036Z"
            fill="white"
          />
        </svg>
      )}
      <div
        className={`absolute ${
          edges.topMask ? "top-[20px]" : "top-0"
        } right-0 ${
          edges.bottomMask ? "bottom-[40px]" : "bottom-0"
        } left-0 flex items-center justify-center gap-16`}
      >
        {spotlightImage && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            className={`hidden h-1/2 lg:block xl:h-2/3 ${
              spotlightImage.position === "right" && "order-2"
            }`}
            {...spotlightImage.imageProps}
          />
        )}
        <div className="w-3/4 text-center lg:w-1/2">
          {pretext && (
            <div className="text-lg md:text-xl lg:text-2xl">{pretext}</div>
          )}
          <h1 className="my-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtext && (
            <div className="my-4 mt-6 text-lg md:mt-8 md:text-xl lg:text-2xl">
              {subtext}
            </div>
          )}
          {button && <Button to={button.to}>{button.label}</Button>}
        </div>
      </div>
      {edges.bottomMask && (
        <svg
          className="absolute bottom-0 h-[40px] w-full"
          preserveAspectRatio="none"
          width="1922"
          height="122"
          viewBox="0 0 1922 122"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1922 122L0 122L0 0C0 0 219 37 963 13C1707 -10 1922 26 1922 26L1922 122Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
};
