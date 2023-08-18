import type { ComponentProps } from "react";
import { SanityImage } from "./sanity-image";
import { PortableText, PortableTextProps } from "@portabletext/react";

// @see https://www.sanity.io/docs/presenting-block-text
const myPortableTextComponents: ComponentProps<
  typeof PortableText
>["components"] = {
  types: {
    blockImages: ({ value }) =>
      value.modules?.map(({ caption, alt = "test", image }, index) => (
        <SanityImage
          key={index}
          caption={caption}
          alt={alt}
          asset={image.asset}
        />
      )),
  },
};

// Use this component to render module based pages
export const CustomPortableText = (props: PortableTextProps) => {
  return <PortableText {...props} components={myPortableTextComponents} />;
};
