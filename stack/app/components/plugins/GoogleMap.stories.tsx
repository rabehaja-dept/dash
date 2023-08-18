import type { ComponentMeta } from "@storybook/react";
import { GoogleMap } from "~/components/plugins/GoogleMap";
import { makeTemplate } from "../stories/utils";

export default {
  title: "DEPT DASH™/Google Map Embed",
  component: GoogleMap,
} as ComponentMeta<typeof GoogleMap>;

export const Basic = makeTemplate(GoogleMap);

Basic.args = {
  height: "400px",
  width: "400px",
  defaultCenter: { lat: 52.370216, lng: 4.895168 },
  defaultZoom: 12,
};
