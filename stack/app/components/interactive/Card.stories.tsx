import type { ComponentMeta } from "@storybook/react";
import { Card } from "./Card";
import { makeTemplate } from "../stories/utils";
import mountainsImage from "../stories/assets/mountains.jpg";

export default {
  title: "DEPT DASH™/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Card>;

export const Basic = makeTemplate(Card);
Basic.args = {
  title: "Lorem Ipsum",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

export const Full = makeTemplate(Card);
Full.args = {
  title: "Lorem Ipsum",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  imageProps: { src: mountainsImage, alt: "test" },
  button: { label: "Call to action", to: "/" },
};
