import type { ComponentMeta } from "@storybook/react";
import { Link } from "./Link";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Link",
  component: Link,
} as ComponentMeta<typeof Link>;

export const Primary = makeTemplate(Link);

Primary.args = {
  children: "This is a primary link",
  variant: "primary",
  href: "#",
};

export const Dark = makeTemplate(Link);

Dark.args = {
  children: "This is a dark link",
  variant: "dark",
  href: "#",
};

export const Underlined = makeTemplate(Link);

Underlined.args = {
  children: "Underlined link",
  variant: "primary",
  href: "#",
  underlined: true,
};

export const AsComponent = makeTemplate(Link);

AsComponent.args = {
  children: "Links can be rendered as any HTML component",
  variant: "primary",
  as: "button",
  href: "#",
};
