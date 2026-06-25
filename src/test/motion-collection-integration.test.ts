import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("motion collection integration", () => {
  it.each([
    "src/pages/MyListings.tsx",
    "src/pages/AdminPending.tsx",
    "src/pages/AdminReports.tsx",
  ])("%s uses shared stagger wrappers", (path) => {
    const source = read(path);
    expect(source).toContain("MotionList");
    expect(source).toContain("MotionItem");
  });

  it("uses MotionSurface for personal listing cards", () => {
    expect(read("src/components/MyListingCard.tsx")).toContain("MotionSurface");
  });
});
