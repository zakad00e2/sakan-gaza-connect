import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Header branding", () => {
  it("uses the site sans font for the site name", () => {
    const headerPath = resolve(process.cwd(), "src/components/Header.tsx");
    const source = readFileSync(headerPath, "utf8");

    expect(source).toContain(
      'className="text-lg sm:text-xl font-arabic font-medium text-primary"',
    );
  });

  it("does not configure or load Thmanyah Serif Display", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "src/index.css"),
      "utf8",
    );
    const tailwindConfig = readFileSync(
      resolve(process.cwd(), "tailwind.config.ts"),
      "utf8",
    );

    expect(stylesheet).not.toContain("Thmanyah Serif Display");
    expect(stylesheet).not.toContain("thmanyahserifdisplay");
    expect(tailwindConfig).not.toContain("Thmanyah Serif Display");
  });

  it("uses regular weight for add, safety, and login navigation actions", () => {
    const headerPath = resolve(process.cwd(), "src/components/Header.tsx");
    const source = readFileSync(headerPath, "utf8");

    expect(source).toContain('className="gap-1 btn-touch h-10 font-normal"');
    expect(source).toContain('className="gap-1 font-normal"');
    expect(source).toContain('className="gap-1 h-10 font-normal"');
  });
});
