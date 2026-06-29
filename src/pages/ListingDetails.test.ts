import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Listing details responsive header", () => {
  it("stacks price and listing title on small screens", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/pages/ListingDetails.tsx"),
      "utf8",
    );

    expect(source).toContain(
      'className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"',
    );
    expect(source).toContain(
      'className="min-w-0"',
    );
    expect(source).toContain(
      'className="mt-2 break-words text-2xl font-medium leading-snug"',
    );
    expect(source).toContain(
      'className="shrink-0 text-right sm:text-left"',
    );
  });
});
