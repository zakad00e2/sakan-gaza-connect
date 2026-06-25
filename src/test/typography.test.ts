import { readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return sourceFiles(path);
    if (![".ts", ".tsx", ".css"].includes(extname(entry.name))) return [];
    if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
      return [];
    }

    return [path];
  });
}

describe("site typography", () => {
  it("loads Thmanyah Sans Light, Regular, and Medium", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "src/index.css"),
      "utf8",
    );

    expect(stylesheet).toContain("thmanyahsans-Light.woff2");
    expect(stylesheet).toContain("font-weight: 300");
    expect(stylesheet).toContain("thmanyahsans-Regular.woff2");
    expect(stylesheet).toContain("font-weight: 400");
    expect(stylesheet).toContain("thmanyahsans-Medium.woff2");
    expect(stylesheet).toContain("font-weight: 500");
  });

  it("does not request weights heavier than Medium", () => {
    const contents = sourceFiles(resolve(process.cwd(), "src"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(contents).toContain("font-medium");
    expect(contents).not.toMatch(/\bfont-(semibold|bold|extrabold|black)\b/);
    expect(contents).not.toMatch(/\bfont-(mono|sans|serif|cairo|heading)\b/);
  });

  it("uses regular weight for listing type badges", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "src/index.css"),
      "utf8",
    );

    expect(stylesheet).toMatch(
      /\.badge-rent\s*\{[^}]*font-normal[^}]*\}/s,
    );
    expect(stylesheet).toMatch(
      /\.badge-sale\s*\{[^}]*font-normal[^}]*\}/s,
    );
  });
});
