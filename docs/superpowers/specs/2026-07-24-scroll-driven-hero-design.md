# Scroll-Driven Portfolio Hero Design

Date: 2026-07-24
Status: Approved direction, awaiting written-spec review

## Goal

Replace the current static two-column hero with a full-viewport, scroll-scrubbed introduction inspired by the supplied SaltyAom reference. The result should feel cinematic and reversible while remaining recognizably Alexis's existing coral portfolio.

The hero stays pinned for roughly one additional viewport. As the visitor scrolls, the oversized name and portrait move in layers, the supporting content gains emphasis, and the scene then releases into the existing homepage sections.

## Scope

### Included

- Recompose only the homepage hero and its responsive styles.
- Keep a sticky hero frame inside a taller scroll scene.
- Drive the animation from normalized scroll progress so scrolling upward reverses it.
- Reuse the current transparent portrait, localized copy, metrics, calls to action, colors, and decorative visual language.
- Preserve a readable static presentation when JavaScript is unavailable or reduced motion is requested.
- Verify desktop, tablet, mobile, both languages, and reverse scrolling.

### Excluded

- Copying the reference site's identity, photos, cosplay imagery, text, or project cards.
- Redesigning the navigation rail or any section below the hero.
- New routes, copy, analytics behavior, backend work, assets, or animation packages.
- GSAP, Framer Motion, a canvas renderer, or a general animation abstraction.
- Autoplaying or time-based hero animation.

## Existing Invariants

- Keep `HomePage` as the homepage and `/freelance` page implementation.
- Preserve the current French and English content and language switch.
- Preserve landing-view tracking and the conditional freelance geo lookup.
- Keep the existing project, service, experience, skill, and metric data as the source of truth.
- Keep the left desktop rail, mobile navigation, skip link, section IDs, routes, contact links, CV link, and portrait alternative text.
- Do not modify `api/analytics.js` or the user's existing uncommitted Neon changes in `package.json` and `package-lock.json`.

## Visual Composition

The scroll scene contains one sticky viewport frame with three visual layers:

1. **Backdrop:** the current coral gradient, grid, rings, code marks, and soft highlights expand to fill the hero frame and move only slightly for depth.
2. **Display layer:** one semantic `h1` renders the oversized localized name while the existing transparent portrait sits prominently in front of it.
3. **Content layer:** eyebrow, specialty, positioning copy, calls to action, technology pills, availability label, and real metric cards remain the current content but are arranged as compact overlays rather than a separate column.

The left navigation rail remains outside the scene. The sticky frame fills the remaining desktop canvas.

## Scroll Sequence

Scroll progress is clamped from `0` to `1` across the scene's sticky travel.

- **0.00-0.30 — Introduction:** the portrait is large and near center; `ALEXIS OTHILY` spans the frame behind it; the coral scene and short positioning line establish the page immediately.
- **0.30-0.72 — Layered slide:** the portrait translates and scales toward the right edge, the name tracks left at a different rate, and the backdrop drifts subtly to create depth.
- **0.55-1.00 — Content emphasis:** supporting copy, calls to action, technology pills, and proof cards settle into their final readable positions as the portrait clears the content area.
- **1.00 — Release:** the final composition holds at the end of the sticky travel, then normal document scrolling continues into the existing focus/projects content.

All movement is tied to scroll position. There is no timer, loop, snap point, or forced scroll behavior.

## Motion Architecture

`HomePage` owns a ref to the hero scroll scene. A small effect:

1. reads the scene's position and available sticky travel;
2. calculates normalized progress with one pure clamp helper;
3. writes progress to a CSS custom property on the scene;
4. schedules at most one update per animation frame from passive scroll and resize listeners; and
5. removes listeners and cancels any queued frame on unmount.

React state is not used for per-frame progress, so scrolling does not re-render the page. CSS consumes the custom property for transforms, opacity, and scale. The property's default value represents the readable final frame, so a script failure does not hide content.

The progress helper stays small and independently testable. No animation service, hook library, context, or reusable framework is introduced for one hero.

## Responsive Behavior

- **Desktop, 900px and wider:** approximately `180svh` scroll scene with a `100svh` sticky frame beside the fixed rail. The portrait has the largest horizontal travel and the display name spans the canvas.
- **Tablet and mobile:** a shorter scene around `150svh`, smaller typography, reduced portrait travel, and compact proof cards. The sticky frame accounts for the existing top navigation.
- **360px minimum width:** no horizontal overflow; calls to action wrap or stack; French and English headlines remain inside the viewport.
- **Reduced motion:** no sticky travel or transforms. The hero renders once in its final readable layout and flows normally with the page.

## Accessibility and Performance

- Keep one semantic `h1`; decorative duplicate shapes or lettering, if needed, are `aria-hidden`.
- Keep all interactive content in logical DOM order and visibly keyboard-focusable throughout the sequence.
- Do not trap, hijack, smooth, or programmatically advance scrolling.
- Preserve the meaningful portrait alternative text and hide decorative code, rings, and markers from assistive technology.
- Use transforms and opacity for moving layers; avoid layout writes after the progress calculation.
- Respect `prefers-reduced-motion: reduce` and maintain the existing visible focus treatment.

## Expected Files

- Modify `src/main.tsx` for the hero scene structure, ref, and progress update.
- Modify `src/styles.css` for the sticky scene, layered composition, progress-driven transforms, responsive rules, and reduced-motion fallback.
- Add one tiny scroll-progress helper and one native `node:test` check only if direct testing from `main.tsx` would require browser scaffolding.
- Do not add or modify dependencies.

## Verification

- Run the focused progress/clamping check and confirm it fails before implementation, then passes afterward.
- Run `npm run build`.
- Inspect `/` and `/freelance` at approximately 1280x720, 920px, 680px, and 360px.
- Scroll slowly forward and backward through the entire scene; confirm motion follows position without jumps and releases into the next section.
- Verify French and English content, CTA links, CV route, mobile navigation, and existing section anchors.
- Emulate reduced motion and confirm the static hero is complete and readable.
- Check for horizontal overflow and browser console errors.
- Review the final diff to confirm the unrelated package changes and analytics code were untouched.

## Acceptance Criteria

- The first viewport is a full-canvas portrait/name composition rather than the current side-by-side card layout.
- Scrolling scrubs and reverses the portrait, name, and backdrop movement.
- The hero remains pinned for roughly one additional viewport and then releases naturally.
- Existing localized content, real metrics, navigation, routes, and analytics behavior are preserved.
- The final state and reduced-motion fallback expose all important copy and actions.
- No new runtime dependency or asset is introduced.
- The production build and browser checks pass at desktop and mobile widths.
