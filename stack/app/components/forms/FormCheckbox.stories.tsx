import { makeTemplate } from "../stories/utils";
import { ComponentMeta } from "@storybook/react";
import { FormCheckbox } from "./FormCheckbox";

export default {
  title: "DEPT DASH™/Forms/Checkbox",
  component: FormCheckbox,
} as ComponentMeta<typeof FormCheckbox>;

export const Basic = makeTemplate(FormCheckbox);

Basic.args = {
  name: "checkbox",
  label: "Checkbox",
  onBlur: () => {},
  error: "",
  className: "",
  inputProps: {},
};

export const Disabled = makeTemplate(FormCheckbox);

Disabled.args = {
  name: "checkbox",
  label: "Checkbox",
  disabled: true,
  onBlur: () => {},
  error: "",
  className: "",
  inputProps: {},
};
