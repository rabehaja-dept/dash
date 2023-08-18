import { makeTemplate } from "../stories/utils";
import { FormSelect } from "./FormSelect";
import { ComponentMeta } from "@storybook/react";

export default {
  title: "DEPT DASH™/Forms/Input Fields",
  component: FormSelect,
} as ComponentMeta<typeof FormSelect>;

export const Select_Input = makeTemplate(FormSelect);

Select_Input.args = {
  name: "name",
  label: "Name",
  error: "",
  required: true,
  placeholder: "Placeholder",
  className: "w-[200px]",
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
};
