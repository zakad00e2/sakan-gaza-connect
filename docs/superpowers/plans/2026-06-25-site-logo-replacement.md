# Site Logo Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every brand-logo presentation with optimized assets derived from the approved supplied image.

**Architecture:** A tightly cropped transparent master PNG in `public` is the single component-facing asset. Sharp generates favicon, Apple touch, and Open Graph derivatives; React components reference the master asset, while metadata references purpose-sized files.

**Tech Stack:** React, TypeScript, Vitest, Sharp, Vite

---

### Task 1: Lock Branding Requirements with Tests

**Files:**
- Modify: `src/components/Header.test.ts`
- Create: `src/components/Footer.test.ts`
- Create: `src/test/branding-assets.test.ts`

- [ ] **Step 1: Write failing component and asset tests**

Add assertions that the header and footer reference `/logo.png`, no longer import the Lucide `Home` icon for branding, and preserve the `سكن غزة` label. Add filesystem assertions for `public/logo.png`, favicon files, Apple touch icon, and `public/og-image.png`, including expected dimensions.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/Header.test.ts src/components/Footer.test.ts src/test/branding-assets.test.ts`

Expected: FAIL because the components still render `Home` and the approved logo assets have not been generated.

### Task 2: Generate Production Logo Assets

**Files:**
- Create: `public/logo.png`
- Modify: `public/favicon-16x16.png`
- Modify: `public/favicon-32x32.png`
- Modify: `public/apple-touch-icon.png`
- Modify: `public/og-image.png`
- Modify: `public/favicon.svg`
- Modify: `public/og-image.svg`

- [ ] **Step 1: Use Sharp to trim and normalize the supplied transparent PNG**

Trim transparent margins from the supplied 915×1080 image and save the resulting transparent master as `public/logo.png`.

- [ ] **Step 2: Generate square icon canvases**

Generate 16×16, 32×32, and 180×180 transparent PNGs using proportional containment and safe padding.

- [ ] **Step 3: Generate the Open Graph image**

Create a 1200×630 white canvas with the approved logo centered and proportionally sized.

- [ ] **Step 4: Update SVG fallbacks**

Make `favicon.svg` and `og-image.svg` embed or reproduce the approved logo instead of the old house icon.

### Task 3: Replace Component Branding

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace header brand icon**

Remove the branding-only `Home` import and render:

```tsx
<img
  src="/logo.png"
  alt=""
  className="h-10 w-10 object-contain"
  width={40}
  height={40}
  aria-hidden="true"
/>
```

- [ ] **Step 2: Replace footer brand icon**

Use the same optimized asset and dimensions while preserving the existing brand link and label.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- src/components/Header.test.ts src/components/Footer.test.ts src/test/branding-assets.test.ts`

Expected: PASS.

### Task 4: Update Metadata and Verify

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Point structured-data logos at the master logo**

Change both schema.org logo URLs from `https://sakangaza.com/og-image.png` to `https://sakangaza.com/logo.png`. Keep Open Graph and Twitter cards on `og-image.png`.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 3: Run lint and production build**

Run: `npm run lint`

Run: `npm run build`

Expected: both commands exit successfully.

- [ ] **Step 4: Inspect the rendered site**

Run the local Vite server and verify the header and footer at desktop and mobile widths, with no clipping, broken images, console errors, or layout regressions.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check`

Run: `git status --short`

Expected: no whitespace errors; only the planned logo work plus pre-existing unrelated user changes are present.
