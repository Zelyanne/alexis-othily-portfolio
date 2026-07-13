# Portfolio Literal Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing portfolio into a close, responsive visual reproduction of the supplied coral editorial reference while retaining every real content, route, analytics, accessibility, and pricing behavior.

**Architecture:** The tracked React/Vite app remains the production source. Tailwind v4 supplies utility foundations through its Vite plugin; one local `shadow-ui.tsx` file supplies the small reusable visual primitives, while `main.tsx` preserves all data, routes, and tracking logic. The ignored nested HTML file is the OpenDesign prototype only and must never replace the production Vite shell.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS v4, native CSS animations, TanStack Router.

---

## File map

- Modify: `package.json` and `package-lock.json` — add only Tailwind v4 development dependencies; preserve the user's Neon edits.
- Modify: `vite.config.ts` — register Tailwind's Vite plugin beside React.
- Create: `src/components/shadow-ui.tsx` — small local presentational primitives.
- Modify: `src/main.tsx` — layout and homepage composition only; retain data, pricing, tracking, CV, and count logic.
- Modify: `src/styles.css` — Tailwind import, coral editorial visual system, route-safe responsive styling, and reduced-motion rules.
- Modify (ignored prototype): `portfolio alexis/index.html` — static OpenDesign source matching the approved composition.
- Do not modify: `api/analytics.js`, production `index.html`, or the bilingual data objects except to read them.

## Task 1: Capture the failing visual contract

**Files:**
- Create: no repository test file
- Verify: `/` in a browser at 1440px, 920px, 680px, and 360px

- [ ] **Step 1: Start the existing app and record the red baseline**

Run:

```bash
npm run dev
```

Open `http://127.0.0.1:5173/` at 1440px. Capture a screenshot showing that the current page does not yet have the fixed narrow rail, ivory canvas, coral portrait stage, or stacked proof cards required by the approved reference.

- [ ] **Step 2: Record the acceptance checks before code changes**

The final screenshot must show:

```text
desktop: left rail + black/coral editorial headline + coral portrait panel + real stat cards
920px: compact rail remains; no overlap of portrait, cards, or heading
680px: accessible top menu replaces rail; hero is stacked
360px: no horizontal scroll; CTAs and stat cards remain usable
```

- [ ] **Step 3: Verify the existing functional baseline**

Run:

```bash
npm run build
```

Expected: `tsc && vite build` exits 0 before the redesign.

## Task 2: Add Tailwind v4 without disturbing user changes

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Modify: `src/styles.css:1`

- [ ] **Step 1: Install the minimal official Tailwind dependencies**

Run:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Expected: only Tailwind dependency entries are added; the existing `@neondatabase/serverless` edits remain present.

- [ ] **Step 2: Add the Tailwind Vite plugin**

Replace `vite.config.ts` with:

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
})
```

- [ ] **Step 3: Import Tailwind before the bespoke stylesheet**

Add this as the first line of `src/styles.css`:

```css
@import "tailwindcss";
```

Keep the existing route styles until Task 5 replaces them with route-safe equivalents.

- [ ] **Step 4: Build after configuration**

Run:

```bash
npm run build
```

Expected: exit 0; no CSS resolution or TypeScript errors.

## Task 3: Update the OpenDesign prototype and local primitives

**Files:**
- Modify: `portfolio alexis/index.html`
- Create: `src/components/shadow-ui.tsx`

- [ ] **Step 1: Replace the ignored prototype's dark floating-nav design with the approved static composition**

Implement a standalone static HTML preview with:

```text
aside.rail -> monogram, section anchors, status portrait
main -> ivory editorial canvas
section.hero -> left copy and right coral portrait stage
hero stats -> project/service/experience counts from the production data contract
below fold -> What I do, focus rows, project/service/experience/contact treatments
```

Use the real portrait asset through a relative path. Keep the artifact self-contained and responsive; no production scripts or analytics code belong here.

- [ ] **Step 2: Create only the five local Shadow UI-style primitives**

Export `ShadowCard`, `Pill`, `ArrowButton`, `StatCard`, and `FocusRow` from `src/components/shadow-ui.tsx`. Each must be a thin presentational wrapper around semantic HTML and `className`, for example:

```tsx
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & { children: ReactNode }

export function ShadowCard({ className = '', children, ...props }: CardProps) {
  return <article className={`shadow-card ${className}`} {...props}>{children}</article>
}

export function ArrowButton({ className = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`arrow-button ${className}`} {...props}>{children}<span aria-hidden="true">↗</span></a>
}
```

Do not create a component library, context, factory, or unverified Shadow UI dependency.

- [ ] **Step 3: Verify the prototype separately**

Open the ignored HTML artifact locally and confirm it uses the ivory/coral hierarchy and does not overwrite the tracked production `index.html`.

## Task 4: Recompose the production navigation and homepage

**Files:**
- Modify: `src/main.tsx:664-917`
- Import: `src/components/shadow-ui.tsx`

- [ ] **Step 1: Preserve all existing behavior before rearranging markup**

Leave unchanged:

```ts
trackLandingView(text.count.viewLabel)
trackLandingClick(project.slug, project.title, project.href)
setVisitorRegion(geo.pricingRegion)
const [menuOpen, setMenuOpen] = useState(false)
```

Keep every existing route and every existing `id`: `projects`, `services`, `skills`, `experience`, and `contact`.

- [ ] **Step 2: Replace the desktop header with a rail that degrades to the existing mobile menu**

The rail must keep native anchors, `aria-label`, `aria-controls`, `aria-expanded`, the skip link, CV route link, and language control. Use a semantic `<header>` and `<nav>`; do not add a second navigation tree.

- [ ] **Step 3: Build the reference-style hero from real data**

Use this structure:

```tsx
<section className="hero hero--editorial">
  <div className="heroCopy">{/* eyebrow, h1, real copy, work/CV actions, tech pill */}</div>
  <figure className="portraitStage">
    <span className="heroAvailability">{text.home.status}</span>
    <img src={portraitUrl} alt={text.home.portraitAlt} />
    <div className="statStack">{/* project, service, experience, skills facts */}</div>
  </figure>
</section>
```

Use data-derived values such as `projects.length`, `services.length`, `experiences.length`, and `skills.length`. Do not introduce reference-only claims such as research-paper counts.

- [ ] **Step 4: Restyle every existing section without changing data semantics**

Map:

```text
domains -> focus rows below the hero
projects -> numbered editorial project cards retaining tracked external links
services -> coral/ivory ShadowCard pricing cards retaining regional price lookup
skills + credentials -> pill and proof-card groups
experiences -> vertical timeline
contact -> closing coral contact panel
```

Keep `<section>`, heading order, links, `target="_blank"`, and `rel="noreferrer"` semantics intact.

- [ ] **Step 5: Typecheck**

Run:

```bash
npm run build
```

Expected: exit 0 after the new primitives and markup compile.

## Task 5: Apply the coral editorial system and responsive rules

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Replace dark global tokens with the reference palette**

Use a small token set:

```css
:root {
  --canvas: #f8f5f1;
  --ink: #171616;
  --muted: #6e6864;
  --line: #e8e0da;
  --coral: #ff5e5a;
  --coral-deep: #ef4948;
  --lavender: #7c61ff;
}
```

Scope homepage rules under `.homePage` or distinct new classes so `.cvPage` and `.countPage` keep their functional readable layouts.

- [ ] **Step 2: Implement only purposeful motion**

Define short entrance, drift, and hover effects. Keep:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
```

Do not add animation libraries, autoplay video, or visual effects unrelated to the reference.

- [ ] **Step 3: Add exact responsive breakpoints**

```css
@media (max-width: 899px) { /* rail becomes top menu; hero stacks */ }
@media (max-width: 639px) { /* compact type, 2-column stats, full-width CTAs */ }
@media (max-width: 360px) { /* protect long labels and prevent overflow */ }
```

At every breakpoint maintain 44px targets, visible focus, readable French/English labels, and no horizontal overflow.

- [ ] **Step 4: Rebuild**

Run:

```bash
npm run build
```

Expected: exit 0.

## Task 6: Execute visual and behavior acceptance checks

**Files:**
- Verify: `/`, `/cv`, and `/count`

- [ ] **Step 1: Run the visual green check**

With the Vite server running, capture the homepage at 1440px, 920px, 680px, and 360px. Compare each to the Task 1 contract:

```text
1440px: rail, ivory canvas, coral portrait panel, editorial hierarchy, proof cards
920px: rail and hero retain clear two-column composition
680px: top menu works and hero stacks
360px: no horizontal page scroll; all CTAs and section cards fit
```

- [ ] **Step 2: Check routes and interactions**

Verify:

```text
/ loads without console errors
/cv remains readable and its PDF frame renders
/count remains readable and analytics UI loads
mobile menu changes aria-expanded and opens primary navigation
project link still sends its existing click event handler
CV, mail, phone, and GitHub links retain their hrefs
both language variants render without clipping
```

- [ ] **Step 3: Perform the final build and diff review**

Run:

```bash
npm run build
git diff --check
git diff -- package.json package-lock.json vite.config.ts src/main.tsx src/styles.css src/components/shadow-ui.tsx
```

Expected: build exits 0, no whitespace errors, Tailwind-only dependency additions, no analytics edits, and no accidental changes to the user's Neon work.
