import { FloatingCart } from "./FloatingCart";
import type { ComponentMeta } from "@storybook/react";
import { makeTemplate } from "../stories/utils";

export default {
  title: "E-commerce/Floating Cart",
  component: FloatingCart,
  parameters: {
    backgrounds: { default: "dark" },
  },
} as ComponentMeta<typeof FloatingCart>;

export const Default = makeTemplate(FloatingCart);

Default.args = {
  content: <div>Cart items go here</div>,
  numberOfItems: 0,
};
