import { render, screen } from "@testing-library/react";
import type { AccordionItem } from "./Accordion";
import { Accordion } from "./Accordion";
import { installGlobals } from "@remix-run/node";

installGlobals();

function mockAccordionItems(howMany: number): AccordionItem[] {
  return Array.from(Array(howMany)).map((_, i) => {
    return {
      title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit? (Question ${
        i + 1
      })`,
      body: "Mauris sit amet purus ipsum. Integer luctus scelerisque dapibus. Integer blandit ligula et porta euismod. Cras iaculis tempus metus eu rutrum. Mauris a velit arcu. Sed placerat, orci porta feugiat pellentesque, lacus lacus suscipit purus, in sodales ligula nisi eget purus.",
    };
  });
}

describe("Accordion", () => {
  test("generates an aria id if no prefix is passed", () => {
    render(<Accordion items={mockAccordionItems(4)} />);
    screen.getAllByRole("button").forEach((button) => {
      const body = button.querySelector("div > div:last-child");
      expect(button).toHaveAttribute("aria-controls", body?.id);
      expect(body).toHaveAttribute("aria-labelledby", button.id);
    });
  });
  test("updates the aria prefix when props change", () => {
    const { rerender } = render(<Accordion items={mockAccordionItems(1)} />);
    const firstRenderButtonId = screen.getAllByRole("button")[0].id;
    // Rerender with a different number of accordion items so that the aria ID changes (because it's based on a hash created from props)
    rerender(<Accordion items={mockAccordionItems(2)} />);
    const secondRenderButtonId = screen.getAllByRole("button")[0].id;
    expect(firstRenderButtonId).not.toBe(secondRenderButtonId);
  });
  test("uses the passed value if one is provided", () => {
    const ariaIdPrefix = "testPrefix";
    render(
      <Accordion items={mockAccordionItems(1)} ariaIdPrefix={ariaIdPrefix} />
    );
    const buttonId = screen.getAllByRole("button")[0].id;
    expect(buttonId).toMatch(new RegExp(`^${ariaIdPrefix}`));
  });
});
