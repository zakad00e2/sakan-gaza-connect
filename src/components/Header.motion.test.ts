import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Header motion integration", () => {
  it("adds motion feedback to branding and the mobile menu trigger", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/Header.tsx"),
      "utf8",
    );

    expect(source).toContain('from "motion/react"');
    expect(source).toContain('data-motion-brand="true"');
    expect(source).toContain("active:scale-95");
  });
});
