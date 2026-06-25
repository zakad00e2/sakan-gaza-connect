# Motion and Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add consistent medium-strength Motion animations to every route, repeated listing/admin content, filters, cards, images, and primary actions while respecting reduced-motion preferences.

**Architecture:** Install the published `motion` package, place shared variants in one library module, and expose focused presentation wrappers from one component module. Apply a keyed route transition at the application shell, then integrate stagger/collapse/interaction primitives only in the shared and repeated UI areas that benefit from them.

**Tech Stack:** React 18, TypeScript, Vite, React Router 6, Motion for React (`motion/react`), Vitest, Testing Library, Tailwind CSS.

---

## File Structure

- Create `src/lib/motion.ts`: centralized transitions and variants with no React rendering concerns.
- Create `src/components/motion/MotionPrimitives.tsx`: reusable page, section, list, item, collapse, and interaction wrappers.
- Create `src/components/motion/MotionPrimitives.test.tsx`: behavior and reduced-motion contract tests for the wrappers.
- Create `src/components/motion/RouteTransition.tsx`: keyed React Router transition boundary.
- Create `src/components/motion/RouteTransition.test.tsx`: route-key and Motion configuration tests.
- Modify `src/App.tsx`: install the route transition boundary around the existing route table.
- Modify `src/components/SearchFilters.tsx`: replace conditional CSS entrance with measured-height Motion collapse.
- Create `src/components/SearchFilters.motion.test.tsx`: open/close regression test for filter accessibility.
- Modify `src/pages/Index.tsx`: animate hero sections, state changes, listing grid, and load-more action.
- Modify `src/components/ListingCard.tsx`: add shared stagger item and restrained card/image interactions.
- Modify `src/pages/MyListings.tsx`: stagger personal listings.
- Modify `src/components/MyListingCard.tsx`: add shared item/card interactions.
- Modify `src/pages/AdminPending.tsx`: stagger pending-listing cards.
- Modify `src/pages/AdminReports.tsx`: stagger report cards.
- Modify `src/components/ui/button.tsx`: add press feedback to enabled primary buttons without changing Radix `asChild` behavior.
- Modify `src/index.css`: remove obsolete per-card CSS animation and add reduced-motion fallback for remaining CSS transitions.
- Modify `package.json` and `package-lock.json`: add the `motion` dependency.

### Task 1: Install the supported Motion package

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the package**

Run:

```powershell
npm install motion
```

Expected: exit code `0`; `package.json` contains a `motion` dependency and `package-lock.json` records the resolved package.

- [ ] **Step 2: Verify the package entry point**

Run:

```powershell
node -e "import('motion/react').then(() => console.log('motion/react ok'))"
```

Expected:

```text
motion/react ok
```

- [ ] **Step 3: Commit the dependency**

```powershell
git add package.json package-lock.json
git commit -m "build: add motion dependency"
```

### Task 2: Build shared motion definitions and primitives

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/components/motion/MotionPrimitives.tsx`
- Create: `src/components/motion/MotionPrimitives.test.tsx`

- [ ] **Step 1: Write the failing primitive tests**

Create `src/components/motion/MotionPrimitives.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async () => {
  const React = await import("react");

  const createMotionElement = (tag: string) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>(
      ({ children, variants, initial, animate, exit, whileHover, whileTap, ...props }, ref) =>
        React.createElement(
          tag,
          {
            ...props,
            ref,
            "data-variants": variants ? "present" : undefined,
            "data-initial": initial,
            "data-animate": animate,
            "data-exit": exit,
            "data-hover": whileHover ? "present" : undefined,
            "data-tap": whileTap ? "present" : undefined,
          },
          children,
        ),
    );

  return {
    motion: new Proxy({}, { get: (_, tag: string) => createMotionElement(tag) }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: vi.fn(() => false),
  };
});

import {
  MotionCollapse,
  MotionItem,
  MotionList,
  MotionPage,
  MotionSection,
  MotionSurface,
} from "./MotionPrimitives";

describe("MotionPrimitives", () => {
  it("applies shared variants to page, section, list, and item wrappers", () => {
    render(
      <MotionPage data-testid="page">
        <MotionSection data-testid="section">
          <MotionList data-testid="list">
            <MotionItem data-testid="item">Item</MotionItem>
          </MotionList>
        </MotionSection>
      </MotionPage>,
    );

    for (const id of ["page", "section", "list", "item"]) {
      expect(screen.getByTestId(id)).toHaveAttribute("data-variants", "present");
    }
  });

  it("keeps collapse content mounted only while open", () => {
    const { rerender } = render(
      <MotionCollapse open={false}>
        <div>Advanced filters</div>
      </MotionCollapse>,
    );
    expect(screen.queryByText("Advanced filters")).not.toBeInTheDocument();

    rerender(
      <MotionCollapse open>
        <div>Advanced filters</div>
      </MotionCollapse>,
    );
    expect(screen.getByText("Advanced filters")).toBeInTheDocument();
  });

  it("adds hover and press feedback to interactive surfaces", () => {
    render(<MotionSurface data-testid="surface">Card</MotionSurface>);
    expect(screen.getByTestId("surface")).toHaveAttribute("data-hover", "present");
    expect(screen.getByTestId("surface")).toHaveAttribute("data-tap", "present");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npx vitest run src/components/motion/MotionPrimitives.test.tsx
```

Expected: FAIL because `./MotionPrimitives` does not exist.

- [ ] **Step 3: Add centralized definitions**

Create `src/lib/motion.ts`:

```ts
import type { Transition, Variants } from "motion/react";

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const pageTransition: Transition = {
  duration: 0.3,
  ease: easeOut,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: pageTransition },
  exit: { opacity: 0, transition: { duration: 0.16, ease: "easeOut" } },
};

export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: easeOut } },
};

export const listVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.045, delayChildren: 0.03 } },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOut } },
};

export const collapseVariants: Variants = {
  closed: { height: 0, opacity: 0, overflow: "hidden" },
  open: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: { height: { duration: 0.26, ease: easeOut }, opacity: { duration: 0.2 } },
  },
};
```

- [ ] **Step 4: Add reusable rendering wrappers**

Create `src/components/motion/MotionPrimitives.tsx`:

```tsx
import type { PropsWithChildren } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import {
  collapseVariants,
  itemVariants,
  listVariants,
  pageVariants,
  sectionVariants,
} from "@/lib/motion";

type DivProps = HTMLMotionProps<"div">;

export function MotionPage({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" {...props}>
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div variants={sectionVariants} initial="initial" animate="animate" {...props}>
      {children}
    </motion.div>
  );
}

export function MotionList({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div variants={listVariants} initial="initial" animate="animate" {...props}>
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

export function MotionCollapse({
  open,
  children,
  ...props
}: PropsWithChildren<DivProps & { open: boolean }>) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="motion-collapse"
          variants={collapseVariants}
          initial="closed"
          animate="open"
          exit="closed"
          {...props}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MotionSurface({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Run the primitive test and verify GREEN**

Run:

```powershell
npx vitest run src/components/motion/MotionPrimitives.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 6: Commit the primitives**

```powershell
git add src/lib/motion.ts src/components/motion/MotionPrimitives.tsx src/components/motion/MotionPrimitives.test.tsx
git commit -m "feat: add shared motion primitives"
```

### Task 3: Add keyed transitions to every route

**Files:**
- Create: `src/components/motion/RouteTransition.tsx`
- Create: `src/components/motion/RouteTransition.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing route-transition test**

Create `src/components/motion/RouteTransition.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children, mode }: { children: React.ReactNode; mode: string }) => (
      <div data-presence-mode={mode}>{children}</div>
    ),
    motion: {
      div: ({ children, initial, animate, exit, ...props }: Record<string, unknown>) => (
        <div
          {...props}
          data-initial={String(initial)}
          data-animate={String(animate)}
          data-exit={String(exit)}
        >
          {children as React.ReactNode}
        </div>
      ),
    },
  };
});

import { RouteTransition } from "./RouteTransition";

describe("RouteTransition", () => {
  it("keys page content by pathname and applies wait-mode presence", () => {
    render(
      <MemoryRouter initialEntries={["/safety"]}>
        <RouteTransition>
          {(location) => (
            <Routes location={location}>
              <Route path="/safety" element={<div>Safety</div>} />
            </Routes>
          )}
        </RouteTransition>
      </MemoryRouter>,
    );

    expect(screen.getByText("Safety").closest("[data-route-path]")).toHaveAttribute(
      "data-route-path",
      "/safety",
    );
    expect(screen.getByText("Safety").closest("[data-presence-mode]")).toHaveAttribute(
      "data-presence-mode",
      "wait",
    );
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npx vitest run src/components/motion/RouteTransition.test.tsx
```

Expected: FAIL because `./RouteTransition` does not exist.

- [ ] **Step 3: Implement the route boundary**

Create `src/components/motion/RouteTransition.tsx`:

```tsx
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type Location, useLocation } from "react-router-dom";
import { pageVariants } from "@/lib/motion";

interface RouteTransitionProps {
  children: (location: Location) => ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        data-route-path={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children(location)}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Integrate it into the application shell**

In `src/App.tsx`, import `MotionConfig` and `RouteTransition`, then replace the direct route table with:

```tsx
<MotionConfig reducedMotion="user">
  <RouteTransition>
    {(location) => (
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/add" element={<AddListing />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/my" element={<MyListings />} />
        <Route path="/my/edit/:id" element={<EditListing />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/pending" element={<AdminPending />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )}
  </RouteTransition>
</MotionConfig>
```

Keep this block inside `BrowserRouter`, `AuthProvider`, and the existing `Suspense`.

- [ ] **Step 5: Run route and existing application tests**

Run:

```powershell
npx vitest run src/components/motion/RouteTransition.test.tsx src/pages/Index.test.ts src/components/Header.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit route transitions**

```powershell
git add src/App.tsx src/components/motion/RouteTransition.tsx src/components/motion/RouteTransition.test.tsx
git commit -m "feat: animate route transitions"
```

### Task 4: Animate advanced-filter expansion

**Files:**
- Modify: `src/components/SearchFilters.tsx`
- Create: `src/components/SearchFilters.motion.test.tsx`

- [ ] **Step 1: Write the failing filter interaction test**

Create `src/components/SearchFilters.motion.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchFilters, type Filters } from "./SearchFilters";

const filters: Filters = {
  search: "",
  area: "",
  type: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  rooms: "",
  capacity: "",
};

describe("SearchFilters motion", () => {
  it("keeps advanced controls usable after opening and removes them after closing", () => {
    render(<SearchFilters filters={filters} onFiltersChange={() => undefined} />);

    const toggle = screen.getByRole("button", { name: "عرض الفلاتر المتقدمة" });
    expect(screen.queryByText("كل المناطق")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText("كل المناطق")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggle);
    expect(screen.queryByText("كل المناطق")).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npx vitest run src/components/SearchFilters.motion.test.tsx
```

Expected: FAIL because the filter button has no accessible name or `aria-expanded`.

- [ ] **Step 3: Integrate `MotionCollapse` and accessibility state**

In `src/components/SearchFilters.tsx`:

```tsx
import { MotionCollapse } from "@/components/motion/MotionPrimitives";
```

Add these props to the filter toggle:

```tsx
aria-label="عرض الفلاتر المتقدمة"
aria-expanded={showFilters}
aria-controls="advanced-search-filters"
```

Replace:

```tsx
{showFilters && (
  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
```

with:

```tsx
<MotionCollapse open={showFilters} id="advanced-search-filters">
  <div className="mt-4 pt-4 border-t border-border">
```

and replace the matching closing conditional with:

```tsx
  </div>
</MotionCollapse>
```

- [ ] **Step 4: Run the filter test and verify GREEN**

Run:

```powershell
npx vitest run src/components/SearchFilters.motion.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit filter animation**

```powershell
git add src/components/SearchFilters.tsx src/components/SearchFilters.motion.test.tsx
git commit -m "feat: animate advanced search filters"
```

### Task 5: Animate the home page and listing cards

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/ListingCard.tsx`
- Create: `src/components/ListingCard.motion.test.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write a failing listing-card regression test**

Create `src/components/ListingCard.motion.test.tsx` using a minimal valid `Listing` fixture:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/lib/constants";

const listing: Listing = {
  id: "listing-1",
  title: "شقة للاختبار",
  description: "وصف",
  area: "غزة",
  type: "rent",
  property_type: "apartment",
  price: 500,
  price_note: null,
  rooms: 2,
  capacity: 4,
  floor_area: null,
  contact_name: "Test",
  contact_phone: "000",
  whatsapp_enabled: false,
  status: "active",
  created_at: "2026-06-25T00:00:00.000Z",
  owner_id: "user-1",
  utilities: { water: true, electricity: true, internet: false },
  listing_images: [],
};

describe("ListingCard motion", () => {
  it("uses a motion surface and keeps its listing link", () => {
    render(
      <MemoryRouter>
        <ListingCard listing={listing} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /شقة للاختبار/ });
    expect(link).toHaveAttribute("href", "/listing/listing-1");
    expect(link.parentElement).toHaveAttribute("data-motion-card", "true");
  });
});
```

- [ ] **Step 2: Run the card test and verify RED**

Run:

```powershell
npx vitest run src/components/ListingCard.motion.test.tsx
```

Expected: FAIL because the card has no `data-motion-card` wrapper.

- [ ] **Step 3: Apply shared home-page reveals**

In `src/pages/Index.tsx`, import:

```tsx
import {
  MotionList,
  MotionSection,
} from "@/components/motion/MotionPrimitives";
```

Wrap the hero, safety notice, and search area in `MotionSection`. Replace the listing grid root:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

with:

```tsx
<MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

Close it with `</MotionList>`. Wrap empty, loading, and load-more state containers in `MotionSection` so state replacement fades in without adding looping animation.

- [ ] **Step 4: Apply card and image feedback**

In `src/components/ListingCard.tsx`, import `MotionItem`, `MotionSurface`, and `motion` from `motion/react`. Structure the root as:

```tsx
<MotionItem>
  <MotionSurface data-motion-card="true" className="h-full">
    <Link to={`/listing/${listing.id}`} className="listing-card block h-full overflow-hidden">
      {/* existing card content */}
    </Link>
  </MotionSurface>
</MotionItem>
```

Replace the `<img>` with:

```tsx
<motion.img
  src={imageUrl}
  alt={listing.title}
  className="w-full h-full object-cover"
  whileHover={{ scale: 1.045 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  loading="lazy"
/>
```

- [ ] **Step 5: Remove the obsolete CSS card entrance**

In `src/index.css`, keep the `.listing-card` styling but do not add `animate-fade-in` to card instances. Add:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Run home and card tests**

Run:

```powershell
npx vitest run src/components/ListingCard.motion.test.tsx src/pages/Index.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit home-page motion**

```powershell
git add src/pages/Index.tsx src/components/ListingCard.tsx src/components/ListingCard.motion.test.tsx src/index.css
git commit -m "feat: animate home listing experience"
```

### Task 6: Animate personal and administrative collections

**Files:**
- Modify: `src/pages/MyListings.tsx`
- Modify: `src/components/MyListingCard.tsx`
- Modify: `src/pages/AdminPending.tsx`
- Modify: `src/pages/AdminReports.tsx`
- Create: `src/test/motion-collection-integration.test.ts`

- [ ] **Step 1: Write the failing integration-source test**

Create `src/test/motion-collection-integration.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("motion collection integration", () => {
  it.each([
    "src/pages/MyListings.tsx",
    "src/pages/AdminPending.tsx",
    "src/pages/AdminReports.tsx",
  ])("%s uses MotionList for repeated content", (path) => {
    const source = read(path);
    expect(source).toContain("MotionList");
    expect(source).toContain("MotionItem");
  });

  it("uses MotionSurface for personal listing cards", () => {
    expect(read("src/components/MyListingCard.tsx")).toContain("MotionSurface");
  });
});
```

- [ ] **Step 2: Run the integration test and verify RED**

Run:

```powershell
npx vitest run src/test/motion-collection-integration.test.ts
```

Expected: FAIL because the collection pages do not import or render the shared wrappers.

- [ ] **Step 3: Animate personal listings**

In `src/pages/MyListings.tsx`, import `MotionList` and `MotionItem`. Replace the populated grid root with `MotionList` and wrap each `MyListingCard`:

```tsx
<MotionItem key={listing.id}>
  <MyListingCard
    listing={listing}
    onDelete={handleDelete}
    onStatusChange={handleStatusChange}
  />
</MotionItem>
```

In `src/components/MyListingCard.tsx`, wrap the existing root card in:

```tsx
<MotionSurface className="h-full">
  <div className="bg-card rounded-xl border border-border overflow-hidden h-full">
    {/* existing content */}
  </div>
</MotionSurface>
```

- [ ] **Step 4: Animate pending listings**

In `src/pages/AdminPending.tsx`, import `MotionList` and `MotionItem`. Replace the populated `space-y-4` container with `MotionList`, and wrap each existing keyed `Card`:

```tsx
<MotionItem key={listing.id}>
  <Card className="overflow-hidden">
    {/* existing content */}
  </Card>
</MotionItem>
```

- [ ] **Step 5: Animate report rows**

In `src/pages/AdminReports.tsx`, import `MotionList` and `MotionItem`. Replace the populated `space-y-4` container with `MotionList`, and wrap each existing keyed `Card`:

```tsx
<MotionItem key={report.id}>
  <Card className="overflow-hidden">
    {/* existing content */}
  </Card>
</MotionItem>
```

- [ ] **Step 6: Run the collection integration test**

Run:

```powershell
npx vitest run src/test/motion-collection-integration.test.ts
```

Expected: PASS, 4 cases.

- [ ] **Step 7: Commit collection animations**

```powershell
git add src/pages/MyListings.tsx src/components/MyListingCard.tsx src/pages/AdminPending.tsx src/pages/AdminReports.tsx src/test/motion-collection-integration.test.ts
git commit -m "feat: animate listing and admin collections"
```

### Task 7: Add restrained header interactions

**Files:**
- Modify: `src/components/Header.tsx`
- Create: `src/components/Header.motion.test.ts`

- [ ] **Step 1: Write the failing header integration test**

Create `src/components/Header.motion.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Header motion integration", () => {
  it("adds motion feedback to branding and the mobile menu trigger", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/Header.tsx"),
      "utf8",
    );

    expect(source).toContain('from "motion/react"');
    expect(source).toContain('data-motion-brand="true"');
    expect(source).toContain("active:scale-95");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npx vitest run src/components/Header.motion.test.ts
```

Expected: FAIL because the header has no Motion branding or mobile-trigger scale.

- [ ] **Step 3: Add branding feedback**

In `src/components/Header.tsx`, import:

```tsx
import { motion } from "motion/react";
```

Replace the logo icon container with:

```tsx
<motion.div
  data-motion-brand="true"
  className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg sm:rounded-lg bg-primary flex items-center justify-center"
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.18, ease: "easeOut" }}
  aria-hidden="true"
>
  <Home className="w-6 h-6 sm:w-6 sm:h-6 text-primary-foreground" />
</motion.div>
```

- [ ] **Step 4: Add mobile-menu trigger feedback**

Add `active:scale-95 transition-transform duration-150` to the mobile Sheet trigger button class:

```tsx
className="h-10 w-10 p-0 border-primary/20 shrink-0 active:scale-95 transition-transform duration-150"
```

- [ ] **Step 5: Run header tests**

Run:

```powershell
npx vitest run src/components/Header.motion.test.ts src/components/Header.test.ts src/components/Header.auth.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit header interactions**

```powershell
git add src/components/Header.tsx src/components/Header.motion.test.ts
git commit -m "feat: add header motion feedback"
```

### Task 8: Add restrained primary-button feedback

**Files:**
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/button.motion.test.tsx`

- [ ] **Step 1: Write the failing button test**

Create `src/components/ui/button.motion.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button motion feedback", () => {
  it("adds press feedback only to enabled default buttons", () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("active:scale-[0.98]");
    expect(screen.getByRole("button", { name: "Ghost" })).not.toHaveClass("active:scale-[0.98]");
    expect(screen.getByRole("button", { name: "Disabled" })).toHaveClass("disabled:active:scale-100");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npx vitest run src/components/ui/button.motion.test.tsx
```

Expected: FAIL because the new scale classes are absent.

- [ ] **Step 3: Add state-safe button feedback**

In `src/components/ui/button.tsx`, extend only the default variant:

```ts
default:
  "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:active:scale-100",
```

Add `transition-[color,background-color,border-color,transform] duration-150` to the shared base classes. Do not add hover translation to the shared button primitive because it is used inside forms, dialogs, menus, and tables.

- [ ] **Step 4: Run the button test**

Run:

```powershell
npx vitest run src/components/ui/button.motion.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit button feedback**

```powershell
git add src/components/ui/button.tsx src/components/ui/button.motion.test.tsx
git commit -m "feat: add primary button press feedback"
```

### Task 9: Verify the complete motion system

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run focused motion tests**

Run:

```powershell
npx vitest run src/components/motion/MotionPrimitives.test.tsx src/components/motion/RouteTransition.test.tsx src/components/SearchFilters.motion.test.tsx src/components/ListingCard.motion.test.tsx src/test/motion-collection-integration.test.ts src/components/Header.motion.test.ts src/components/ui/button.motion.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 2: Run the full test suite**

Run:

```powershell
npm test
```

Expected: exit code `0`, no failed tests.

- [ ] **Step 3: Run lint**

Run:

```powershell
npm run lint
```

Expected: exit code `0`. If pre-existing warnings are reported, record them separately; do not introduce new errors or warnings in changed files.

- [ ] **Step 4: Run the production build**

Run:

```powershell
npm run build
```

Expected: exit code `0`; Vite emits the production bundle to `dist`.

- [ ] **Step 5: Start the development server for browser verification**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite serves the application at `http://127.0.0.1:8080`.

- [ ] **Step 6: Verify representative routes in the browser**

Check:

- `/`: hero, safety notice, filters, listing state, card hover, image zoom, and load-more control.
- `/safety`: shared page transition and content readability.
- `/login`: shared page transition and form usability.
- `/add`: shared page transition and form controls.
- `/listing/<available-id>`: shared page transition and carousel behavior when a listing is available.
- `/my`, `/admin/pending`, `/admin/reports`: staggered collections when authentication and permissions are available.
- Browser console: no new runtime errors or Motion warnings.
- Emulated `prefers-reduced-motion: reduce`: page transforms, stagger, card lift, and image zoom are suppressed while content remains usable.

- [ ] **Step 7: Inspect the final diff**

Run:

```powershell
git status --short
git diff --check
git diff --stat
```

Expected: only planned files are changed; `git diff --check` exits `0`.

- [ ] **Step 8: Commit any final verification fixes**

If verification required fixes:

```powershell
git add src package.json package-lock.json
git commit -m "fix: finalize motion integration"
```

If no fixes were required, do not create an empty commit.
