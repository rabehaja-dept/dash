import type { ComponentMeta } from "@storybook/react";
import { FilterDrawer } from "./FilterDrawer";
import { makeTemplate } from "../../components/stories/utils";

export default {
  title: "E-Commerce/Filter Drawer",
  component: FilterDrawer,
} as ComponentMeta<typeof FilterDrawer>;

export const Basic = makeTemplate(FilterDrawer);
