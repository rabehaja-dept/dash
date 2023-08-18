import { makeTemplate } from "../stories/utils";
import { ComponentMeta } from "@storybook/react";
import { FormSwitch } from "./FormSwitch";

export default {
  title: "DEPT DASH™/Forms/Switch",
  component: FormSwitch,
} as ComponentMeta<typeof FormSwitch>;

export const Basic = makeTemplate(FormSwitch);

Basic.args = {
  name: "switch",
  label: "Form Switch",
  onBlur: () => {},
  error: "",
  className: "",
};

export const Disabled = makeTemplate(FormSwitch);

Disabled.args = {
  name: "switch",
  disabled: true,
  label: "Form Switch",
  onBlur: () => {},
  error: "",
  className: "",
};
