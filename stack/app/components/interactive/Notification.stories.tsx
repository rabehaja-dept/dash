import { Notification } from "./Notification";
import type { ComponentMeta } from "@storybook/react";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Notification",
  component: Notification,
} as ComponentMeta<typeof Notification>;

export const Default = makeTemplate(Notification);

Default.args = {
  message: "This is a notification",
  type: "default",
  className: "w-[300px]",
};

export const Soft = makeTemplate(Notification);

Soft.args = {
  message: "This is a notification",
  type: "soft",
  className: "w-[300px]",
};

export const Success = makeTemplate(Notification);

Success.args = {
  message: "This is a notification",
  type: "success",
  className: "w-[300px]",
};

export const Warning = makeTemplate(Notification);

Warning.args = {
  message: "This is a notification",
  type: "warning",
  className: "w-[300px]",
};

export const Info = makeTemplate(Notification);

Info.args = {
  message: "This is a notification",
  type: "info",
  className: "w-[300px]",
};

export const Error = makeTemplate(Notification);

Error.args = {
  message: "This is a notification",
  type: "error",
  className: "w-[300px]",
};

export const WithChild = makeTemplate(Notification);

WithChild.args = {
  message: "Longer shipping times due to COVID-19",
  type: "warning",
  className: "w-[500px]",
  children: (
    <a href="/" className="underline">
      More Information
    </a>
  ),
};
