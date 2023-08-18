import { makeTemplate } from "../stories/utils";
import { ComponentMeta } from "@storybook/react";
import { FormError } from "./FormError";

export default {
  title: "DEPT DASH™/Forms/Error Text",
  component: FormError,
} as ComponentMeta<typeof FormError>;

export const Error_Text = makeTemplate(FormError);

Error_Text.args = {
  error: "This is an error message",
  className: "w-[200px]",
};
