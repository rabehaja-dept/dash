import type { ComponentMeta } from "@storybook/react";
import type { AccordionItem } from "./Accordion";
import { Accordion } from "./Accordion";
import { makeTemplate } from "~/components/stories/utils";

export default {
  title: "DEPT DASH™/Accordion",
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

// Make 8 accordion items
const items: AccordionItem[] = Array.from(Array(8)).map((_, i) => {
  return {
    title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit? (Question ${
      i + 1
    })`,
    body: "Mauris sit amet purus ipsum. Integer luctus scelerisque dapibus. Integer blandit ligula et porta euismod. Cras iaculis tempus metus eu rutrum. Mauris a velit arcu. Sed placerat, orci porta feugiat pellentesque, lacus lacus suscipit purus, in sodales ligula nisi eget purus.",
  };
});

export const Basic = makeTemplate(Accordion);
Basic.args = {
  title: "The main component title would sit here",
  pretext: "Short subheader before the",
  items,
};
