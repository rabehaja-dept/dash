import type { ComponentMeta, ComponentStory } from "@storybook/react";
import clsx from "clsx";
import { Divider } from "./Divider";

export default {
  title: "DEPT DASH™/Divider",
  component: Divider,
} as ComponentMeta<typeof Divider>;

const Template: ComponentStory<typeof Divider> = (args) => (
  <>
    <div
      className={clsx(
        "flex h-6 gap-3",
        args.orientation === "vertical" && "flex-row"
      )}
    >
      {args.orientation === "vertical" && <div>Some text</div>}
      <Divider {...args} />
      {args.orientation === "vertical" && <div>Some text</div>}
    </div>
  </>
);

export const Default = Template.bind({});
