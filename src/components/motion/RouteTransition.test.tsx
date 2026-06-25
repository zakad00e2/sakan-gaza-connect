import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RouteTransition } from "./RouteTransition";

describe("RouteTransition", () => {
  it("keys the rendered page by the current pathname", () => {
    render(
      <MemoryRouter initialEntries={["/safety"]}>
        <RouteTransition>
          {(location) => (
            <Routes location={location}>
              <Route path="/safety" element={<div>Safety</div>} />
            </Routes>
          )}
        </RouteTransition>
      </MemoryRouter>,
    );

    expect(screen.getByText("Safety").closest("[data-route-path]")).toHaveAttribute(
      "data-route-path",
      "/safety",
    );
  });
});
