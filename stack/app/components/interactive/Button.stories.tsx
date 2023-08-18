import type { ComponentMeta } from "@storybook/react";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";
import { makeTemplate, getFigmaUrl } from "../stories/utils";

export default {
  title: "DEPT DASH™/Button",
  component: Button,
  parameters: {
    design: {
      type: "figma",
      url: getFigmaUrl("1746%3A14270"),
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary = makeTemplate(Button);

Primary.args = {
  children: "Button",
  variant: "primary",
};

export const Secondary = makeTemplate(Button);

Secondary.args = {
  children: "Button",
  variant: "secondary",
};

export const Tertiary = makeTemplate(Button);

Tertiary.args = {
  children: "Button",
  variant: "tertiary",
};

export const IconButton = () => (
  <div className="flex w-full gap-4">
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="primary"
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="secondary"
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="tertiary"
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="white"
    />
  </div>
);

export const RoundedIconButton = () => (
  <div className="flex w-full gap-4">
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="primary"
      rounded
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="secondary"
      rounded
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="tertiary"
      rounded
    />
    <Button
      icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
      variant="white"
      rounded
    />
  </div>
);

export const IconWithLabel = () => (
  <>
    <div className="mb-4 flex w-full gap-4">
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        variant="primary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        variant="secondary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        variant="tertiary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        variant="white"
      >
        Download
      </Button>
    </div>
    <div className="flex w-full gap-4">
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        iconPosition="right"
        variant="primary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        iconPosition="right"
        variant="secondary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        iconPosition="right"
        variant="tertiary"
      >
        Download
      </Button>
      <Button
        icon={<CloudArrowDownIcon className="m-4 h-6 w-6" />}
        iconPosition="right"
        variant="white"
      >
        Download
      </Button>
    </div>
  </>
);
