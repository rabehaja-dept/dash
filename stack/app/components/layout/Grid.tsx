import type { ReactNode } from "react";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/outline";
import { useWindowSize } from "~/hooks/useWindowSize";

export interface GridProps {
  className?: string;
  children: ReactNode;
  cols: number;
  gridClassName?: string;
  carousel?: boolean;
  carouselDisableBreakpoint?: number;
}

interface CarouselProps {
  children: ReactNode;
  className?: string;
  carouselOptions?: CarouselOptions;
}

interface CarouselOptions {
  carouselDisableBreakpoint?: number;
  activeSlideDotColor?: string;
  inactiveSlideDotColor?: string;
  overrideCarouselClassNames?: CarouselClassNames;
}

interface CarouselClassNames {
  slides?: string;
  controls?: string;
  left?: string;
  right?: string;
  currentSlideWrapper?: string;
  currentSlideDot?: string;
}

/**
 * A grid component that can be used to display a grid of items.
 * @param carousel - Whether to turn the grid into a carousel at the specified breakpoint (default: false)
 * @param carouselDisableBreakpoint - The breakpoint at which to disable the carousel (default: 640)
 * @param cols - The number of columns to display in one row
 * @param className - The class name to apply to the grid container
 * @param gridClassName - The class name to apply to the grid itself
 * @param children - The children to render in the grid
 */
export const Grid = ({
  className = "",
  children,
  cols,
  gridClassName,
  carousel = false,
  carouselDisableBreakpoint = 640,
}: GridProps) => {
  const { width } = useWindowSize();

  // This is so the tailwind compiler picks up the class names to include in the built CSS file
  const gridClasses = [
    "gap-3",
    "gap-3 grid-cols-1",
    "gap-3 grid-cols-1 sm:grid-cols-2",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    "gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    "gap-3 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7",
    "gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8",
  ];

  if (carousel && width && width < carouselDisableBreakpoint) {
    return (
      <Carousel
        carouselOptions={{ carouselDisableBreakpoint }}
        className={className}
      >
        {children}
      </Carousel>
    );
  } else {
    return (
      <div className={`${className} `}>
        <div className={`grid ${gridClassName || gridClasses[cols]}`}>
          {children}
        </div>
      </div>
    );
  }
};

/**
 * A carousel component that can be used to display a grid of items.
 * @param children - The children to render in the carousel
 * @param className - The class name to apply to the carousel container
 * @param carouselOptions - The options to pass to the carousel
 */
const Carousel = ({
  children,
  className = "",
  carouselOptions = {},
}: CarouselProps) => {
  const {
    activeSlideDotColor = "black",
    inactiveSlideDotColor = "lightgray",
    overrideCarouselClassNames,
  } = carouselOptions;
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [slideCount, setSlideCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [areSlidesBefore, setAreSlidesBefore] = useState(false);
  const [areSlidesAfter, setAreSlidesAfter] = useState(true);

  const carouselLeft = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const carouselRight = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const carouselTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  // Monitor children props to re-count number of carousel slides
  useEffect(() => {
    if (React.isValidElement(children)) {
      // children is an element, so we'll assume it's a fragment containing our actual children
      setSlideCount(React.Children.count(children.props.children));
    } else {
      // children is not an element, so it's probably an array of elements instead
      setSlideCount(React.Children.count(children));
    }
  }, [children]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
        setAreSlidesBefore(emblaApi.canScrollPrev());
        setAreSlidesAfter(emblaApi.canScrollNext());
      });
    }
  }, [emblaApi]);

  return (
    <div
      className={`grid-carousel overflow-hidden ${className}`}
      ref={emblaRef}
    >
      <div className={overrideCarouselClassNames?.slides || "slides flex"}>
        {children}
      </div>
      <div
        className={
          overrideCarouselClassNames?.controls ||
          "controls mt-3 grid grid-cols-3"
        }
      >
        <div>
          <button
            aria-label="Previous slide"
            style={areSlidesBefore ? {} : { display: "none" }}
            onClick={carouselLeft}
            className={
              overrideCarouselClassNames?.left || "left block w-12 py-3 pr-6"
            }
          >
            <ArrowSmallLeftIcon />
          </button>
        </div>
        <div
          className={
            overrideCarouselClassNames?.currentSlideWrapper || "m-auto mt-2"
          }
        >
          {[...Array(slideCount)].map((e, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => carouselTo(i)}
            >
              <svg
                className={
                  overrideCarouselClassNames?.currentSlideDot || "w-6 p-2"
                }
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill={
                    currentSlide === i
                      ? activeSlideDotColor
                      : inactiveSlideDotColor
                  }
                />
              </svg>
            </button>
          ))}
        </div>
        <div>
          <button
            aria-label="Next slide"
            style={areSlidesAfter ? {} : { display: "none" }}
            onClick={carouselRight}
            className={
              overrideCarouselClassNames?.right ||
              "right ml-auto block w-12 py-3 pl-6"
            }
          >
            <ArrowSmallRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
