import { Slider } from "./Slider";
import type { ComponentMeta } from "@storybook/react";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Slider",
  component: Slider,
} as ComponentMeta<typeof Slider>;

export const Default = makeTemplate(Slider);

Default.args = {
  label: "Slider",
  defaultValue: [50],
  max: 100,
  min: 0,
  step: 5,
  inverted: false,
};
