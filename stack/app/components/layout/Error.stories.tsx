import type { ComponentMeta } from "@storybook/react";
import { Error } from "./Error";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Error",
  component: Error,
} as ComponentMeta<typeof Error>;

export const Default = makeTemplate(Error);

Default.args = {
  title: "Something went wrong",
  errorText:
    "Something went wrong. We had some technical problems, try to refresh this page.",
  image: <img src="https://via.placeholder.com/800" alt="placeholder" />,
};

export const WithoutImage = makeTemplate(Error);

WithoutImage.args = {
  title: "Something went wrong",
  errorText: "Something went wrong. We had some technical problems.",
};
