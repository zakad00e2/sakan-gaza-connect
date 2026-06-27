import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home hero", () => {
  it("positions the hero text in the center", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/pages/Index.tsx"),
      "utf8",
    );

    expect(source).toContain(
      'className="flex min-h-[420px] w-full items-center justify-center px-4 py-16 text-center sm:min-h-[560px] lg:min-h-[640px]"',
    );
    expect(source).toContain(
      'className="mt-8 text-right"',
    );
    expect(source).toContain(
      '<SearchFilters filters={filters} onFiltersChange={setFilters} />',
    );
  });

});
