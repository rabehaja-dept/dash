import { BanknotesIcon } from "@heroicons/react/24/outline";
import type { ComponentMeta } from "@storybook/react";
import { Label } from "./Label";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Label",
  component: Label,
} as ComponentMeta<typeof Label>;

export const Filled = makeTemplate(Label);

Filled.args = {
  children: "Lorem Ipsum",
  variant: "filled",
};

export const FilledWithIcon = makeTemplate(Label);

FilledWithIcon.args = {
  children: "Lorem Ipsum",
  variant: "filled",
  icon: <BanknotesIcon className="h-5 w-5" />,
};

export const Outlined = makeTemplate(Label);

Outlined.args = {
  children: "Lorem Ipsum",
  variant: "outlined",
};

export const OutlinedWithIcon = makeTemplate(Label);

OutlinedWithIcon.args = {
  children: "Lorem Ipsum",
  variant: "outlined",
  icon: <BanknotesIcon className="h-5 w-5" />,
};

export const Soft = makeTemplate(Label);

Soft.args = {
  children: "Lorem Ipsum",
  variant: "soft",
};

export const SoftWithIcon = makeTemplate(Label);

SoftWithIcon.args = {
  children: "Lorem Ipsum",
  variant: "soft",
  icon: <BanknotesIcon className="h-5 w-5" />,
};

export const Rounded = makeTemplate(Label);

Rounded.args = {
  children: "Lorem Ipsum",
  variant: "soft",
  rounded: true,
};

export const RoundedWithIcon = makeTemplate(Label);

RoundedWithIcon.args = {
  children: "Lorem Ipsum",
  variant: "soft",
  icon: <BanknotesIcon className="h-5 w-5" />,
  rounded: true,
};
