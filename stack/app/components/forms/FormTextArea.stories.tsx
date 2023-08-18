import { makeTemplate } from "../stories/utils";
import { FormTextArea } from "./FormTextArea";
import { ComponentMeta } from "@storybook/react";

export default {
  title: "DEPT DASH™/Forms/Input Fields",
  component: FormTextArea,
} as ComponentMeta<typeof FormTextArea>;

export const Text_Area_Input = makeTemplate(FormTextArea);

Text_Area_Input.args = {
  name: "name",
  label: "Text Area",
  placeholder: "Placeholder",
  error: "",
  required: true,
  className: "w-[200px]",
  inputProps: {},
};
