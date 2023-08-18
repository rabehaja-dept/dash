import type { ComponentMeta } from "@storybook/react";
import { Feature } from "./Feature";
import { makeTemplate } from "../stories/utils";
import productImage from "../stories/assets/product.png";
import paintImage from "../stories/assets/paint.jpg";

export default {
  title: "DEPT DASH™/Feature",
  component: Feature,
} as ComponentMeta<typeof Feature>;

export const Basic = makeTemplate(Feature);
Basic.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  imageProps: { src: productImage, alt: "Product image" },
};

export const WithButton = makeTemplate(Feature);
WithButton.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  imageProps: { src: productImage, alt: "Product image" },
  button: { label: "Call to Action", to: "#" },
};

export const RightAligned = makeTemplate(Feature);
RightAligned.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  imageProps: { src: productImage, alt: "Product image" },
  contentPosition: "right",
};

export const FeaturedArticle = makeTemplate(Feature);
FeaturedArticle.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  imageProps: { src: productImage, alt: "Product image" },
  article: {
    category: "Webinar",
    categoryTo: "#",
    date: "July 2022",
  },
};

export const BackgroundColor = makeTemplate(Feature);
BackgroundColor.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  imageProps: { src: paintImage, alt: "Image" },
  backgroundColor: "#F2F2F2",
  article: {
    category: "Webinar",
    categoryTo: "#",
    date: "July 2022",
  },
};

export const NoImage = makeTemplate(Feature);
NoImage.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  button: { label: "Call to Action", to: "#" },
};

export const Centered = makeTemplate(Feature);
Centered.args = {
  title: "The main component title would sit here",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit pulvinar viverra felis hendrerit vitae justo, gravida. Tortor interdum ornare velit ac sed lorem. Euismod odio aliquet felis non morbi facilisis aliquet. Arcu diam morbi imperdiet posuere at volutpat. Est urna egestas lacus, nibh. Diam in quam suspendisse semper velit, ut aliquam. Sapien diam malesuada orci, arcu urna.",
  textAlign: "center",
  button: { label: "Call to Action", to: "#" },
};
