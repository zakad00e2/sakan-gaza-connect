import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Listing electricity options", () => {
  it("offers nearby well, municipal line, and unavailable for water", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/ListingForm.tsx"),
      "utf8",
    );

    expect(source).toContain(
      '<SelectItem value="nearby_well">بئر قريب</SelectItem>',
    );
    expect(source).toContain(
      '<SelectItem value="municipal_line">خط بلدية</SelectItem>',
    );
  });

  it("offers generator, solar power, and unavailable", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/ListingForm.tsx"),
      "utf8",
    );

    expect(source).toContain('<SelectItem value="generator">مولد</SelectItem>');
    expect(source).toContain('<SelectItem value="solar">طاقة شمسية</SelectItem>');
    expect(source).toContain(
      '<SelectItem value="unavailable">غير متوفر</SelectItem>',
    );
  });

  it("offers street network, telecom, and unavailable for internet", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/ListingForm.tsx"),
      "utf8",
    );

    expect(source).toContain(
      '<SelectItem value="street_network">شبكة شارع</SelectItem>',
    );
    expect(source).toContain('<SelectItem value="telecom">اتصالات</SelectItem>');
  });
});
