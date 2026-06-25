import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button motion feedback", () => {
  it("adds press feedback only to enabled default buttons", () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("active:scale-[0.98]");
    expect(screen.getByRole("button", { name: "Ghost" })).not.toHaveClass("active:scale-[0.98]");
    expect(screen.getByRole("button", { name: "Disabled" })).toHaveClass(
      "disabled:active:scale-100",
    );
  });
});
