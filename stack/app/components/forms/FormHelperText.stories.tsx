import { makeTemplate } from "../stories/utils";
import { ComponentMeta } from "@storybook/react";
import { FormHelperText } from "./FormHelperText";

export default {
  title: "DEPT DASH™/Forms/Helper Text",
  component: FormHelperText,
} as ComponentMeta<typeof FormHelperText>;

export const Helper_Text = makeTemplate(FormHelperText);

Helper_Text.args = {
  helperText: "This is some helper text",
  className: "w-[200px]",
};
