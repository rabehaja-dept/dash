import { makeTemplate } from "../stories/utils";
import { FormInput } from "./FormInput";
import { ComponentMeta } from "@storybook/react";

export default {
  title: "DEPT DASH™/Forms/Input Fields",
  component: FormInput,
} as ComponentMeta<typeof FormInput>;

export const Text_Input = makeTemplate(FormInput);

Text_Input.args = {
  name: "text-input",
  label: "Text Input",
  error: "",
  placeholder: "Placeholder",
  required: true,
  className: "w-[200px]",
  inputProps: {},
};

export const Numeric_Input = makeTemplate(FormInput);

Numeric_Input.args = {
  name: "numeric-input",
  label: "Numeric Input",
  error: "",
  placeholder: "Placeholder",
  required: true,
  className: "w-[200px]",
  inputProps: {
    type: "number",
  },
};

export const Password_Input = makeTemplate(FormInput);

Password_Input.args = {
  name: "password-input",
  label: "Password Input",
  error: "",
  placeholder: "Placeholder",
  required: true,
  className: "w-[200px]",
  inputProps: {
    type: "password",
  },
};
