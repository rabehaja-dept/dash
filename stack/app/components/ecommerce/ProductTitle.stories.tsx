import type { ComponentMeta } from "@storybook/react";
import { ProductTitle } from "./ProductTitle";
import { makeTemplate } from "../stories/utils";

export default {
  title: "E-commerce/Product Title",
  component: ProductTitle,
} as ComponentMeta<typeof ProductTitle>;

export const Basic = makeTemplate(ProductTitle);

Basic.args = {
  headline: "Main Headline",
  subheadline: "Subheadline Support",
  eyebrow: "Eyebrow Tagline",
};
