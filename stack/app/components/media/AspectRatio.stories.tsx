import type { ComponentMeta } from "@storybook/react";
import { AspectRatio } from "./AspectRatio";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Fixed Aspect Ratio",
  component: AspectRatio,
} as ComponentMeta<typeof AspectRatio>;

export const Basic = makeTemplate(AspectRatio);

Basic.args = {
  ratio: 16 / 9,
  children: <img src="https://picsum.photos/300/300" alt="demo" />,
  className: "w-[300px]",
};
