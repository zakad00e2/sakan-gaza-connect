# Site Logo Replacement Design

## Goal

Replace the existing house icon with the supplied Sakan Gaza logo everywhere the site presents its brand identity.

## Source Asset

- Source: `C:\Users\zeka1\Downloads\ChatGPT Image 25 يونيو 2026، 12_25_39 م (1).png`
- Preserve the supplied symbol, olive-green color, proportions, and transparent background.
- Remove unnecessary transparent padding before generating production assets.

## Scope

The replacement covers:

- Header branding
- Footer branding
- Browser favicons at 16 and 32 pixels
- Apple touch icon
- Main reusable logo asset
- Open Graph and social-sharing image
- Structured metadata references in `index.html`

The Arabic text `سكن غزة` remains beside the logo in the header and footer.

## Asset Strategy

Create a clean, tightly cropped master PNG in `public` and derive correctly sized PNG assets from it. Use the master asset in page components rather than embedding the original 915×1080 download directly.

Small favicons will use a square canvas with proportional padding so the complete symbol remains recognizable and is not clipped. The social-sharing image will retain the existing 1200×630 canvas while replacing its old house artwork with the new logo.

## Component Changes

- Replace the Lucide `Home` brand icon in `Header.tsx` with an image element.
- Replace the Lucide `Home` brand icon in `Footer.tsx` with the same image asset.
- Preserve current link behavior, accessible labels, spacing, and adjacent brand text.
- Mark the decorative logo image with an empty alternative text because the surrounding link already has an accessible brand label.

## Verification

- Run the existing test suite.
- Run the production build.
- Verify that generated assets have the expected dimensions and transparency.
- Inspect the header and footer at desktop and mobile widths.
- Verify favicon and social metadata paths resolve to the new files.

## Non-Goals

- No redesign of the header or footer.
- No typography, navigation, or theme-color changes.
- No changes to non-brand uses of the Lucide `Home` icon.
