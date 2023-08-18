import type { ComponentMeta } from "@storybook/react";
import { Hero } from "./Hero";
import { makeTemplate } from "../stories/utils";
import heroBackgroundImage from "~/components/stories/assets/heroBackground.webp";
import productImage from "~/components/stories/assets/product.png";

export default {
  title: "DEPT DASH™/Hero",
  component: Hero,
} as ComponentMeta<typeof Hero>;

export const Small = makeTemplate(Hero);
Small.args = {
  title: "Space for one line",
  size: "small",
  background: { imageProps: { src: heroBackgroundImage } },
};

export const Medium = makeTemplate(Hero);
Medium.args = {
  title: "Plenty of space to spread across two lines",
  background: { imageProps: { src: heroBackgroundImage } },
};

export const ColorBackground = makeTemplate(Hero);
ColorBackground.args = {
  title: "Plenty of space to spread across two lines",
  background: { color: "#DCD7FF" },
};

export const MediumFull = makeTemplate(Hero);
MediumFull.args = {
  title: "Plenty of space to spread across two lines",
  background: { imageProps: { src: heroBackgroundImage } },
  pretext: "This comes before the main title",
  button: {
    label: "Call to Action",
    to: "#",
  },
};

export const Large = makeTemplate(Hero);
Large.args = {
  title: "Plenty of space to spread across two lines",
  size: "large",
  background: { imageProps: { src: heroBackgroundImage } },
  pretext: "This comes before the main title",
  subtext: "This comes after the main title",
  button: {
    label: "Call to Action",
    to: "#",
  },
};

export const Responsive = makeTemplate(Hero);
Responsive.args = {
  title: "Plenty of space to spread across two lines",
  size: "responsive",
  background: { imageProps: { src: heroBackgroundImage } },
  pretext: "This comes before the main title",
  subtext: "This comes after the main title",
  button: {
    label: "Call to Action",
    to: "#",
  },
};

export const TopMask = makeTemplate(Hero);
TopMask.args = {
  title: "With a mask over the top of the hero",
  background: { imageProps: { src: heroBackgroundImage } },
  subtext: "This comes after the main title",
  edges: { topMask: true, bottomMask: false },
};

export const Rounded = makeTemplate(Hero);
Rounded.args = {
  title: "With rounded edges",
  background: { imageProps: { src: heroBackgroundImage } },
  subtext: "This comes after the main title",
  edges: { topMask: false, bottomMask: false, rounded: true },
};

export const LeftSpotlightImage = makeTemplate(Hero);
LeftSpotlightImage.args = {
  title: "Product title",
  size: "large",
  background: { color: "#DCD7FF" },
  spotlightImage: {
    position: "left",
    imageProps: { src: productImage, alt: "Test product image" },
  },
  pretext: "This comes before the main title",
  subtext:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor id. Neque faucibus sapien eleifend in. Etiam iaculis nulla sed imperdiet purus porttitor. Molestie convallis sed bibendum ullamcorper proin nullam commodo.",
  button: {
    label: "Buy Now!",
    to: "#",
  },
};

export const RightSpotlightImage = makeTemplate(Hero);
RightSpotlightImage.args = {
  title: "Product title",
  size: "large",
  background: { color: "#DCD7FF" },
  spotlightImage: {
    position: "right",
    imageProps: { src: productImage, alt: "Test product image" },
  },
  pretext: "This comes before the main title",
  subtext:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor id. Neque faucibus sapien eleifend in. Etiam iaculis nulla sed imperdiet purus porttitor. Molestie convallis sed bibendum ullamcorper proin nullam commodo.",
  button: {
    label: "Buy Now!",
    to: "#",
  },
};
