import type { ComponentMeta } from "@storybook/react";
import { getFigmaUrl } from "./utils";

export const Background = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Background</h1>
      <div className="grid grid-cols-4 gap-4">
        {backgroundColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Text = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Text & Icon</h1>
      <div className="grid grid-cols-4 gap-4">
        {textColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Border = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Border</h1>
      <div className="grid grid-cols-4 gap-4">
        {borderColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Shadow = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Shadow</h1>
      <div className="grid grid-cols-4 gap-4">
        {shadowColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Chip = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Chip</h1>
      <div className="grid grid-cols-4 gap-4">
        {chipColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Banner = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Banner</h1>
      <div className="grid grid-cols-4 gap-4">
        {bannerColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

export const Alert = () => {
  return (
    <>
      <h1 className="my-12 text-title-md">Alert</h1>
      <div className="grid grid-cols-4 gap-4">
        {alertColorOptions.map(({ name, textColor, className }) => (
          <>
            <ColorBlob
              key={name}
              textColor={textColor}
              name={name}
              className={className}
            />
          </>
        ))}
      </div>
    </>
  );
};

// https://www.figma.com/file/hkllNZ0AF7jLu2SPmIL6Mu/DEPT-DASH---in-progress?node-id=4529%3A17129&t=fJRBDpqXs9EfCqDq-1
export default {
  title: "Design System/Colors",
  component: Background,
  parameters: {
    design: {
      type: "figma",
      url: getFigmaUrl("4529%3A17129&t=fJRBDpqXs9EfCqDq-1"),
    },
  },
} as ComponentMeta<typeof Background>;

const backgroundColorOptions: ColorBlobProps[] = [
  {
    name: "Background Canvas Base",
    textColor: "black",
    className: "bg-background-canvas",
  },
  {
    name: "Background Canvas Light",
    textColor: "black",
    className: "bg-background-canvas-light",
  },
  {
    name: "Background Canvas Dark",
    textColor: "white",
    className: "bg-background-canvas-dark",
  },
  {
    name: "Background Canvas Translucent",
    textColor: "black",
    className: "bg-background-canvas-translucent",
  },
  {
    name: "Background Weak",
    textColor: "black",
    className: "bg-background-weak",
  },
  {
    name: "Background Base",
    textColor: "white",
    className: "bg-background-base",
  },
  {
    name: "Background Strong",
    textColor: "white",
    className: "bg-background-strong",
  },
  {
    name: "Background Translucent",
    textColor: "white",
    className: "bg-background-translucent",
  },
];

const textColorOptions: ColorBlobProps[] = [
  {
    name: "Text Base",
    textColor: "white",
    className: "bg-text-base",
  },
  {
    name: "Text Weak",
    textColor: "white",
    className: "bg-text-weak",
  },
  {
    name: "Text Light",
    textColor: "black",
    className: "bg-text-light",
  },
  {
    name: "Text Accent",
    textColor: "white",
    className: "bg-text-accent",
  },
  {
    name: "Icon Base",
    textColor: "white",
    className: "bg-text-icon-base",
  },
  {
    name: "Icon Base",
    textColor: "white",
    className: "bg-text-icon-accent",
  },
  {
    name: "Icon Accent",
    textColor: "white",
    className: "bg-text-icon-accent",
  },
];

const borderColorOptions: ColorBlobProps[] = [
  {
    name: "Border Base",
    textColor: "black",
    className: "bg-border-base",
  },
  {
    name: "Border Weak",
    textColor: "black",
    className: "bg-border-weak",
  },
  {
    name: "Border Targeted",
    textColor: "white",
    className: "bg-border-targeted",
  },
  {
    name: "Border Light",
    textColor: "black",
    className: "bg-border-light",
  },
];

const shadowColorOptions: ColorBlobProps[] = [
  {
    name: "Shadow",
    textColor: "white",
    className: "bg-shadow",
  },
];

const chipColorOptions: ColorBlobProps[] = [
  {
    name: "Interactive Selected Base",
    textColor: "white",
    className: "bg-chip-interactive-selected-base",
  },
  {
    name: "Interactive Selected On",
    textColor: "black",
    className: "bg-chip-interactive-selected-on",
  },
  {
    name: "Interactive Unselected Base",
    textColor: "black",
    className: "bg-chip-interactive-unselected-base",
  },
  {
    name: "Interactive Unselected Targeted",
    textColor: "black",
    className: "bg-chip-interactive-unselected-targeted",
  },
  {
    name: "Interactive Unselected On",
    textColor: "white",
    className: "bg-chip-interactive-unselected-on",
  },
  {
    name: "Static Base",
    textColor: "white",
    className: "bg-chip-static-base",
  },
  {
    name: "Static On",
    textColor: "black",
    className: "bg-chip-static-on",
  },
];

const bannerColorOptions: ColorBlobProps[] = [
  {
    name: "Banner",
    textColor: "white",
    className: "bg-banner",
  },
  {
    name: "Interactive Selected On",
    textColor: "black",
    className: "bg-banner-on",
  },
];

const alertColorOptions: ColorBlobProps[] = [
  {
    name: "Error",
    textColor: "black",
    className: "bg-alert-error",
  },
  {
    name: "Warning",
    textColor: "black",
    className: "bg-alert-warning",
  },
  {
    name: "Success",
    textColor: "black",
    className: "bg-alert-success",
  },
  {
    name: "Info",
    textColor: "black",
    className: "bg-alert-info",
  },
];

type ColorBlobProps = {
  name: string;
  textColor: string;
  className: string;
};
const ColorBlob = ({ name, textColor, className }: ColorBlobProps) => {
  return (
    <div className="border-1 col-span-1 rounded-md border">
      <div
        className={`h-full w-full rounded-md p-6 text-center text-${textColor} ${className}`}
      >
        {name}
      </div>
    </div>
  );
};
