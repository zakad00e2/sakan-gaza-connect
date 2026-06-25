import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home hero", () => {
  it("uses medium weight for the main site title", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/pages/Index.tsx"),
      "utf8",
    );

    expect(source).toContain(
      'className="text-3xl sm:text-4xl font-medium mb-3">سكن غزة</h1>',
    );
  });

});
