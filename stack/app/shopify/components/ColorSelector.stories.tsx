import type { ComponentMeta } from "@storybook/react";
import { ColorSelector } from "./ColorSelector";
import { makeTemplate } from "../../components/stories/utils";

export default {
  title: "E-Commerce/Color Selector",
  component: ColorSelector,
} as ComponentMeta<typeof ColorSelector>;

export const Basic = makeTemplate(ColorSelector);

Basic.args = {
  options: [
    { name: "Black", color: "#000000" },
    { name: "Yellow", color: "#ffff00" },
    { name: "Red", color: "#ff0000" },
    { name: "Green", color: "#00ff00" },
    { name: "Blue", color: "#0000ff" },
  ],
};

export const Disabled = makeTemplate(ColorSelector);

Disabled.args = {
  options: [
    { name: "Black", color: "#000000" },
    { name: "Yellow", color: "#ffff00" },
    { name: "Red", color: "#ff0000", disabled: true },
    { name: "Green", color: "#00ff00" },
    { name: "Blue", color: "#0000ff", disabled: true },
  ],
};
