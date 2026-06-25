import { access } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const publicAsset = (name: string) => resolve(process.cwd(), "public", name);

describe("Branding assets", () => {
  it.each([
    ["logo.png", null, null],
    ["favicon-16x16.png", 16, 16],
    ["favicon-32x32.png", 32, 32],
    ["apple-touch-icon.png", 180, 180],
    ["og-image.png", 1200, 630],
  ] as const)("provides %s at the expected dimensions", async (name, width, height) => {
    const path = publicAsset(name);
    await access(path);

    const metadata = await sharp(path).metadata();
    if (width !== null && height !== null) {
      expect(metadata.width).toBe(width);
      expect(metadata.height).toBe(height);
    }
  });

  it("keeps the master logo transparent", async () => {
    const metadata = await sharp(publicAsset("logo.png")).metadata();

    expect(metadata.hasAlpha).toBe(true);
  });

  it("does not introduce black resize bars in the social image", async () => {
    const { data, info } = await sharp(publicAsset("og-image.png"))
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let tallestBlackColumn = 0;

    for (let x = 0; x < info.width; x += 1) {
      let blackPixelsInColumn = 0;

      for (let y = 0; y < info.height; y += 1) {
        const index = (y * info.width + x) * 3;
        if (data[index] < 20 && data[index + 1] < 20 && data[index + 2] < 20) {
          blackPixelsInColumn += 1;
        }
      }

      tallestBlackColumn = Math.max(tallestBlackColumn, blackPixelsInColumn);
    }

    expect(tallestBlackColumn).toBeLessThan(250);
  });
});
