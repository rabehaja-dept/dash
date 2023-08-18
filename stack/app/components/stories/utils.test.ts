import { makeTemplate } from "./utils";
import { Section } from "../layout/Section";

test("makeTemplate typing works", () => {
  const Basic = makeTemplate(Section);
  Basic.args = {
    // @ts-expect-error
    extraArgs: "cause ts errors",
    title: "Section title",
    subtext: "Section subtext",
  };
});
