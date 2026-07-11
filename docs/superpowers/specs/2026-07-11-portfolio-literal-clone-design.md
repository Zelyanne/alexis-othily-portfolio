# Portfolio Literal Clone Design

Date: 2026-07-11
Status: Approved direction, awaiting written-spec review

## Goal

Rebuild the portfolio homepage as a close visual reproduction of the supplied editorial AI-engineer reference: warm ivory canvas, narrow navigation rail, oversized black-and-coral typography, a rounded coral portrait stage, proof cards, compact skill/focus rows, and restrained motion.

The visual shell changes; the portfolio's real bilingual content, projects, services, experience, contact details, routes, analytics, SEO behavior, and transparent portrait remain authoritative.

## Scope

### Included

- Update the ignored OpenDesign prototype in the nested `portfolio alexis/` design project.
- Translate the approved prototype into the React/Vite production app.
- Add Tailwind CSS v4 through the official Vite plugin.
- Build small local Shadow UI-style primitives for cards, pills, buttons, and list rows.
- Recompose every existing homepage section into the reference's visual language.
- Preserve and verify `/`, `/cv`, and `/count`.
- Add responsive and reduced-motion behavior.

### Excluded

- Invented research papers, credentials, project counts, testimonials, or client claims.
- New application routes, CMS behavior, backend work, or analytics changes.
- An unverified Shadow UI npm package.
- Replacing the production Vite `index.html` with a standalone generated page.

## Existing Invariants

- Keep all English/French copy and current language switching.
- Keep the current project, domain, skill, experience, credential, and service data.
- Keep regional service pricing and geo lookup behavior.
- Keep landing-page view tracking and project-click tracking.
- Keep existing section IDs and deep links.
- Keep the skip link, menu ARIA state, keyboard focus, portrait alternative text, and reduced-motion fallback.
- Preserve the user's existing Neon dependency edits in `package.json` and `package-lock.json`.

## Visual Architecture

### Desktop shell

- A fixed 76-84px left rail holds the monogram, section navigation, portrait/status control, and existing language control.
- The content canvas fills the remaining viewport over a warm ivory background with faint coral and lavender ambient gradients.
- Main content uses a wide editorial grid capped around 1500px.
- Borders are thin and warm gray; cards use soft multi-layer shadows and rounded corners instead of glassmorphism.

### Hero

- Left column: eyebrow badge, oversized condensed headline, short positioning copy, primary work CTA, CV CTA, and a technology pill.
- Headline keeps the reference's three-line rhythm, with the final line in coral, but uses the portfolio's real positioning.
- Right column: large coral rounded stage with the existing transparent portrait centered at the bottom.
- Decorative code text, line art, and small markers remain non-interactive and hidden from assistive technology.
- Real proof cards sit on the right side of the portrait stage. Values are derived from existing data rather than hard-coded marketing fiction.
- Availability is a localized static label derived from the existing contact CTA, not a live-presence signal.

### Homepage sections

- The first section below the hero mirrors the reference's “What I do / Focus areas” split.
- Existing domains become compact focus rows.
- Projects become editorial feature cards with strong numbering, category tags, and the existing tracked links.
- Services retain all five prices and descriptions inside coral/ivory Shadow UI-style cards.
- Skills and credentials become compact pill groups and proof rows.
- Experience becomes a clean vertical timeline.
- Contact becomes the closing coral panel with the existing email, phone, and GitHub links.

### Navigation

- Desktop rail highlights the active anchor while preserving native anchor navigation.
- Below 900px, the rail becomes the existing accessible top/mobile menu.
- No routing library changes are required.

## Tailwind and Shadow UI

### Tailwind

- Install `tailwindcss` and `@tailwindcss/vite` as development dependencies.
- Register the official `tailwindcss()` Vite plugin.
- Import Tailwind v4 in the existing stylesheet with `@import "tailwindcss";`.
- Keep bespoke composition, animation, and route-specific safeguards in `src/styles.css`; no `tailwind.config.js` or PostCSS scaffold is needed.

### Shadow UI

No current Tailwind-based Shadow UI package, installation guide, or license could be verified. The implementation must not guess a package name.

Use local React/Tailwind primitives that reproduce the requested soft-shadow treatment:

- `ShadowCard`
- `Pill`
- `ArrowButton`
- `StatCard`
- `FocusRow`

These primitives stay local and small. If the OpenDesign catalog exposes a verified copy-paste Shadow UI source with usable license terms, Terra may substitute its Badge, Button, Card, or Accordion primitive without changing the page architecture.

## OpenDesign Boundary

- Use the ignored nested design artifact at `portfolio alexis/index.html` for the visual prototype.
- Keep the tracked root `index.html` as the Vite application shell.
- The OpenDesign prototype is a design source, not production runtime code.
- Production implementation remains in React and must preserve all current behavior.

## Responsive Behavior

- Desktop: fixed rail and two-column hero.
- Tablet from 900px: compact fixed rail, reduced headline scale, narrower portrait stage, and two-column proof grid.
- Below 900px: top navigation and a stacked hero.
- Mobile below 640px: portrait below copy, two-column stat grid, stacked content cards, and full-width CTAs.
- No horizontal scrolling at 360px.
- Long English and French labels wrap without clipping.

## Motion

- Staggered hero entrance using opacity and short vertical translation.
- Slow decorative drift on the portrait-stage line art.
- Subtle lift and shadow increase on interactive cards and buttons.
- Technology pill uses a short, slow marquee on wide screens and becomes a static wrapping row under reduced motion or below 640px.
- `prefers-reduced-motion: reduce` removes non-essential transitions and animation.
- No animation dependency is required.

## Accessibility

- Maintain one logical `h1` and sequential section headings.
- Preserve visible keyboard focus and minimum 44px interactive targets.
- Keep sufficient coral/ivory and text/background contrast.
- Decorative elements use `aria-hidden`.
- Mobile menu state remains exposed with `aria-expanded` and `aria-controls`.
- Portrait keeps meaningful alternative text.

## Implementation Boundaries

- Terra owns all implementation and test edits for this task.
- Primary agent owns architecture, integration review, and final acceptance.
- Do not change `api/analytics.js`.
- Avoid unrelated refactors and do not rewrite bilingual data objects.
- Expected production files: `package.json`, `package-lock.json`, `vite.config.ts`, `src/main.tsx`, `src/styles.css`, and at most one small local UI primitive file.
- Expected ignored design file: `portfolio alexis/index.html`.

## Verification

- Run `npm run build`.
- Load `/`, `/cv`, and `/count` without runtime or console errors.
- Compare the homepage visually at approximately 1440px, 920px, 680px, and 360px.
- Verify mobile navigation, both language variants, CV download, contact links, project click tracking, and deep-link anchors.
- Confirm no horizontal overflow and no motion under reduced-motion emulation.
- Review the final diff for accidental changes to the existing Neon work or analytics.

## Acceptance Criteria

- The homepage is immediately recognizable as the supplied reference at desktop width.
- Real portfolio content replaces every reference-only claim.
- Tailwind v4 is integrated through the official Vite plugin.
- Shadow UI visual primitives are present without an invented dependency.
- All existing routes and tracking behavior still work.
- The layout remains usable and polished from 360px through wide desktop.
- Build and browser verification pass.
