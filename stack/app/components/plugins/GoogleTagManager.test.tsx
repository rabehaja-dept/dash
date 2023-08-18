import { render } from "@testing-library/react";
import { GoogleTagManager } from "./GoogleTagManager";
import { installGlobals } from "@remix-run/node";
import { MemoryRouter } from "react-router-dom";

installGlobals();

describe("GoogleTagManager", () => {
  test("generates script tags", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <GoogleTagManager gaTrackingId="234567" />
      </MemoryRouter>
    );
    expect(document.querySelector("script")).toBeTruthy();
  });
});
