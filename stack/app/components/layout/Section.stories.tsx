import type { ComponentMeta } from "@storybook/react";
import { Card } from "../interactive/";
import { Grid } from "./Grid";
import { GalleryCard, GalleryGrid } from "../media/";
import { Section } from "./Section";
import { makeTemplate } from "../stories/utils";
import logoImage from "../stories/assets/logo.svg";
import chatBubbleImage from "../stories/assets/chat-bubble.jpg";
import paintImage from "../stories/assets/paint.jpg";

export default {
  title: "DEPT DASH™/Section",
  component: Section,
} as ComponentMeta<typeof Section>;

export const Basic = makeTemplate(Section);
Basic.args = {
  title: "Section title",
  subtext: "Section subtext",
  children: (
    <>
      <Grid cols={3}>
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </Grid>
    </>
  ),
};

export const Gallery = makeTemplate(Section);
Gallery.args = {
  imageProps: { src: paintImage, alt: "test" },
  children: (
    <>
      <GalleryGrid>
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
        <GalleryCard
          imageProps={{ src: chatBubbleImage, alt: "test" }}
          title="Bullet title"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ac tincidunt sed fermentum aliquam varius elit auctor"
        />
      </GalleryGrid>
    </>
  ),
};

export const Logos = makeTemplate(Section);
Logos.args = {
  title: "Section title",
  children: (
    <>
      <Grid cols={8}>
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
        <Card
          imageProps={{ src: logoImage, alt: "test", className: "w-full" }}
        />
      </Grid>
    </>
  ),
};
