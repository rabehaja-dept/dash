import type { ComponentMeta } from "@storybook/react";
import { getFigmaUrl } from "./utils";

export const TextSizes = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {typographyOptions.map(({ name, weight, className, size }) => (
        <>
          <TypographyBlob
            key={name}
            name={name}
            size={size}
            weight={weight}
            className={className}
          />
        </>
      ))}
    </div>
  );
};

// www.figma.com/file/hkllNZ0AF7jLu2SPmIL6Mu/DEPT-DASH---in-progress?node-id=4529%3A17128&t=qX93CETW1X7DKVM0-1
export default {
  title: "Design System/Text Sizes",
  component: TextSizes,
  parameters: {
    design: {
      type: "figma",
      url: getFigmaUrl("4529%3A18376&t=fJRBDpqXs9EfCqDq-1"),
    },
  },
} as ComponentMeta<typeof TextSizes>;

const typographyOptions: TypographyBlobProps[] = [
  {
    name: "Headline",
    size: "l",
    weight: "bold",
    className: "text-headline-lg",
  },
  {
    name: "Headline",
    size: "m",
    weight: "bold",
    className: "text-headline-md",
  },
  {
    name: "Headline",
    size: "s",
    weight: "bold",
    className: "text-headline-sm",
  },
  {
    name: "Headline",
    size: "l",
    weight: "normal",
    className: "text-headline-lg",
  },
  {
    name: "Headline",
    size: "m",
    weight: "normal",
    className: "text-headline-md",
  },
  {
    name: "Headline",
    size: "s",
    weight: "normal",
    className: "text-headline-sm",
  },
  {
    name: "Title",
    size: "l",
    weight: "bold",
    className: "text-title-lg",
  },
  {
    name: "Title",
    size: "m",
    weight: "bold",
    className: "text-title-md",
  },
  {
    name: "Title",
    size: "s",
    weight: "bold",
    className: "text-title-sm",
  },
  {
    name: "Title",
    size: "l",
    weight: "normal",
    className: "text-title-lg",
  },
  {
    name: "Title",
    size: "m",
    weight: "normal",
    className: "text-title-md",
  },
  {
    name: "Title",
    size: "s",
    weight: "normal",
    className: "text-title-sm",
  },
  {
    name: "Body",
    size: "l",
    weight: "bold",
    className: "text-body-lg",
  },
  {
    name: "Body",
    size: "m",
    weight: "bold",
    className: "text-body-md",
  },
  {
    name: "Body",
    size: "s",
    weight: "bold",
    className: "text-body-sm",
  },
  {
    name: "Body",
    size: "l",
    weight: "normal",
    className: "text-body-lg",
  },
  {
    name: "Body",
    size: "m",
    weight: "normal",
    className: "text-body-md",
  },
  {
    name: "Body",
    size: "s",
    weight: "normal",
    className: "text-body-sm",
  },
];

type TypographyBlobProps = {
  name: string;
  size: "s" | "m" | "l";
  weight: "normal" | "bold";
  className: string;
};
const TypographyBlob = ({
  name,
  size,
  weight,
  className,
}: TypographyBlobProps) => {
  return (
    <div className="border-1 col-span-1 border p-4">
      <div className="flex h-8 w-8 items-center justify-center bg-black text-lg text-white">
        {size.toLocaleUpperCase()}
      </div>
      <div
        className={`${
          weight === "bold" ? "font-bold" : ""
        } text-center ${className}`}
      >
        {name}
      </div>
    </div>
  );
};
