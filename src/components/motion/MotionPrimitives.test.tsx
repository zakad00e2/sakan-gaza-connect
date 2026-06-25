import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  MotionCollapse,
  MotionItem,
  MotionList,
  MotionPage,
  MotionSection,
  MotionSurface,
} from "./MotionPrimitives";

describe("MotionPrimitives", () => {
  it("labels each shared motion wrapper by its role", () => {
    render(
      <MotionPage>
        <MotionSection>
          <MotionList>
            <MotionItem>Item</MotionItem>
          </MotionList>
        </MotionSection>
      </MotionPage>,
    );

    expect(screen.getByText("Item").closest('[data-motion-role="item"]')).toBeInTheDocument();
    expect(document.querySelector('[data-motion-role="page"]')).toBeInTheDocument();
    expect(document.querySelector('[data-motion-role="section"]')).toBeInTheDocument();
    expect(document.querySelector('[data-motion-role="list"]')).toBeInTheDocument();
  });

  it("mounts collapse content only while open", () => {
    const { rerender } = render(
      <MotionCollapse open={false}>
        <div>Advanced filters</div>
      </MotionCollapse>,
    );

    expect(screen.queryByText("Advanced filters")).not.toBeInTheDocument();

    rerender(
      <MotionCollapse open>
        <div>Advanced filters</div>
      </MotionCollapse>,
    );

    expect(screen.getByText("Advanced filters")).toBeInTheDocument();
  });

  it("identifies interactive motion surfaces", () => {
    render(<MotionSurface>Card</MotionSurface>);
    expect(screen.getByText("Card").closest('[data-motion-role="surface"]')).toBeInTheDocument();
  });
});
