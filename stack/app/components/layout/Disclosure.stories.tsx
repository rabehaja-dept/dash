import type { ComponentMeta } from "@storybook/react";
import { Disclosure } from "./Disclosure";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Disclosure",
  component: Disclosure,
} as ComponentMeta<typeof Disclosure>;

export const Default = makeTemplate(Disclosure);

Default.args = {
  title: "This is a disclosure",
  children: <div>this is content</div>,
  className: "w-[500px]",
};

export const Stacked = () => (
  <div>
    <Disclosure
      title={`This is a disclosure 1`}
      className="w-[500px] border-b border-border-weak"
    >
      <div>this is content</div>
    </Disclosure>
    <Disclosure
      title={`This is a disclosure 2`}
      className="w-[500px] border-b border-border-weak"
    >
      <div>this is content</div>
    </Disclosure>
    <Disclosure title={`This is a disclosure 3`} className="w-[500px]">
      <div>this is content</div>
    </Disclosure>
  </div>
);
