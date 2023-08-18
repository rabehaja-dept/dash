import type { ComponentMeta } from "@storybook/react";
import { GalleryCard } from "./GalleryCard";
import { makeTemplate } from "../stories/utils";
import chatBubbleImage from "~/components/stories/assets/chat-bubble.jpg";

export default {
  title: "DEPT DASH™/Gallery Card",
  component: GalleryCard,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof GalleryCard>;

export const Basic = makeTemplate(GalleryCard);
Basic.args = {
  title: "Lorem Ipsum",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor",
  imageProps: { src: chatBubbleImage, alt: "test" },
};
