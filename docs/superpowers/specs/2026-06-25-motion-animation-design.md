# Motion and Animation Design

## Goal

Add a consistent, medium-strength motion system to every application page without changing the product's layout, content, or navigation behavior. Motion should improve hierarchy and feedback while remaining quick and unobtrusive.

## Scope

The implementation covers:

- All routes registered in `src/App.tsx`.
- Shared page transitions.
- Repeated cards and list items.
- Expandable filter content.
- Primary interactive controls and listing images.
- Loading and empty states where a short entrance improves continuity.
- Automatic accommodation for reduced-motion preferences.

The implementation does not include:

- A visual redesign.
- Animated route-direction detection.
- Full-screen loading sequences.
- Decorative looping animations.
- Replacing the existing Radix UI animation behavior unless it conflicts with the shared motion system.

## Dependency Strategy

Install the published `motion` npm package and import React APIs from `motion/react`. The upstream Git repository will not be copied or vendored into the application because the package provides the supported consumer integration and keeps dependency updates manageable.

## Architecture

### Shared motion definitions

Create a focused motion module under `src/lib` that exports reusable transition values and variants for:

- Page entrance.
- Section entrance.
- Staggered containers.
- Staggered items.
- Expand-and-collapse content.

Durations and easing values will be centralized so the application can be tuned without editing every page.

### Route transition wrapper

Create a shared route-transition component that:

- Reads the current React Router location.
- Uses the pathname as the animation key.
- Wraps rendered routes with `AnimatePresence`.
- Applies a fade plus a small upward settling motion.
- Uses a 300 ms entrance transition and a 160 ms exit transition.
- Avoids a long exit animation that delays navigation.

Every route will receive the same base transition through this wrapper instead of duplicating animation code in each page.

### Reusable reveal components

Add small wrapper components for common animation patterns:

- `MotionPage` for page-level entrance.
- `MotionSection` for major content blocks.
- `MotionList` for staggered collections.
- `MotionItem` for cards or rows within a staggered collection.
- `MotionCollapse` for measured-height expandable content.

These wrappers will remain presentation-only. They will not own application data, fetching, routing, or business state.

## Motion Behavior

### Pages

Pages enter from a 12-pixel positive vertical offset while fading from transparent to opaque.

### Lists and cards

Listing grids, personal listing lists, admin queues, and similar repeated content reveal items with a short stagger. The stagger must be capped or kept small enough that long lists become usable immediately.

Cards receive a slight hover lift and shadow adjustment on pointer-capable devices. Tap interactions must not depend on hover behavior.

### Filters and collapsible sections

The advanced search filter area animates opacity and measured height when opened or closed. Content should remain accessible in the document flow, with no fixed-height assumptions.

### Buttons and controls

Enabled primary action buttons use a `0.98` press scale. Standalone call-to-action buttons may move upward by 1 pixel on hover; buttons inside menus, dialogs, forms, and table rows do not move. Existing focus styles, disabled behavior, and Radix UI state animations remain intact.

### Images

Listing thumbnails keep their current hover zoom but use Motion where useful to coordinate the card interaction. Image carousel transitions remain primarily opacity-based to avoid spatial disorientation.

### Loading and empty states

Existing spinners continue to spin. Their containing state may fade in, but no additional looping decoration will be introduced.

## Reduced Motion and Accessibility

The system will respect `prefers-reduced-motion` through Motion's reduced-motion support.

When reduced motion is requested:

- Page and section transforms are removed.
- Stagger delays are removed.
- Expand/collapse transitions become immediate or opacity-only.
- Essential loading indicators remain visible.
- Content and interaction behavior remain identical.

Animations must not:

- Trap focus.
- Delay keyboard access.
- Change DOM reading order.
- Make content dependent on hover.
- Introduce flashing or rapid repeated movement.

## Integration Plan by Area

### Application shell

Update `src/App.tsx` to integrate keyed route transitions while preserving lazy loading, authentication context, query context, toasts, and the existing route table.

### Home page

Animate the hero, safety notice, search block, listing grid, empty state, and load-more control. Listing cards use staggered entrance and interactive card motion.

### Detail and form pages

Apply page and section reveals to listing details, add-listing, and edit-listing pages. Form field validation and submission behavior remain unchanged.

### Authentication and informational pages

Apply the shared page transition and restrained section entrance to login, signup, authentication callback, safety, privacy policy, and not-found pages.

### User and administration pages

Apply staggered list animation to personal listings, pending listings, and reports. Confirmation dialogs retain the Radix UI transition unless a verified conflict appears.

### Shared navigation

Add restrained logo, navigation button, and mobile menu trigger feedback. Existing Sheet and Dropdown animations remain the source of truth for overlays.

## Error Handling

Motion wrappers must render children normally even when animation is reduced. They will not catch or suppress data-fetching errors. Existing loading, error, and empty-state branches remain responsible for application feedback.

If route content suspends during lazy loading, the existing page loader remains visible. The route transition must not leave the application blank while a chunk loads.

## Performance Constraints

- Animate `opacity` and `transform` whenever possible.
- Use measured height only for small collapsible regions such as filters.
- Avoid per-frame JavaScript state updates.
- Do not animate large shadows continuously.
- Keep stagger delay short and independent of total list length where possible.
- Avoid adding Motion wrappers around every small text node.
- Preserve lazy-loaded routes and current image lazy loading.

## Testing

Automated tests will cover the shared behavior rather than Motion's internals:

- Route content receives the page transition wrapper.
- Reduced-motion mode removes nonessential transforms and delays.
- Expandable filters remain present and usable after opening and closing.
- Listing and admin collections render all items when wrapped in stagger components.

Existing component and page tests must continue to pass. Verification will include:

- Targeted Vitest tests for new wrappers and changed components.
- Full test suite.
- ESLint.
- Production build.
- Browser checks across representative public, authenticated, form, detail, and admin routes when the required data or access is available.

## Acceptance Criteria

- The `motion` package is installed through npm.
- Every application route uses the shared fade-and-vertical page transition.
- Listing grids, personal listing lists, pending-listing queues, and report rows use the shared staggered entrance.
- Search filters open and close smoothly.
- Cards, buttons, and images receive medium-strength interactive feedback without layout shift.
- Reduced-motion preferences disable nonessential movement.
- Existing navigation, forms, authentication, data fetching, overlays, and accessibility behavior remain functional.
- Tests, lint, and production build complete successfully.
