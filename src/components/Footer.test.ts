import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Footer branding", () => {
  it("uses the approved site logo image and keeps the site name", () => {
    const footerPath = resolve(process.cwd(), "src/components/Footer.tsx");
    const source = readFileSync(footerPath, "utf8");

    expect(source).toContain('src="/logo.png"');
    expect(source).toContain('alt=""');
    expect(source).toContain("سكن غزة");
    expect(source).toContain('className="text-2xl font-medium text-black"');
    expect(source).not.toContain('<Home className="w-6 h-6');
  });
});
